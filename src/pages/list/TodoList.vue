<template>
<div>
  <ul>
    <list-entry v-for="item in list" :delete-item="deleteItem" :index="item[0]" :item="item[1]"></list-entry>
  </ul>
  <input v-model="message" placeholder="edit me">
  <button v-on:click="addToList(message)"></button>
</div>
</template>



<script>
import ListEntry from './ListEntry.vue'
// import axios from 'axios'

export default {
  props: ['list'],
  data() {
    return {
      message: ''
    }
  },
  methods: {
    addToList: function(text) {
      // axios.get('video')
      // .then(response => {
      //   console.log(response);
      // })
      // .catch(e => {
      //   this.errors.push(e)
      // })
      this.list.push([this.list.length, text]);
    },
    deleteItem: function(index) {
      console.log('asdf');
      this.list.splice(index, 1);
    }
  },
  components: {
    ListEntry
  }
}

</script>



<style>

</style>