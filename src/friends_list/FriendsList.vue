<template>
<div id="friends-list">
  <h1>FRIENDS!</h1>

  <FriendsListItem v-for="friend in friends" :user="friend" :key="friend._id"></FriendsListItem>
</div>
</template>



<script>

import FriendsListItem from './components/FriendsListItem.vue';
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



</style>
