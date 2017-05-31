<template>
<div id="video-page">
  <chats-panel></chats-panel>
  <div id="videos">
    <div>
      <video id="remote-video" autoplay="true"></video>
      <text-box :message="{text:'Remote'}"></text-box>
    </div>
    <div>
      <video id="local-video" autoplay="true"></video>
      <text-box :message="{text:'Local'}"></text-box>
    </div>
  </div>
  <translations-panel></translations-panel>
</div>
</template>


<script>
import ChatsPanel from './components/ChatsPanel.vue';
import TranslationsPanel from './components/TranslationsPanel.vue';
import TextBox from './components/TextBox.vue';

export default {
  // State variables.
  // ================
  data: function () {
    return {
      localVideo: '',  // Set in mounted lifecycle hook.
      remoteVideo: '',  // Set in mounted lifecycle hook.
      localVideoStream: '',  // Set by startVideoCapture().
      remoteVideoStream: '',  // Set by handleAddStream().
      rtcpc: '', // The RTCPeerConnection, set by createPeerConnection().
      caller: false // Determines whether we
    }
  },
  // Controller methods.
  // ===================
  methods: {

    startVideoCapture: function () {
      console.log('Starting video capture...');
      var constraints = {audio: true, video: true};

      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // console.dir(stream.getAudioTracks());
        this.localVideoStream = stream;
        this.localVideo.src = URL.createObjectURL(stream);
        this.createPeerConnection();
      })
      .catch((err) => {
        console.error('Failed to acquire local video/audio stream.\n', err)
      });
    },

    stopVideoCapture: function () {
      console.log('Ending video capture...');
      // Need to call stop() on each track in stream.
      var tracks = this.localVideoStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      })
    },

    createPeerConnection: function() {
      try {
        // The addresses to the STUN and/or TURN servers.
        let STServers = null;

        this.rtcpc = new RTCPeerConnection(STServers);
        // add local stream to send to recipient
        this.rtcpc.addStream(this.localVideoStream);
        // listen for and handle our own local ICE Candidate
        this.rtcpc.onicecandidate = this.handleNewIceCandidate;
        // listen for and handle the remote stream
        this.rtcpc.onaddstream = this.handleAddStream;
        // listen for and handle a hangup from recipient
        this.rtcpc.onremovestream = this.handleRemoveStream;
      } catch (err) {
        console.error(`Failed to create RTCPeerConnection.\nError: ${err}`);
      }
    },

    handleNewIceCandidate: function(event) {
      if (event.candidate) {
        // Create candidate object
        // This is proprietary and can take whatever form we like
        let candidateMessage = {
          type: 'ICECandidate',
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        };
        // TODO: send local ICE candidate data (candidateMessage) to signal server
      }
    },

    handleAddStream: function(event) {
      // Store reference to remote stream
      this.remoteVideoStream = event.stream;
      // Display remote stream in video element
      this.remoteVideo.src = URL.createObjectURL(this.remoteVideoStream);
    },

    handleRemoveStream: function(event) {
      // TODO
    }
  },

  // create a new RTCPeerConnection
    // use the getUserMedia method to get local webcam/mic stream
      // set the local video stream
    // retrieve local ICE candidate data using the .onicecandidate event listener
      // send ICE candidate data to signal server using socket.io
    // when we receive remote ICE candidate data from the signal server, make a new RTCIceCandidate instance using the candidate data
      // add new ice candidate using the .addIceCandidate() method
    // on add stream event
      // set the remote video stream

  // if we are the caller
    // create an offer (.createOffer())
      // set local session description (.setLocalDescription())
      // send local session description to signal server
    // wait for an answer from the callee
      // set the remote description with the session data from the callee (.setRemoteDescription())

  // if we are the callee
    // wait for an offer from the caller
      // set the remote description with the session data from the caller (.setRemoteDescription())
    // create an answer (.createAnswer())
      // set local session description (.setLocalDescription())
      // send local session description to signal server

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
    // Initialize references to HTML5 video elements
    this.localVideo = document.getElementById('local-video');
    this.remoteVideo = document.getElementById('remote-video');
    this.startVideoCapture();
  },

  beforeDestroy: function () {
    this.stopVideoCapture();
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
