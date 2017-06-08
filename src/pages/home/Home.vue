<template>
  <div class="home-body">
    <banner></banner>
    <find-room></find-room>
  </div>
</template>





<script>
import FindRoom from './components/FindRoom.vue'
import Banner from './components/Banner.vue'

export default {
  data() {
    return {}
  },
  components: {
    FindRoom,
    Banner
  }
}
</script>






<style>
  .home-body {
    /*background-color: white;*/
  }
</style>