import Promise from 'bluebird';

export default class WebRTCService {

  constructor(localVideoElement, remoteVideoElement, socket, verbose) {
    this.localVideoStream = null;           // Video/audio stream from webcam
    this.remoteVideoStream = null;          // Video/audio stream from counterpart
    this.localVideo = localVideoElement;    // HTML5 video tag to attach local stream to
    this.remoteVideo = remoteVideoElement;  // HTML5 video tag to attach remote stream to
    this.rtcpc = null;                      // RTCPeerConnection instance
    this.isCaller = null;                   // Caller or Callee
    this.socket = socket;                   // Socket.IO instance to send messages through
    this.verbose = verbose || false;        // Toggle debug message logging

    // Class Method Bindings
    this.log = this.log.bind(this);
    this.start = this.start.bind(this);
    this.startVideoCapture = this.startVideoCapture.bind(this);
    this.stopVideoCapture = this.stopVideoCapture.bind(this);
    this.createPeerConnection = this.createPeerConnection.bind(this);
    this.handleGatherIceCandidate = this.handleGatherIceCandidate.bind(this);
    this.handleAddStream = this.handleAddStream.bind(this);
    this.handleRemoveStream = this.handleRemoveStream.bind(this);
    this.handleReceiveIceCandidate = this.handleReceiveIceCandidate.bind(this);
    this.handleReceiveOffer = this.handleReceiveOffer.bind(this);
    this.handleReceiveAnswer = this.handleReceiveAnswer.bind(this);
    this.sendOffer = this.sendOffer.bind(this);
    this.sendAnswer = this.sendAnswer.bind(this);
    this.hangup = this.hangup.bind(this);
  };

  // Convenience method for logging debugging messages
  log() {
    this.verbose && console.log.apply(console, ['WebRTCService:', ...arguments]);
  };

  // ======================================
  // =========Media Stream Methods=========
  // ======================================

  // Main entry point
  start() {
    return new Promise( (resolve, reject) => {
      this.log('Starting video capture...');
      this.startVideoCapture()
      .then( (stream) => {
        this.log('Local media stream acquired');
        this.localVideo.src = stream;
        this.createPeerConnection();
        resolve();
      })
      .catch( (err) => {
        console.error('Failed to acquire local media stream.\n', err);
        reject(err);
      });
    });
  };

  // Request media stream from local webcam/microphone
  startVideoCapture(constraints) {
    constraints = constraints || {audio: true, video: true};
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia(constraints)
      .then( (stream) => {
        this.localVideoStream = stream;
        resolve(URL.createObjectURL(stream));
      })
      .catch( (err) => {
        reject(err);
      });
    });
  };

  // End local media stream
  stopVideoCapture() {
    this.log('Ending video capture...');
    if (this.localVideoStream) {
      // Need to call stop() on each track in stream.
      let tracks = this.localVideoStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
    }
  };

  // Create and initialize RTCPeerConnection instance
  createPeerConnection() {
    try {
      this.log('Creating RTCPeerConnection...');
      // TODO: The addresses to the STUN and/or TURN servers.
      let STServers =  {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]}; // null is also an acceptable value
      this.rtcpc = new RTCPeerConnection(STServers);
      // Add local stream to send to recipient
      this.rtcpc.addStream(this.localVideoStream);
      // Listen for and handle our own local ICE Candidate
      this.rtcpc.onicecandidate = this.handleGatherIceCandidate;
      // Listen for and handle the remote stream
      this.rtcpc.onaddstream = this.handleAddStream;
      // Listen for and handle a hangup from recipient
      this.rtcpc.onremovestream = this.handleRemoveStream;
      // Signal parent component to prepare the socket
    } catch (err) {
      console.error('Failed to create RTCPeerConnection.\n', err);
    }
  };

  // =====================================
  // ============WebRTC Events============
  // =====================================

  // Receive and send a local ICE Candidate
  handleGatherIceCandidate(event) {
    // If we ever need to reduce traffic to the signal server for performance reasons,
    // we could accumulate candidates and only send once we have finished gathering.
    // https://stackoverflow.com/questions/38533288/how-to-begin-gathering-ice-candidates-for-peer-connection
    if (event.candidate) {
      this.log('Local ICE Candidate acquired, sending ICE Candidate...');
      let candidateMessage = {
        type: 'ICECandidate',
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      };
      // Send ICE Candidate to counterpart
      this.socket.relay(candidateMessage);
    } else {
      this.log('Finished gathering ICE Candidates');
    }
  };

  // Receive the remote stream
  handleAddStream(event) {
    this.remoteVideoStream = event.stream;
    this.remoteVideo.src = URL.createObjectURL(this.remoteVideoStream);
  };

  // Counterpart hung up
  handleRemoveStream(event) {
    this.log('Remote stream has ended');
    this.remoteVideoStream = this.remoteVideo.src = '';
    this.caller = true;
  };

  // =====================================
  // ============Signal Events============
  // =====================================

  // Receive an ICE Candidate from counterpart
  handleReceiveIceCandidate(remoteIceCandidate) {
    this.log('ICE Candidate received from counterpart');
    let remoteCandidate = new RTCIceCandidate({
      sdpMLineIndex: remoteIceCandidate.sdpMLineIndex,
      candidate: remoteIceCandidate.candidate
    });
    // Add remote ICE Candidate to candidates
    this.rtcpc.addIceCandidate(remoteCandidate);
  };

  // Receive an offer from the caller
  handleReceiveOffer(remoteSession) {
    this.log('Offer received from Caller');
    this.rtcpc.setRemoteDescription(remoteSession);
    this.sendAnswer();
  };

  // Receive an answer from the callee
  handleReceiveAnswer(remoteSession) {
    this.log('Answer received from Callee');
    this.rtcpc.setRemoteDescription(remoteSession);
  };

  // =====================================
  // ===========Signal Emitters===========
  // =====================================

  // Create offer, set local description, and send to Callee
  sendOffer() {
    // Only execute if we are the caller
    if (this.isCaller) {
      this.log('Sending offer to Callee...');
      this.rtcpc.createOffer()
      .then( (localSession) => {
        this.rtcpc.setLocalDescription(localSession);
        this.socket.relay({
          type: 'Offer',
          sdp: localSession
        });
      })
      .catch( (err) => {
        console.error('Error creating offer!\n', err);
      });
    }
  };

  // Create answer, set local description, and send to Caller
  sendAnswer() {
    this.log('Sending answer to Caller...');
    this.rtcpc.createAnswer()
    .then( (localSession) => {
      this.rtcpc.setLocalDescription(localSession);
      this.socket.relay({
        type: 'Answer',
        sdp: localSession
      });
    })
    .catch( (err) => {
      console.error('Error creating answer!\n', err);
    });
  };

  hangup() {
    this.stopVideoCapture();
    if (this.socket) {
      this.socket.relay({type: 'Bye'});
      this.socket.reset(false);
    }
  };

}
