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
      localVideo: null,         // Video element displaying local stream
      remoteVideo: null,        // Video element displaying remote stream
      rtc: null,                // WebRTC instance
      localVideoStream: null,   // Video/audio stream from webcam
      remoteVideoStream: null   // Video/audio stream from counterpart
    };
  },

  watch: {
    socketReady: function() {
      if(this.socketReady) {
        this.rtc = new WebRTC(
          this.localVideo,
          this.remoteVideo,
          this.socket,
          this.verbose
        );
        this.rtc.start()
        .then(this.registerListeners);
      }
    }
  },

  methods: {

    // Convenience method for logging debugging messages
    log: function() {
      this.verbose && console.log.apply(console, ['VideoStream:', ...arguments]);
    },

    // Attach necessary listeners to socket and to window
    // Send 'Ready' status to parent component on completion
    registerListeners: function() {

      this.log('Registering listeners...');

      // Occurs if we are the first client in the room
      this.socket.on('created room', (room) => {
        this.log(`Created room "${room}", we are the Caller`);
        this.rtc.isCaller = true;
        this.log(`Waiting for callee to join...`);
      });

      // Occurs if we are not the first client in the room
      this.socket.on('joined room', (room) => {
        this.log(`Joined room "${room}", we are the Callee`);
        this.rtc.isCaller = false;
      });

      // Occurs when another party joins our room
      this.socket.on('callee joined', (room) => {
        this.log(`Callee has joined room "${room}"`);
        // It is now safe to initiate call
        this.rtc.sendOffer();
      });

      this.socket.on('relay', (data) => {
        if (data.type === 'ICECandidate') {   // ICE candidate received from counterpart
          this.rtc.handleReceiveIceCandidate(data);
        } else if (data.type === 'Offer') {   // Offer received from Caller
          this.rtc.handleReceiveOffer(data.sdp);
        } else if (data.type === 'Answer') {  // Answer received from Callee
          this.rtc.handleReceiveAnswer(data.sdp);
        } else if (data.type === 'Bye') {     // Hangup received from counterpart
          this.log('Partner has hung up');
          this.rtc.handleRemoveStream();
        } else {
          console.error(`Warning: Invalid message type '${data.type}' received`);
        }
      });

      window.addEventListener('unload', this.rtc.hangup);

      // Signal parent component that we are ready to receive messages
      this.$emit('Ready', 'VideoStream');

    }

  },

  components: {
    TextBox
  },

  mounted: function() {
    // Initialize references to HTML5 video elements
    this.log('Mounted');
    this.localVideo = document.getElementById('local-video');
    this.remoteVideo = document.getElementById('remote-video');
  },

  beforeDestroy: function() {
    this.rtc && this.rtc.hangup();
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

