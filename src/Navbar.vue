<template>
<nav>

  <router-link class="hover-button" to="/">Home</router-link>

  <!-- User Actions (right side) -->
  <div id="group" v-if="true">

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
  <div class="hover-button" v-if="false" v-on:click="auth.login">Login</div>

</nav>
</template>



<script>

import FriendsList from './friends_list/FriendsList.vue';

export default {
  props: ['auth'],
  data() {
    // if (!this.auth.authenticated && window.location.pathname !== '/login') { this.auth.login(); }
    return {
      showFriends: false
    }
  },
  methods: {
  },
  updated() {
    // if (!this.auth.authenticated) { this.auth.login(); }
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


#friends-list {
  background-color: rgba(100, 100, 100, .7);
  position: absolute;
  top: 49px;
  right: 0px;
  min-width: 240px;
  z-index: 100;
  padding: 1px 5px 5px 5px;
  /*border: 1px solid orange;*/
}



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