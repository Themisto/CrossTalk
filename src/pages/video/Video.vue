<template>
<div id="video-page">
  <chats-panel
    :socket="socket"
    :socketReady="socketReady"
    :roomJoined="roomJoined"
    :verbose="verbose"
    v-on:Ready="joinRoom"
  ></chats-panel>

  <video-stream
    :socket="socket"
    :socketReady="socketReady"
    :verbose="verbose"
    v-on:Ready="joinRoom"
  ></video-stream>

  <translations-panel
    :socket="socket"
    :socketReady="socketReady"
    :roomJoined="roomJoined"
    v-on:Ready="joinRoom"
  ></translations-panel>
</div>
</template>


<script>

import ChatsPanel from './components/ChatsPanel.vue';
import TranslationsPanel from './components/TranslationsPanel.vue';
import VideoStream from './components/VideoStream.vue';
import Socket from '../../services/socket.js';

export default {

  // State Variables
  // ===============
  data: function () {
    return {
      room: window.location.pathname.split('/')[2], // Room name
      socket: null,         // Socket.io instance, set by startSocket()
      signalServerURL: '/', // URL to signal server
      verbose: true,        // Set to true for debug logging
      socketReady: false,   // Status of connection to signal server, set by startSocket()
      roomJoined: false,    // Status of connection to room, set by joinRoom()
      componentStatus: {    // Status of child components, set by joinRoom()
        ChatsPanel: false,
        VideoStream: false,
        TranslationsPanel: false
      }
    };
  },

  // Controller Methods
  // ==================
  methods: {

    log: function() {
      this.verbose && console.log.apply(console, ['Video:', ...arguments]);
    },

    // Initialize the socket
    // Called on 'RTCPCReady' event from VideoStream component
    startSocket: function() {
      this.log('Initializing the socket...')
      this.socket = Socket(this.signalServerURL, this.verbose);
      // Signal child components
      this.socketReady = true;
    },

    // Update status of components
    // If all are ready, join the room
    // Called on 'Ready' event of VideoStream or ChatsPanel
    joinRoom: function(componentName) {
      this.log(`${componentName} component ready. Checking status of child components...`);
      this.componentStatus[componentName] = true;
      if(Object.keys(this.componentStatus).reduce((acc, val) => acc && this.componentStatus[val], true)) {
        this.log('All components ready. Joining room...');
        this.socket.join(this.room);
        this.roomJoined = true;
      } else {
        this.log('Some components not ready!');
      }
    }

  },

  // Custom Components
  // =================
  components: {
    ChatsPanel,
    TranslationsPanel,
    VideoStream
  },

  // Lifecycle Hooks
  // ===============
  mounted: function() {
    this.startSocket();
  },

  beforeDestroy: function () {
    // Invoke hangup in case of component unload with no page exit or unload
    // this.hangup();
  }
}

</script>


<style>
#video-page {
  width: 100%;

  height: 100%;
  display: grid;
  grid-gap: 20px;
  margin: 20px;

  /*justify-content: space-around;*/
  grid-template-areas:

    "translations-panel videos chats-panel";

  grid-template-rows: 1fr;
  grid-template-columns: 1fr 4fr 1fr;

}

.video-page > * {

  font-size: 30px;
  display: flex;
/*  align-items: center;
  justify-content: center;
  text-align: center;*/
}

/*#videos {
  border: 1px solid lime;
  display: flex;
  flex-wrap: wrap;
}*/

#videos {
  grid-area: videos;
  /*border: 3px solid lime;*/
}

/*#local-container {
  grid-area: local-container;
  border: 3px solid pink;
}*/

#chats-panel {
  grid-area: chats-panel;
  /*border: 3px solid green;*/
}


#translations-panel {
  grid-area: translations-panel;
  /*border: 3px solid green;*/

}



</style>
