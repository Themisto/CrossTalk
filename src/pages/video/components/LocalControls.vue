<template>
  <div id="controls">
    <div id="mute" v-on:click="toggleMute">
      <p>&#127908</p>
    </div>
    <div id="video" v-on:click="toggleCam">
      <p>&#128249</p>
    </div>
  </div>
</template>



<script>
  export default {
    props: ['socket', 'toggle'],
    data() {
      return {
      }
    },
    methods: {
      toggleMute: function() {
        console.log('button mute');
        this.socket.control('mic');
      },
      toggleCam: function() {
        console.log('button cam');
        this.socket.control('cam');
        this.toggle();
      }
    }
  }
</script>



<style scoped>
  #controls {
    position: absolute;
    display: flex;
    margin-top: -40px;
  }

  #controls > *:hover {
  cursor: pointer;
  background-color: #42b883;
  }

  #controls p {
    /*font-size: 20pt;*/
  }

  #controls div {
    margin-left: 10px;
    margin-bottom: 10px;
    width: 30px;
    height: 30px;
    background-color: black;
    border-radius: 100%;
  }

</style>