<template>
<nav>
  <router-link to="/">Home</router-link>
  <div v-if="!auth.authenticated" v-on:click="auth.login">Login</div>
  <div v-if="auth.authenticated" v-on:click="auth.logout">Logout</div>
</nav>
</template>





<script>
export default {
  props: ['auth'],
  // @debug: Uncomment.
  // data() {
  //   if (!this.auth.authenticated && window.location.pathname !== '/login') { this.auth.login(); }
  //   return {}
  // },
  // updated() {
  //   if (!this.auth.authenticated) { this.auth.login(); }
  // }
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
  background-color: black;
  opacity: 0.6;
  box-shadow: 2px 2px 20px 2px black;
}

nav * {
  text-decoration: none;
  color: white;
  padding: 14px;
}

nav *:hover {
  background-color: grey;
}

</style>