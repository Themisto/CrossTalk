<template>
<div id="profile-page">

  <avatar-panel :data="data"></avatar-panel>
  <info-panel></info-panel>

  <history-panel></history-panel>
  <friends-list></friends-list>

</div>


</template>


<script>

import AvatarPanel from './components/AvatarPanel.vue';
// import Friendslist from './components/FriendsList.vue';
import HistoryPanel from './components/HistoryPanel.vue';
import InfoPanel from './components/InfoPanel.vue';

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
    HistoryPanel,
    InfoPanel
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

    "avatar-panel history-panel friends-list"
    "info-panel history-panel friends-list";

  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;

}

#profile-page > * {
  /*background: rgba(0,0,0,0.7);*/
  color: white;
  /*opacity: 0.5;*/
  box-shadow: 2px 2px 20px 2px black;
}

/*#profile-page > *:hover {
  background-color: black;
  color: white;
  opacity: 0.55;
  box-shadow: 2px 2px 2px 2px black;
}*/



#avatar-panel {
  grid-area: avatar-panel;

}



#info-panel {
  grid-area: info-panel;

}

#history-panel {
  grid-area: history-panel;
}


#friends-list {
  grid-area: friends-list;
  position: relative;
  border: 1px solid lime;

}




</style>