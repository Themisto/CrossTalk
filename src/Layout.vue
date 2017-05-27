<template>
<div>
  <navbar></navbar>
  <div class="body">
    <router-view :list="list"></router-view>
    <body-footer></body-footer>
  </div>
</div>
</template>





<script>
import Navbar from './Navbar.vue'
import BodyFooter from './BodyFooter.vue'

export default {
  data() {
    return {
      list: []
    }
  },
  components: {
    Navbar,
    BodyFooter
  }
}

</script>






<style>
* {
  margin: 0;
  font-family: 'Noto Sans', sans-serif;
}

body {
  background-color: #4065a0;
}

.body {
  margin-top: 50px;
}
</style>