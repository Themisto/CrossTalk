<template>
<div>
  Video
  <div>
    <messages-panel id="chats"></messages-panel>
    <input-box></input-box>
  </div>
  <div>
    <video width="320" height="240" autoplay="true"></video>
    <text-box :message="{text:'User_0'}"></text-box>
    <video width="320" height="240" autoplay="true"></video>
    <text-box :message="{text:'User_1'}"></text-box>
  </div>
  <messages-panel id="translations"></messages-panel>
</div>
</template>


<script>
import InputBox from './components/InputBox.vue'
import MessagesPanel from './components/MessagesPanel.vue'
import TextBox from './components/TextBox.vue'

export default {
  components: {
    InputBox,
    MessagesPanel,
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
