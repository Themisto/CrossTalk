<template>
<div id="info-panel" v-if="showInfo">

  <h2>Info</h2>
  <div id="info-container">
    <p>Name:  {{ data.name }}</p>
    <p>Email:  {{ data.email }}</p>
    <p>Rating:  {{ data.rating }}</p>
  </div>




</div>

</template>


<script>


export default {
  props: ['data'],

  data() {
    return {
      showInfo: false

    }

  },

  watch: {
    data: function() {
      console.log("Info >>>> ", this.data);
      if (this.data !== null) {
        this.showInfo = true;
      }
    }
  },

  methods: {

  }

}

</script>


<style scoped>

#info-container > * {
  margin: 10px;
  padding: 10px;
  align-items: left;
  justify-content: left;
  font-size: 24px;
}


</style>