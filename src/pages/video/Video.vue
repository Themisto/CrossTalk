<template>
<div>
  Video
  <div>
    <chats-panel id="chats"></chats-panel>
  </div>
  <div>
    <video width="320" height="240" autoplay="true"></video>
    <text-box :message="{text:'User_0'}"></text-box>
    <video width="320" height="240" autoplay="true"></video>
    <text-box :message="{text:'User_1'}"></text-box>
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

/* Video capture/render. Integrate on DOM mount.
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
    localVideo = document.getElementById('localVideo');
    localVideoStream = URL.createObjectURL(stream);
    localVideo.src = localVideoStream;
  }).catch(
  (err) => {
    console.error('Failed to acquire local video/audio stream.\n', err);
  });

};

window.addEventListener("load", pageReady);
*/
</script>


<style>

</style>
