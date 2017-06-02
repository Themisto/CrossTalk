<template>
  <div class="home-inner">
    <div>
      <h2>Native Language</h2>
      <select id="native-lang">
        <option selected>English</option>
        <option>Spanish</option>
        <option>Russian</option>
        <option>Mandarin</option>
        <option>Dutch</option>
        <option>German</option>
        <option>French</option>
        <option>Hindi</option>
        <option>Arabic</option>
      </select>
    </div>
    <div>
      <h2>Foreign Language</h2>
      <select id="foreign-lang">
        <option>English</option>
        <option>Spanish</option>
        <option selected>Russian</option>
        <option>Mandarin</option>
        <option>Dutch</option>
        <option>German</option>
        <option>French</option>
        <option>Hindi</option>
        <option>Arabic</option>
      </select>
    </div>
    <div>
      <button v-on:click="findRoom">Find Room</button>
    </div>
  </div>
</template>





<script>
import axios from 'axios'

export default {
  data() {
    return {}
  },
  methods: {
    findRoom() {
      axios.post('/api/queue', {
        native_lang: document.getElementById('native-lang').selectedIndex,
        foreign_lang: document.getElementById('foreign-lang').selectedIndex
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
    }
  }
}

</script>






<style>
  .home-inner {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #7aa2e2;
  }

  .home-inner select {
    width: 100%;
  }

  .home-inner button {
    margin-top: 30px;
  }

  .home-inner > div {
    margin: 20px;
  }
</style>