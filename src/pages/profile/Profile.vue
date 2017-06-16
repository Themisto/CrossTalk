<template>
<div id="profile-page">

  <avatar-panel :data="data"></avatar-panel>


  <history-panel :data="data"></history-panel>

  <div id="friends-list-container">

    <h2>Trigger</h2>
    <friends-list></friends-list>

  </div>

</div>


</template>


<script>

import AvatarPanel from './components/AvatarPanel.vue';
// import Friendslist from './components/FriendsList.vue';
import HistoryPanel from './components/HistoryPanel.vue';


import FriendsList from '../../friends_list/FriendsList.vue';
import axios from 'axios';


export default {
  data() {
    return {
      data: null
    }
  },

  methods: {
    populateData: function() {
      if (localStorage.id_token) {
        axios.get('/api/users/data', {
          headers: {'x-access-token': `Bearer ${localStorage.id_token}`}
        })
        .then(response => {
          console.log('Response from data endpoint:', response);
          this.data = response.data;
        })
        .catch(err => {
          console.error('Failure retrieving data:', err);
        })
      } else {
        console.error('Failure retrieving data: no auth token found in local storage');
      }
    }
  },

  components: {
    AvatarPanel,
    FriendsList,
    HistoryPanel

  },

  mounted: function() {
    this.populateData();
  }
}




</script>


<style scoped>
#profile-page {
  width: 100%;
  height: 100%;
  display: grid;
  grid-gap: 20px;
  margin: 20px;


  grid-template-areas:

    "avatar-panel avatar-panel friends-list-container"
    "history-panel history-panel friends-list-container";

  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;

}

#profile-page > * {
  /*background: rgba(0,0,0,0.7);*/
  color: white;
  background: rgba(0,0,0,0.5);
  /*opacity: 0.5;*/
  box-shadow: 0px 6px 20px 3px rgba(0,0,0,0.7);
  transition: box-shadow 0.5s;
}

#profile-page > *:hover {

  box-shadow: 0px 7px 25px 4px rgba(0,0,0,0.7);
}



#avatar-panel {
  grid-area: avatar-panel;

}





#history-panel {
  grid-area: history-panel;
}


#friends-list-container {
  padding: 20px;

  grid-area: friends-list-container;
  position: relative;
  /*border: 1px solid lime;*/

}




</style>