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

export default {

  props: [
  'socket'
  ],

  data: {

  },

  methods: {

  },

  components: {

    // Convenience method for logging debugging messages
    log: function() {
      this.verbose && console.log.apply(console, arguments);
    },

    // ====================================
    // ===============WebRTC===============
    // ====================================

    // Convenience method for including room name with every 'relay' message
    relay: function(message) {
      let data = {
        message: message,
        room: this.room
      };
      this.socket.emit('relay', data);
    },

    startVideoCapture: function () {
      this.log('Starting video capture...');
      var constraints = {audio: true, video: true};

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
        var tracks = this.localVideoStream.getTracks();
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
        this.rtcpc.onicecandidate = this.handleGenerateIceCandidate;
        // Listen for and handle the remote stream
        this.rtcpc.onaddstream = this.handleAddStream;
        // Listen for and handle a hangup from recipient
        this.rtcpc.onremovestream = this.handleRemoveStream;
        // Initiate communication with signal server
        this.startSocketIO();
      } catch (err) {
        console.error('Failed to create RTCPeerConnection.\n', err);
      }
    },

    // Receive a local ICE Candidate
    handleGenerateIceCandidate: function(event) {
      if (event.candidate) {
        this.log('Local ICE Candidate acquired, sending ICE Candidate...');
        let candidateMessage = {
          type: 'ICECandidate',
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        };
        // Send ICE Candidate to counterpart
        this.relay(candidateMessage);
      } else {
        this.log('Finished generating ICE Candidates');
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
      this.socket.disconnect();
      this.socket = null;
      this.rtcpc = null;
      this.createPeerConnection();
    },

    // Create offer, set local description, and send to Callee
    sendOffer: function() {
      this.log('Sending offer to Callee...');
      this.rtcpc.createOffer()
      .then( (localSession) => {
        this.rtcpc.setLocalDescription(localSession);
        this.relay({
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
        this.relay({
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
        this.relay({type: 'Bye'});
        this.socket.disconnect();
      }
    }
  },

  mounted: function() {
    // Initialize references to HTML5 video elements
    this.localVideo = document.getElementById('local-video');
    this.remoteVideo = document.getElementById('remote-video');
    // Initialize listener for page exit or reload
    window.addEventListener('unload', this.hangup);
    // Invoke main entry point
    this.startVideoCapture();
  },

  beforeDestroy: function() {

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

