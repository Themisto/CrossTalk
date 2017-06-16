<template>
<div id="history-panel">


  <div id="favourite">
    <h2>Favourite Languages</h2>

    <div id="favourites-container">
      <ul>
        <li v-for="fave in favouriteLanguages">{{ `${fave}: ${data.metrics.languageTime[fave]} seconds` }}</li>
      </ul>
    </div>


  </div>

  <div id="recent-calls">
    <h2>Recent Calls</h2>
  </div>




</div>

</template>


<script>

export default {
  props: ['data'],

  data() {
    return {
      favouriteLanguages: []
    }

  },

  watch: {
    data: function() {
      this.favouriteLanguages = this.sortLanguages();
      console.log("Language Time >>>>>> ", this.data.metrics.languageTime);


    }
  },

  methods: {
    sortLanguages: function() {
      var languages = this.data.metrics.languageTime;
      var sorted = Object.keys(languages).sort(function(a,b) {
        return languages[a] < languages[b];
      });
      return sorted.length >= 5 ? sorted.slice(0, 5) : sorted;
    }
  }
}




</script>


<style scoped>

#history-panel {
  /*text-align: center;*/
  padding: 20px;
  display: grid;
  grid-gap: 20px;
  grid-template-areas:

    "favourite recent-calls";

  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
}

#favourite {
  grid-area: favourite;
  border: 1px solid red;
}

#recent-calls {
  grid-area: recent-calls;
  border: 1px solid blue;
}

/*ul {
  text-align: left;
  align-items: left;
}*/



</style>