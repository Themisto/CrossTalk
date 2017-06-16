<template>
<div id="translations-panel">
  <text-box
    v-for="message in translatedTranscript"
    :message="message"
    :key="message.id"
  ></text-box>
</div>
</template>


<script>
import axios from 'axios';
import TextBox from './TextBox.vue';
export default {
  props: ['socket', 'socketReady', 'roomJoined'],

  data: function () {
    return {
      translatedTranscript: [],
    }
  },

  watch: {
    socketReady: function() {
      this.socketReady && this.registerListeners();
    }
  },

  methods: {
    registerListeners: function () {
      this.socket.on('translateText', (message) => {
        this.translatedTranscript.push(message);
      });

      this.$emit('Ready', 'TranslationsPanel');
    }
  },

  components: {
    TextBox
  }
}

</script>


<style>
  #translations-panel {
    background-color: black;
    opacity: 0.6;
    box-shadow: 2px 2px 20px 2px black;
    overflow: scroll;
  }


</style>