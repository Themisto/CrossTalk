<template>
  <div class="home-banner">
    <!-- <img src="../img/banner.png"> -->
    <h1>CrossTalk</h1>
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
    height: 100px;
    width: 100vw;
    overflow: hidden;
    align-items: center;
    background: rgba(0,0,0,0.4);
  }

  .home-banner img {
    margin: 20px;
    height: calc(100% - 40px);
  }

  .home-banner h1 {
    margin: 20px;
    color: white;
    height: calc(100% - 40px);
    letter-spacing: 4px;
  }
</style>