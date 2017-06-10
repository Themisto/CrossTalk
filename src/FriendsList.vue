<template>
<div id="friends-list">
  <FriendsListItem v-for="friend in friends" :user="friend" :key="friend.id"></FriendsListItem>
</div>
</template>



<script>

import FriendsListItem from './FriendsListItem.vue';

export default {

  props: [],
  data: function() {
    return {
      friends: [
        {name: 'Anton'},
        {name: 'Mark'},
        {name: 'Sam'},
        {name: 'Tyler'}
      ]
    };
  },
  methods: {

  },
  components: {
    FriendsListItem
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
