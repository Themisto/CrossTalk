<template>
<div>
  <navbar></navbar>
  <div class="body">
    <router-view :list="list"></router-view>
  </div>
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
* {
  margin: 0;
  font-family: 'Noto Sans', sans-serif;
}

.body {
  margin-top: 50px;
  padding: 20px;
}
</style>