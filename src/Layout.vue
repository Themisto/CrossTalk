<template>

  <div id="main-container">

    <navbar :auth="auth" id="navbar"></navbar>

    <div id="body">
      <router-view :auth="auth" :list="list"></router-view>
    </div>

    <body-footer id="footer"></body-footer>
  </div>
</template>





<script>
import Navbar from './Navbar.vue'
import BodyFooter from './BodyFooter.vue'
import Auth from './services/Auth'

const auth = new Auth()

export default {
  data() {
    return {
      list: [],
      auth
    }
  },
  components: {
    Navbar,
    BodyFooter
  }
}

</script>






<style>

body {
  height: 100vh;
}


* {
  margin: 0;
  font-family: 'Noto Sans', sans-serif;
}

#main-container {

  display: grid;
  /*grid-gap: 15px;*/
  background:
    -webkit-linear-gradient(45deg, hsla(153, 47%, 49%, 1) 0%, hsla(153, 47%, 49%, 0) 70%),
    -webkit-linear-gradient(315deg, hsla(211, 100%, 29%, 1) 10%, hsla(211, 100%, 29%, 0) 80%),
    -webkit-linear-gradient(225deg, hsla(211, 28%, 29%, 1) 10%, hsla(211, 28%, 29%, 0) 80%),
    -webkit-linear-gradient(135deg, hsla(153, 100%, 49%, 1) 100%, hsla(153, 100%, 49%, 0) 70%);
  background:
    linear-gradient(45deg, hsla(153, 47%, 49%, 1) 0%, hsla(153, 47%, 49%, 0) 70%),
    linear-gradient(135deg, hsla(211, 100%, 29%, 1) 10%, hsla(211, 100%, 29%, 0) 80%),
    linear-gradient(225deg, hsla(211, 28%, 29%, 1) 10%, hsla(211, 28%, 29%, 0) 80%),
    linear-gradient(315deg, hsla(153, 100%, 49%, 1) 100%, hsla(153, 100%, 49%, 0) 70%);

  height: 100%;

  grid-template-areas:
    "navbar"
    "body"
    "footer";

  grid-template-rows: 1fr 18fr 1fr;
}

#main-container >  {
  /*font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;*/
}

#navbar {
  grid-area: navbar;

}

#body {
  grid-area: body;
  margin-top: 20px;
  margin-bottom: 20px;

  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
/*  height: 100vh;
  border: 1px solid yellow;*/

}

#footer {
  grid-area: footer;
}


</style>