<template>
<div>
  Video
  <video id="localVideo"></video>
  <!-- <video id="remoteVideo"></video> -->
</div>
</template>



<script>
// var wsc = new WebSocket('ws://localhost:8080/websocket/');
// var peerConnCfg = {
//   'iceServers': [
//     {'url': 'stun:stun.services.mozilla.com'},
//     {'url': 'stun:stun.l.google.com:19302'}
//   ]
// };
var localVideo;
function pageReady() {
  localVideo = document.getElementById('localVideo');
  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: true, video: true},
    (stream) => {
      localVideo.src = URL.createObjectURL(stream);
    },
    (err) => {
      console.error('Failed to acquire local video/audio stream.\n', err);
    });
  }
};

window.addEventListener("load", pageReady);

</script>



<style>

</style>

