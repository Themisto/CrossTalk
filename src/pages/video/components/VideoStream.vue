<template>
<div id="videos">

  <!-- <div id="remote-container"> -->
    <video id="remote-video" autoplay="true"></video>
    <!-- <text-box :message="{text:'Remote'}"></text-box> -->
  <!-- </div> -->

  <!-- <div id="local-container"> -->
    <video id="local-video" autoplay="true" muted></video>
    <!-- <text-box :message="{text:'Local'}"></text-box> -->
  <!-- </div> -->

  <!-- @debug: Remove. -->
  <button id="recorder" v-on:click="toggleRecording"> {{continueRecording}} </button>
</div>
</template>


<script>

import TextBox from './TextBox.vue';
import WebRTC from '../../../services/webrtc.js';
import recordrtc from 'recordrtc';
import axios from 'axios';

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
      // @debug: Streams encapsulated in WebRTC service. No longer needed here.
      // localVideoStream: null,   // Video/audio stream from webcam
      // remoteVideoStream: null   // Video/audio stream from counterpart
      continueRecording: false,
      recorder: null
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
    // ========================================================================
    // == Begin RecordRTC =====================================================
    // ========================================================================
    postAudioClip: function () {
      let rawAudio = this.recorder.getBlob();
      let audioFile = new File([rawAudio], 'test.wav', {type: 'audio/wav'});

      let formData = new FormData();
      formData.append('file', audioFile);

      axios.post('/api/transcribe', formData)
      .then(response => {
        let message = {id: Date.now(), text: response.data};

      })
      .catch(error => {
        console.log('Error getting transcript from server');
        console.log(error);
      });
    },

    startRecording: function () {
      if (this.continueRecording) {
        // Start recording.
        // console.log(recordrtc.StereoAudioRecorder);
        this.recorder = recordrtc(this.rtc.localVideoStream, {
          type: 'audio',
          recorderType: recordrtc.StereoAudioRecorder,
          numberOfAudioChannels: 1
        });
        this.recorder.startRecording();
        console.log('Started recording.');
      } else {
        // Stop recording and send audio clip to server.
        this.recorder.stopRecording(this.postAudioClip);
        console.log('Stopped recording.');
      }
    },

    toggleRecording: function () {
      this.continueRecording = !this.continueRecording;
      this.startRecording();
    },
    // ========================================================================
    // == End RecordRTC =======================================================
    // ========================================================================

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
  /*-webkit-flex: 1 0 0;
  flex: 1 0 0;*/
  /*margin: 10px;*/
  /*justify-content: space-around;*/
  display: grid;
  grid-gap: 10px;

  grid-template-columns: repeat(8, [col] auto ) ;
  grid-template-rows: repeat(8, [row] auto  );

}

#videos > * {
/*  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;*/

    color: #fff;



    z-index:10;
}

#remote-video {
  background: rgba(0,0,0,0.6);
  width: 100%;
  height: 100%;
  box-shadow: 2px 2px 20px 2px #111;
  grid-column: col 1 / span  8;
  grid-row: row 1 / span 8;
}




#local-video {
  background: rgba(0,0,0,0.6);
  grid-column: col 8;
  grid-row: row 8;
  width: auto;
  height: 150px;
  box-shadow: 2px 2px 20px 2px #111;
  z-index:11;
  margin-bottom: 20px;
}

/* @debug: Remove.*/
#recorder {
  color: black;
}








</style>

