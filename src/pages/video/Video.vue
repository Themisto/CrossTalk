<template>
<div id="video-page">
  <chats-panel :socket="socket" :socketReady="socketReady"></chats-panel>
  <video-stream :socket="socket" :socketReady="socketReady" v-on:RTCPCReady="startSocketIO"></video-stream>
  <translations-panel></translations-panel>
</div>
</template>


<script>

import ChatsPanel from './components/ChatsPanel.vue';
import TranslationsPanel from './components/TranslationsPanel.vue';
import VideoStream from './components/VideoStream.vue';
import Socket from '../../lib/socket.js';

export default {

  // State variables.
  // ================
  data: function () {
    return {
      room: window.location.pathname.split('/')[2], // Room name
      socket: null,         // Socket.io instance, set by startSocketIO().
      socketReady: false,   // State of connection to signal server, set by startSocketIO().
      signalServerURL: '/', // URL to signal server
      verbose: true         // Set to true for debug logging
    };
  },

  // Controller methods.
  // ===================
  methods: {

    startSocketIO: function() {
      this.socket.join(this.room);
      this.socketReady = true;
    }

  },

  // Custom components.
  // ==================
  components: {
    ChatsPanel,
    TranslationsPanel,
    VideoStream
  },

  // Lifecycle hooks
  // ===============
  created: function() {
    // Initialize socket. Normally this would be done directly in the data function,
    // but this requires parameters from the data function itself.
    this.socket = Socket(this.signalServerURL, this.verbose);
  },

  mounted: function () {

  },

  beforeDestroy: function () {
    // Invoke hangup in case of component unload with no page exit or unload
    // this.hangup();
  }
}

</script>


<style>
#video-page {
  background-color: #7aa2e2;
  display: flex;
  justify-content: space-around;
}

#videos {
  display: flex;
  flex-wrap: wrap;
}

video {
  background-color: #303030;
  border-style: groove;
  height: 240px;
  width: 320px;
}

</style>
