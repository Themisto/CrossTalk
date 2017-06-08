<template>
<div id="chats-panel">
  <div id="text-box">
    <text-box
      v-for="message in messages"
      :message="message"
      :key="message.id"
    ></text-box>
  </div>
  <div>
    <input placeholder="Enter chat here" v-model="chat">
    <button v-on:click="sendMessage"> Send </button>
  </div>
</div>
</template>


<script>

import TextBox from './TextBox.vue'

export default {

  props: [
  'socket',
  'socketReady',
  'roomJoined',
  'verbose'
  ],

  // State Variables
  // ===============
  data: function () {
    return {
      messages: [],
      chat: '',
    }
  },

  watch: {
    socketReady: function() {
      this.socketReady && this.registerListeners();
    }
  },

  // Controller Methods
  // ==================
  methods: {

    // Convenience method for logging debugging messages
    log: function() {
      this.verbose && console.log.apply(console, ['ChatsPanel:', ...arguments]);
    },

    // Connect to Signal Server and initiate listeners
    registerListeners: function() {

      this.log('Registering listeners...');

      this.socket.on('message', (message) => {
        this.log('Received chat message:', message);
        this.messages.push(message);
      });

      // Signal parent component that we are ready to receive messages
      this.$emit('Ready', 'ChatsPanel');

    },

    sendMessage: function() {
      if (this.roomJoined) {
        let message = {
          id: this.messages.length,
          text: this.chat
        };
        this.log('Sending chat message:', message.text);
        this.socket.message(message);
        this.messages.push(message);
      } else {
        console.log('Warning: Socket not ready for use. Please join a room before sending a chat message.');
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

#text-box {
  margin-top: auto;

}




 #chats-panel {
  background-color: black;
  opacity: 0.6;
  box-shadow: 2px 2px 20px 2px black;
/*  justify-content: left;
  display: flex;
  flex-direction: column;*/
/*  align-items: right;
  padding-top: auto;*/
 }




</style>