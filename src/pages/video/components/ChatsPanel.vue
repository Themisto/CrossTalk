<template>
<div>
  <text-box
    v-for="message in messages"
    :message="message"
    :key="message.id"
  ></text-box>
  <input placeholder="Enter chat here" v-model="chat">
  <button v-on:click="sendMessage"> Send </button>
</div>
</template>


<script>

import TextBox from './TextBox.vue'

export default {

  props: [
  'socket',
  'socketReady'
  ],

  // State variables.
  // ================
  data: function () {
    return {
      messages: [],
      chat: '',
      verbose: true // On/off flag for log() method
    }
  },

  watch: {
    socketReady: function() {
      socketReady && this.registerListeners();
    }
  },

  // Controller methods.
  // ===================
  methods: {

    // Convenience method for logging debugging messages
    log: function() {
      this.verbose && console.log.apply(console, arguments);
    },

    // Connect to Signal Server and initiate listeners
    registerListeners: function() {
      this.socket.on('message', (message) => {
        this.log('Received chat message: ', message);
        this.messages.push(message);
      });

    },

    sendMessage: function() {
      if (this.socketReady) {
        let message = {
          id: this.messages.length,
          text: this.chat
        };
        this.log('Sending chat message: ', message.text);
        this.socket.message(message);
        this.messages.push(message);
      } else {
        console.log('Warning: Socket not ready for use. Please wait before sending a chat message.');
      }
      this.chat = '';
    }
  },

  components: {
    TextBox
  }

}

</script>


<style>

</style>