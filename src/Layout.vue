<template>
<div>
  <!-- <img src="./assets/logo.png"> -->
  <navbar></navbar>
  <router-view :list="list"></router-view>
</div>
</template>





<script>
import Navbar from './Navbar.vue'

export default {
  data() {
    return {
      list: []
    }
  },
  components: {
    Navbar
  }
}

</script>






<style>
div {
  display: flex;
}
</style>