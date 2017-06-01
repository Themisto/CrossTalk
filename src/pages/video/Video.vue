<template>
<div id="video-page">
  <chats-panel :socket="socket"></chats-panel>
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
// import io from '../../../node_modules/socket.io/lib/socket.js';
import io from '../../../node_modules/socket.io-client/dist/socket.io.js';

export default {
  // State variables.
  // ================
  data: function () {
    return {
      localVideo: null,  // Set in mounted lifecycle hook.
      remoteVideo: null,  // Set in mounted lifecycle hook.
      localVideoStream: null,  // Set by startVideoCapture().
      remoteVideoStream: null,  // Set by handleAddStream().
      rtcpc: null, // The RTCPeerConnection, set by createPeerConnection().
      caller: false, // Determines role, set by startSocketIO().
      socket: null,  // Socket.io connection to signal server, set by startSocketIO().
      room: 'test'
    }
  },
  // Controller methods.
  // ===================
  methods: {

    startSocketIO: function() {
      // let socket = io.connect();
      this.socket = io('http://localhost:8001');
      // this.room = null; // TODO: room strategy?

      // Expose socket to window for console testing
      // window.socket = socket;

      // Signal intent to join or create the room
      this.socket.emit('enter room', this.room);
      console.log(`Attempting to join or create room "${this.room}"`);

      // LISTENERS

      this.socket.on('created room', (message) => {
        // If we created the room, we will be the caller.
        this.caller = true;
      });

      this.socket.on('joined room', (message) => {
        // If we joined the room, we will be the callee.
        this.caller = false;
      });
    },

    startVideoCapture: function () {
      console.log('Starting video capture...');
      var constraints = {audio: false, video: true};

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
    this.startSocketIO();
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
