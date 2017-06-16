<template>
<div id="friends-list-item">
  <img id="avatar"
    src="https://ca.slack-edge.com/T0455847Q-U048WUTPW-c9aad4cb38d9-48">
  <div id="info-container">
    <div id="info">
      <p>{{user.name || user._id}}</p>
      <p>{{user.email || 'Email'}}</p>
    </div>
  </div>
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
  color: white;
  background-color: rgba(0, 0, 0, 0.2);
  margin-top: 5px;
  display: grid;
  grid-template-areas:
    "avatar info-container";

  grid-template-columns: 1fr 3fr;
}

#friends-list-item > * {
  display: flex;
  align-items: center;
}

#avatar {
  width: 36px;
  height: 36px;
  margin: 5px;
  border-radius: 50%;
  grid-area: avatar;
}

#info p {
  align-items: left;
  justify-content: left;
  text-align: left;
  font-size: 14px;
}

#info-container {
  grid-area: info-container;
}

</style>
