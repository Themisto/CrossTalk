<template>
  <div id="controls">
    <div id="mute" v-on:click="toggleMute" :class="{'green': !audioOn, 'black': audioOn}">
      <p>&#127908</p>
    </div>
    <div id="video" v-on:click="toggleCam" :class="{'green': !camOn, 'black': camOn}">
      <p>&#128249</p>
    </div>
  </div>
</template>



<script>
  export default {
    props: ['socket', 'toggle'],
    data() {
      return {
        audioOn: true,
        camOn: true
      }
    },
    methods: {
      toggleMute: function() {
        console.log('button mute');
        this.socket.control('mic');
        this.audioOn = !this.audioOn;
      },
      toggleCam: function() {
        console.log('button cam');
        this.socket.control('cam');
        this.toggle();
        this.camOn = !this.camOn;
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
  .green {
    background-color: #42b883;
  }

  .black {
    background-color: black;
  }

  #controls div {
    margin-left: 10px;
    margin-bottom: 10px;
    width: 30px;
    height: 30px;
    border-radius: 100%;
  }

</style>