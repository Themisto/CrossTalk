<template>
<div id="friends-list-item">
  <img src="https://ca.slack-edge.com/T0455847Q-U048WUTPW-c9aad4cb38d9-48">
  {{user._id}}
</div>
</template>



<script>

import FriendsListItem from './FriendsListItem.vue';

export default {

  props: ['user'],
  data: function() {
    return {
    };
  },
  methods: {

  },
  components: {

  }

}

</script>



<style scoped>

#friends-list-item {
  padding: 7px;
  color: black;
  background-color: rgba(175, 175, 175, 0.7);
  margin-top: 5px;
  /*opacity: 1;*/
}

#friends-list-item img {
  border-radius: 50%;
}

</style>
