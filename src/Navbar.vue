<template>
<nav>

  <router-link class="hover-button" to="/">Home</router-link>

  <!-- User Actions (right side) -->
  <div id="group" v-if="auth.authenticated">

    <!-- Friends List Button -->
    <div class="hover-button" id="friends-btn" v-on:click="showFriends = !showFriends">
      Friends
    </div>
    <transition name="friends-list">
      <!-- v-if, as opposed to v-show, will query the server everytime we open the list -->
      <FriendsList v-show="showFriends"></FriendsList>
    </transition>

    <!-- Profile Link -->
    <router-link class="hover-button" to="/profile">Profile</router-link>

    <!-- Logout Button -->
    <div class="hover-button" v-on:click="auth.logout">Logout</div>

  </div>

  <!-- Login Button -->
  <div class="hover-button" v-if="!auth.authenticated" v-on:click="auth.login">Login</div>

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
  box-shadow: 2px 2px 20px 2px black;

}

nav * {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 14px;
}

/*nav > *:not(#group):hover {
  background-color: grey;
}*/

.hover-button:hover {
  background-color: grey;
}

#group {
  display: flex;
  padding: 0px;
}

/*#group > *:hover {
  background-color: grey;
}*/

#friends-btn {
  position: relative;
}

/*FriendsList Animation*/
.friends-list-enter-active, .friends-list-leave-active {
  transition: all .5s;
}
.friends-list-enter, .friends-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

</style>