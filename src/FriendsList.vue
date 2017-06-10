<template>
<div id="friends-list">
  <FriendsListItem v-for="friend in friends" :user="friend" :key="friend._id"></FriendsListItem>
</div>
</template>



<script>

import FriendsListItem from './FriendsListItem.vue';
import axios from 'axios';

export default {

  props: [],
  data: function() {
    return {
      friends: []
    };
  },
  methods: {
    populateFriends: function() {
      if (localStorage.id_token) {
        axios.get('/api/users/friends', {
          headers: {'x-access-token': `Bearer ${localStorage.id_token}`}
        })
        .then(response => {
          console.log('Response from friends endpoint:', response);
          this.friends = response.data;
        })
        .catch(err => {
          console.error('Failure retrieving friends:', err);
        })
      } else {
        console.error('Failure retrieving friends: no auth token found in local storage');
      }
    }
  },
  components: {
    FriendsListItem
  },
  mounted: function() {
    this.populateFriends();
  }

}

</script>



<style scoped>

#friends-list {
  background-color: rgba(100, 100, 100, .7);
  position: absolute;
  display: block;
  top: 54px;
  left: 0px;
  min-width: 300px;
  z-index: 100;
  padding: 2px 7px 7px 7px;
  /*Opacity doesn't seem to override Navbar styling*/
  /*opacity: 1;*/
}

</style>
