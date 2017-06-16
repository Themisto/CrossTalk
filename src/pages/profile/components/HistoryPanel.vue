<template>
<div id="history-panel">


  <div id="favourite">
    <h2>Favourite Languages</h2>

    <div id="favourites-container">

        <p v-for="fave in favouriteLanguages">{{ `${fave} - time spent practicing: ${data.metrics.languageTime[fave]} seconds` }}</p>

    </div>


  </div>

  <div id="recent-calls">
    <h2>Recent Calls</h2>
    <div id="recent-container">

        <p v-for="recent in recentCalls">{{ `${new Date(recent.date).toDateString()} - ${recent.fromLang} to ${recent.toLang}, for ${recent.duration} seconds` }}</p>

    </div>

  </div>




</div>

</template>


<script>

export default {
  props: ['data'],

  data() {
    return {
      favouriteLanguages: [],
      recentCalls: []
    }

  },

  watch: {
    data: function() {
      this.favouriteLanguages = this.sortLanguages();
      this.recentCalls = this.displayRecentCalls();
      console.log("Recent Calls >>>>>> ", this.recentCalls);


    }
  },

  methods: {
    sortLanguages: function() {
      var languages = this.data.metrics.languageTime;
      var sorted = Object.keys(languages).sort(function(a,b) {
        return languages[a] < languages[b];
      });
      return sorted.length > 5 ? sorted.slice(0, 5) : sorted;
    },

    displayRecentCalls: function() {
      var recent = this.data.metrics.callHistory;
      return recent.length > 5 ? recent.slice(recent.length - 5, recent.length).reverse() : recent.reverse();
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
  /*border: 1px solid red;*/
}

#recent-calls {
  grid-area: recent-calls;
  /*border: 1px solid blue;*/

}

p {
  margin: 10px;
  padding: 10px;
  align-items: left;
  justify-content: left;
  font-size: 24px;
}

ul {
  text-align: left;
  align-items: left;
  list-style-type: none;
  margin: 0;
}



</style>