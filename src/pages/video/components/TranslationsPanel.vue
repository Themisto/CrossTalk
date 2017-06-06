<template>
<div>
  <text-box
    v-for="message in transcript"
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
      recognition: null,
      transcript: [
        {text: 'Hello, my name is Sam', id: 0},
        {text: 'And you too, Brutus?', id: 1}
      ],
      translatedTranscript: [],
      callHasEnded: false,
    }
  },

  watch: {
    socketReady: function() {
      this.socketReady && this.registerListeners();
    }
  },

  methods: {
    initializeSpeechRecognition: function () {
      console.log('Starting speech recognition...');
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 5;
      this.recognition.continuous = true;

      this.recognition.onend = () => {
        if (this.callHasEnded) {
          console.log('Stopped speech recognition.');
        } else {
          this.recognition.start();
        }
      };

      this.recognition.onresult = (event) => {
        var latest = event.results.length - 1;
        var result = event.results[latest][0].transcript
        var timestamp = new Date(Date.now());
        timestamp = timestamp.toLocaleTimeString();
        this.transcript.push({id: timestamp, text: result});
      };
      
      this.recognition.start();
    },
    
    listen: function () {
      if (this.callHasEnded) {
        this.recognition.stop();
      } else {
        this.initializeSpeechRecognition();
      }
    },
    
    toggleListen: function () {
      this.callHasEnded = !this.callHasEnded;
      this.listen();
    },

    // @todo: get lang params from home page.
    getTranslation: function () {
      var latestMessage = this.transcript[this.transcript.length - 1];
      console.log('latestMessage:', latestMessage);
      window.latestMessage = latestMessage;
      console.log('message to send for translation:', latestMessage.text);
      axios.post('/api/translate', {
        id: latestMessage.id,  // Not currently used server-side.
        text: latestMessage.text,
        fromLang: 'en',
        toLang: 'fr'
      })
      .then(response => {
        var message = {id: latestMessage.id, text: response.data};
        if (this.roomJoined) {
          this.socket.translateText(message);
          console.log('Translation from server:', message);
        }
      })
      .catch(error => {
        console.log('Error getting translation from server');
        console.log(error);
      });
    },

    registerListeners: function () {
      this.socket.on('translateText', (message) => {
        this.translatedTranscript.push(message);
      });

      this.$emit('Ready', 'TranslationsPanel');
    }
  },
  mounted: function () {
    this.listen();
    this.getTranslation();
  },
  beforeDestroy: function () {
    if (this.recognition) {
      this.callHasEnded = true;
      this.recognition.stop();
    }
  },
  components: {
    TextBox
  }
}

</script>


<style>

</style>