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
  props: {
    messages: {
      default: function () {
        return [
          {id: 0, text: 'test_message_0'},
          {id: 1, text: 'test_message_1'},
          {id: 2, text: 'test_message_2'},
        ]
      }
    }
  },
  data: function () {
    return {
      chat: ''
    }
  },
  methods: {
    sendMessage: function () {
      var message = {
        id: this.messages.length,
        text: this.chat
      }

      this.chat = ''
      this.messages.push(message)
    },
  },
  components: {
    TextBox
  }
}

</script>


<style>

</style>