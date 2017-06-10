<template>
<nav>
  <router-link to="/">Home</router-link>
  <div id="group">
    <router-link to="/profile">Profile</router-link>
    <FriendsList v-if="auth.authenticated"></FriendsList>
    <div v-if="!auth.authenticated" v-on:click="auth.login">Login</div>
    <div v-if="auth.authenticated" v-on:click="auth.logout">Logout</div>
  </div>

  <!-- <div id="friends-btn" v-if="auth.authenticated" v-on:click="toggleFriends">
    Friends
    <FriendsList v-if="showFriends"></FriendsList>
  </div> -->

</nav>
</template>



<script>

import FriendsList from './FriendsList.vue';

export default {
  props: ['auth'],
  data() {
    if (!this.auth.authenticated && window.location.pathname !== '/login') { this.auth.login(); }
    return {
      showFriends: false
    }
  },
  methods: {
    toggleFriends() {
      this.showFriends = !this.showFriends;
    }
  },
  updated() {
    if (!this.auth.authenticated) { this.auth.login(); }
  },
  components: {
    FriendsList
  }
}

</script>



<style scoped>

nav {
/*  margin-top: -50px;
  margin-bottom: 50px;
  position: fixed;*/

  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: rgba(0,0,0,0.6);
  /*background-color: black;*/
  /*opacity: 0.6;*/
  box-shadow: 2px 2px 20px 2px black;

}

nav * {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 14px;
}



#group > *:hover {
  background-color: grey;
}


nav > *:not(#group):hover {
  background-color: grey;
}

#friends-btn {
  position: relative;
}

</style>