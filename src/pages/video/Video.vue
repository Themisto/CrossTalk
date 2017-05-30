<template>
<div>
  Video
  <video id="localVideo" autoplay></video>
  <!-- <video id="remoteVideo" autoplay></video> -->
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

</script>



<style>

</style>

