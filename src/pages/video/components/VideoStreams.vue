<template>
<div id="videos">
  <div>
    <video id="remote-video" autoplay="true"></video>
    <text-box :message="{text:'Remote'}"></text-box>
  </div>
  <div>
    <video id="local-video" autoplay="true" muted></video>
    <text-box :message="{text:'Local'}"></text-box>
  </div>
</div>
</template>


<script>

export default {

  props: [

  ],

  data: {

  },

  methods: {

  },

  components: {

  },

  mounted: function() {

  },

  beforeDestroy: function() {

  }

}

</script>


<style>


</style>

