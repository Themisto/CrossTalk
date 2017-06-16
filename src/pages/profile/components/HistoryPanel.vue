<template>
<div id="history-panel">


  <div id="most-popular">
    <h2>Most Popular</h2>
  </div>

  <div id="recent-calls">
    <h2>Recent Calls</h2>
  </div>




</div>

</template>


<script>

</script>


<style scoped>

#history-panel {
  /*text-align: center;*/
  padding: 20px;
  display: grid;
  grid-gap: 20px;
  grid-template-areas:

    "most-popular recent-calls";

  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
}

#most-popular {
  grid-area: most-popular;
  border: 1px solid red;
}

#recent-calls {
  grid-area: recent-calls;
  border: 1px solid blue;
}



</style>