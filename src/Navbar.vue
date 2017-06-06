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
  data () {
    // if (!this.auth.authenticated) { this.auth.login(); }
    return {}
  }
}
</script>






<style scoped>
nav {
  margin-top: -50px;
  display: flex;
  position: fixed;
  justify-content: space-between;
  width: 100%;
  background-color: lightgrey;
}

nav * {
  text-decoration: none;
  color: black;
  padding: 14px;
}

nav *:hover {
  background-color: grey;
}

</style>