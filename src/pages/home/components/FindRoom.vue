<template>
  <div class="home-inner">
    <div>
      <h2>Native Language</h2>
      <select id="native-lang" v-model="nativeLang">
        <option v-for="language in supportedLanguages">
          {{language}}
        </option>
      </select>
    </div>
    <div>
      <h2>Foreign Language</h2>
      <select id="foreign-lang" v-model="foreignLang">
        <option v-for="language in supportedLanguages">
          {{language}}
        </option>
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
  data: function () {
    return {
      supportedLanguages: [
        'English',
        'Spanish',
        'Russian',
        'Chinese',
        'Dutch',
        'German',
        'French',
        'Hindi',
        'Arabic'
      ]
    }
  },
  methods: {
    findRoom() {
      axios.post('/api/queue', {
        native_lang: document.getElementById('native-lang').selectedIndex,
        foreign_lang: document.getElementById('foreign-lang').selectedIndex
      })
      .then(response => {
        this.$router.push(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }
}

</script>






<style>
  .home-inner {
    height: 200px;
    display: flex;
    align-items: bottom;
    justify-content: center;
/*    background-color: black;
    opacity: 0.5;*/
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