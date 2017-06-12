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
      nativeLang: null,
      foreignLang: null,
      supportedLanguages: [
        'Arabic',
        'Chinese (Simplified)',
        'Chinese (Traditional)',
        'English',
        'French',
        'German',
        'Italian',
        'Japanese',
        'Portuguese',
        'Russian',
        'Spanish'
      ],

      bcp47tags: {
        'Arabic': 'ar',
        'Chinese (Simplified)': 'zh-Hans',
        'Chinese (Traditional)': 'zh-Hant',
        'English': 'en',
        'French': 'fr',
        'German': 'de',
        'Italian': 'it',
        'Japanese': 'ja',
        'Portuguese': 'pt',
        'Russian': 'ru',
        'Spanish': 'es'
      }
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
        this.setLanguages();
      })
      .catch(error => {
        console.log(error);
      });
    },

    setLanguages: function () {
      this.$root.$data.nativeLang = this.bcp47tags[this.nativeLang];
      this.$root.$data.foreignLang = this.bcp47tags[this.foreignLang];
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