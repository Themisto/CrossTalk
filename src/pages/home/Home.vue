<template>
<div class="home-body">
  <div class="home-banner">
    <img src="./banner.png">
  </div>
  <div class="home-inner">
    <div>
      <h2>Native Language</h2>
      <select>
        <option selected>English</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
      </select>
    </div>
    <div>
      <h2>Foreign Language</h2>
      <select>
        <option selected>Russian</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
        <option>English</option>
      </select>
    </div>
    <div>
      <button>Go</button>
    </div>
  </div>
</div>
</template>





<script>

</script>






<style>
.home-body {
  background-color: white;
}




.home-banner {
  height: 400px;
  overflow: hidden;
}

.home-banner img {
  width: 100%;
}




.home-inner {
  height: 200px;
  display: flex;
  /*align-items: center;*/
  justify-content: center;
  background-color: #7aa2e2;
}

.home-inner select {
  width: 100%;
}

.home-inner button {
  margin-top: 30px;
}

.home-inner > div {
  margin: 20px;
}

</style>