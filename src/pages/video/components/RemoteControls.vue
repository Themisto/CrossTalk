<template>
  <div id="controls">
    <div id="add">
      <p>+</p>
    </div>
    <div id="votes">
      <div>
        <p>&#9757</p>
        <p>&#9759</p>
      </div>
      <p>1234</p>
    </div>
  </div>
</template>



<script>

  export default {
    data() {
      return {
      }
    }
  }

</script>



<style scoped>
  #controls {
    position: absolute;
    top: 70px;
    display: flex;
  }

  #add {
    height: 40px;
    width: 40px;
    background-color: black;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    margin-top: 10px;
  }

  #votes {
    height: 40px;
    /*width: 40px;*/
    margin-left: 10px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>