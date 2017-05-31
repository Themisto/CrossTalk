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
  methods: {
    captureLocalVideo: function () {
      console.log('Beginning video capture...')
      var localVideo;
      var localVideoStream;
      var constraints = {audio: true, video: true};

      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // console.dir(stream.getAudioTracks());
        localVideo = document.getElementById('local-video');
        localVideoStream = URL.createObjectURL(stream);
        localVideo.src = localVideoStream;
      })
      .catch((err) => {
        console.error('Failed to acquire local video/audio stream.\n', err);
      })
    },
  },
  mounted: function () {
    this.captureLocalVideo()
  },
  components: {
    ChatsPanel,
    TranslationsPanel,
    TextBox
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
  border-style: groove;
  height: 240px;
  width: 320px;
}

</style>
