<template>
  <div class="home-banner">
    <img src="../img/banner.png">
  </div>
</template>





<script>
  export default {
    data() {
      return {}
    }
  }
</script>






<style>
 .home-banner {
    height: 400px;
    width: 100vw;
    overflow: hidden;
    align-items: center;
    background: rgba(0,0,0,0.6);
  }

  .home-banner img {
    margin: 20px;
    height: calc(100% - 40px);
  }
</style>