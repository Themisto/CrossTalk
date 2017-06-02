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
import io from '../../../../node_modules/socket.io-client/dist/socket.io.js';

export default {

  props: ['socket', 'messages'],

  // props: {
  //   messages: {
  //     default: function () {
  //       return [
  //         {id: 0, text: 'test_message_0'},
  //         {id: 1, text: 'test_message_1'},
  //         {id: 2, text: 'test_message_2'},
  //       ]
  //     }
  //   }
  // },

  // State variables.
  // ================
  data: function () {
    return {
      //socket: null,  // Socket.io connection to signal server, set by startSocketIO().
      chat: '',

      verbose: true // On/off flag for log() method
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
    startSocketIO: function() {
      // Should point to deployed signal server, or http://localhost:8001 for local testing
      //let SignalServerURL = 'http://localhost:8001';

      //this.log(`Connecting to signal server at ${SignalServerURL}...`);
      //this.socket = io(SignalServerURL);


      var messages = this.messages;

      this.socket.on('message', (message) => {
        console.log('YO! ', messages, message);
        messages.push(message);
      });
    },

    sendMessage: function() {
      console.log('sendMessage: ', this.socket.id);

      var data = {
        room: 'test',
        message: {
          id: this.messages.length,
          text: this.chat
        }
      }

      // this.chat = ''
      //var messages = this.messages;

      if (this.socket !== null) {
        this.socket.emit('message', data);
        this.messages.push(data.message);
      } else {
        console.log('WARNING! FAIL!!');
      }

      this.chat = '';
    }
  },

  components: {
    TextBox
  },

  mounted: function () {
    this.$parent.$on('CONNECTED!', this.startSocketIO);

    // this.startSocketIO();
    // setTimeout(function() {
    //     console.log('startSocketIO: ', this.socket);
    // }, 1000);
  }
}

</script>


<style>

</style>