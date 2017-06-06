import EventEmitter from 'EventEmitter';
import Promise from 'bluebird';

export default class WebRTCService {

  // constructor (localVideoElement, remoteVideoElement) {
  constructor (localVideoElement, remoteVideoElement, socket, verbose) {
    this.localVideoStream = null;         // Video/audio stream from webcam
    this.remoteVideoStream = null;        // Video/audio stream from counterpart
    this.localVideo = localVideoElement;  // HTML5 video tag to attach local stream to
    this.remoteVideo = remoteVideo;       // HTML5 video tag to attach remote stream to
    this.rtcpc = null;                    // RTCPeerConnection instance
    this.socket = socket;                 // Socket.IO instance to send messages through
    this.verbose = verbose || false;      // Toggle debug message logging
  };

  // Convenience method for logging debugging messages
  log() {
    this.verbose && console.log.apply(console, ['WebRTCService:', ...arguments]);
  };

  start() {
    return new Promise((resolve, reject) => {
      this.log('Starting video capture...');
      this.startVideoCapture()
      .then((stream) => {
        this.log('Local media stream acquired');
        this.localVideo.src = stream;
        this.createPeerConnection();
        resolve();
      })
      .catch((err) => {
        console.error('Failed to acquire local media stream.\n', err);
        reject(err);
      });
    });
  };

  startVideoCapture(constraints) {
    constraints = constraints || {audio: true, video: true};

    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.localVideoStream = stream;
        resolve(URL.createObjectURL(stream));
      })
      .catch((err) => {
        reject(err);
      });
    });
  };

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

  // Sends Socket
  // Receive a local ICE Candidate
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

}
