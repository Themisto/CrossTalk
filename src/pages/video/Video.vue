<template>
<div id="video-page">
  <chats-panel></chats-panel>
  <div id="videos">
    <div>
      <video id="remote-video" autoplay="true"></video>
      <text-box :message="{text:'User_0'}"></text-box>
    </div>
    <div>
      <video id="local-video" autoplay="true"></video>
      <text-box :message="{text:'User_1'}"></text-box>
    </div>
  </div>
  <translations-panel></translations-panel>
</div>
</template>


<script>
import ChatsPanel from './components/ChatsPanel.vue'
import TranslationsPanel from './components/TranslationsPanel.vue'
import TextBox from './components/TextBox.vue'

export default {
  // State variables.
  // ================
  data: function () {
    return {
      localVideo: '',
      localVideoStream: '',
    }
  },
  // Controller methods.
  // ===================
  methods: {
    captureLocalVideo: function () {
      console.log('Beginning video capture...')
      var constraints = {audio: true, video: true};

      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // console.dir(stream.getAudioTracks());
        this.localVideoStream = URL.createObjectURL(stream);
        this.localVideo.src = this.localVideoStream;
      })
      .catch((err) => {
        console.error('Failed to acquire local video/audio stream.\n', err);
      })
    },

    endVideoCapture: function () {
      console.log('Ending video capture...')
    },
  },
  // Custom components.
  // ==================
  components: {
    ChatsPanel,
    TranslationsPanel,
    TextBox
  },
  // Lifecycle hooks
  // ===============
  mounted: function () {
    this.localVideo = document.getElementById('local-video')
    this.captureLocalVideo()
  },
  beforeDestroy: function () {
    this.endVideoCapture()
  },
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
  border-style: groove;
  height: 240px;
  width: 320px;
}

</style>
