<template>
<div id="videos">
  <div>
    <video id="remote-video" autoplay="true"></video>
    <text-box :message="{text:'Remote'}"></text-box>
  </div>
  <div>
    <video id="local-video" autoplay="true" muted></video>
    <text-box :message="{text:'Local'}"></text-box>
  </div>
</div>
</template>


<script>

import TextBox from './TextBox.vue';
import WebRTC from '../../../lib/webrtc.js';

export default {

  props: [
  'socket',
  'socketReady',
  'verbose'
  ],

  data: function() {
    return {
      localVideo: null, // Video element displaying local stream
      remoteVideo: null, // Video element displaying remote stream
      rtcpc: null,
      localVideoStream: null,     // Video/audio stream from webcam
      remoteVideoStream: null    // Video/audio stream from counterpart
    };
  },

  watch: {
    socketReady: function() {
      if(this.socketReady) {
        this.startVideoCapture();
        // this.registerListeners();
      }
    }
  },

  methods: {

    // Convenience method for logging debugging messages
    log: function() {
      this.verbose && console.log.apply(console, ['VideoStream:', ...arguments]);
    },

    registerListeners: function() {

      this.log('Registering listeners...');

      // Occurs if we are the first client in the room
      this.socket.on('created room', (room) => {
        this.log(`Created room "${room}", we are the Caller`);
        this.isCaller = true;
        this.log(`Waiting for callee to join...`);
      });

      // Occurs if we are not the first client in the room
      this.socket.on('joined room', (room) => {
        this.log(`Joined room "${room}", we are the Callee`);
        this.isCaller = false;
      });

      // Occurs when another party joins our room
      this.socket.on('callee joined', (room) => {
        this.log(`Callee has joined room "${room}"`);
        // It is now safe to initiate call
        this.isCaller && this.sendOffer();
      });

      this.socket.on('relay', (data) => {
        if (data.type === 'ICECandidate') {   // ICE candidate received from counterpart
          this.handleReceiveIceCandidate(data);
        } else if (data.type === 'Offer') {   // Offer received from Caller
          this.handleReceiveOffer(data.sdp);
        } else if (data.type === 'Answer') {  // Answer received from Callee
          this.handleReceiveAnswer(data.sdp);
        } else if (data.type === 'Bye') {     // Hangup received from counterpart
          this.handleRemoveStream();
        } else {
          console.error(`Warning: Invalid message type '${data.type}' received`);
        }
      });

      // Signal parent component that we are ready to receive messages
      this.$emit('Ready', 'VideoStream');

    },

    // ====================================
    // ===============WebRTC===============
    // ====================================

    // Convenience method for including room name with every 'relay' message

    startVideoCapture: function () {
      this.log('Starting video capture...');
      let constraints = {audio: true, video: true};

      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.log('Local stream acquired');
        this.localVideoStream = stream;
        this.localVideo.src = URL.createObjectURL(stream);
        this.createPeerConnection();
      })
      .catch((err) => {
        console.error('Failed to acquire local video/audio stream.\n', err);
      });
    },

    stopVideoCapture: function () {
      this.log('Ending video capture...');
      if (this.localVideoStream) {
        // Need to call stop() on each track in stream.
        let tracks = this.localVideoStream.getTracks();
        tracks.forEach(function (track) {
          track.stop();
        });
      }
    },

    createPeerConnection: function() {
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
        this.registerListeners();
        // this.$emit('RTCPCReady');
      } catch (err) {
        console.error('Failed to create RTCPeerConnection.\n', err);
      }
    },

    // Receive a local ICE Candidate
    handleGatherIceCandidate: function(event) {
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
    },

    // Receive an ICE Candidate from counterpart
    handleReceiveIceCandidate: function(remoteIceCandidate) {
      this.log('ICE Candidate received from counterpart');
      let remoteCandidate = new RTCIceCandidate({
        sdpMLineIndex: remoteIceCandidate.sdpMLineIndex,
        candidate: remoteIceCandidate.candidate
      });
      // Add remote ICE Candidate to candidates
      this.rtcpc.addIceCandidate(remoteCandidate);
    },

    // Receive an offer from the caller
    handleReceiveOffer: function(remoteSession) {
      this.log('Offer received from Caller');
      this.rtcpc.setRemoteDescription(remoteSession);
      this.sendAnswer();
    },

    // Receive an answer from the callee
    handleReceiveAnswer: function(remoteSession) {
      this.log('Answer received from Callee');
      this.rtcpc.setRemoteDescription(remoteSession);
    },

    // Receive the remote stream
    handleAddStream: function(event) {
      this.remoteVideoStream = event.stream;
      this.remoteVideo.src = URL.createObjectURL(this.remoteVideoStream);
    },

    // Counterpart hung up
    handleRemoveStream: function(event) {
      this.log('Remote stream has ended');
      this.remoteVideoStream = this.remoteVideo.src = '';
      // TODO: Handle resetting environment in case of counterpart reconnect
      // this.socket.reset();
      // this.socket.disconnect();
      // this.socket = null;
      // this.rtcpc = null;
      // this.createPeerConnection();
      this.caller = true;
    },

    // Create offer, set local description, and send to Callee
    sendOffer: function() {
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
    },

    // Create answer, set local description, and send to Caller
    sendAnswer: function() {
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
    },

    hangup: function() {
      this.stopVideoCapture();
      if (this.socket) {
        this.socket.relay({type: 'Bye'});
        this.socket.reset(false);
      }
    }
  },

  components: {
    TextBox
  },

  mounted: function() {
    // Initialize references to HTML5 video elements
    this.localVideo = document.getElementById('local-video');
    this.remoteVideo = document.getElementById('remote-video');
    // Initialize listener for page exit or reload
    window.addEventListener('unload', this.hangup);
    // Invoke main entry point
    // this.startVideoCapture();
    // window.myrtc = new WebRTC();
  },

  beforeDestroy: function() {
    this.hangup();
  }

}

</script>


<style>

#videos {
  display: flex;
  flex-wrap: wrap;
}

video {
  /*-webkit-flex: 1 0 0;
  flex: 1 0 0;*/
  background-color: #303030;
  border-style: groove;
  height: 480px;
  width: 640px;
}

</style>

