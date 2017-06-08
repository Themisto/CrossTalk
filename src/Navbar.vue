<template>
<nav>
  <router-link to="/">Home</router-link>
  <div v-if="!authenticated" v-on:click="login">Login</div>
  <div v-if="authenticated" v-on:click="logout">Logout</div>
</nav>
</template>





<script>
import Auth from './services/Auth'

const auth = new Auth()

const { login, logout, authenticated, authNotifier } = auth

export default {
  data () {
    authNotifier.on('authChange', authState => {
      this.authenticated = authState.authenticated
    })
    // if (!authenticated) { login(); }
    return {
      auth,
      authenticated
    }
  },
  methods: {
    login,
    logout
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