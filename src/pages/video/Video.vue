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
  components: {
    ChatsPanel,
    TranslationsPanel,
    TextBox
  }
}

// Video capture/render. Integrate on DOM mount.
// =============================================
// var wsc = new WebSocket('ws://localhost:8080/websocket/');
// var peerConnCfg = {
//   'iceServers': [
//     {'url': 'stun:stun.services.mozilla.com'},
//     {'url': 'stun:stun.l.google.com:19302'}
//   ]
// };
var localVideo;
var localVideoStream;

let constraints = {audio: true, video: true};

function pageReady() {
  navigator.mediaDevices.getUserMedia(constraints).then(
  (stream) => {
    // console.dir(stream.getAudioTracks());
    localVideo = document.getElementById('local-video');
    localVideoStream = URL.createObjectURL(stream);
    localVideo.src = localVideoStream;
  }).catch(
  (err) => {
    console.error('Failed to acquire local video/audio stream.\n', err);
  });

};

window.addEventListener("load", pageReady);

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
