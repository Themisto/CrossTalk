<template>
<div>
  <input v-model="message" placeholder="edit me">
  <button v-on:click="addToList(message)">Add</button>
  <ul>
    <list-entry v-for="item in list" :delete-item="deleteItem" :item="item"></list-entry>
  </ul>
</div>
</template>



<script>
import ListEntry from './ListEntry.vue'
// import axios from 'axios'
// axios.get('video')
// .then(response => {
//   console.log(response);
// })
// .catch(e => {
//   this.errors.push(e)
// })
export default {
  props: ['list'],
  data() {
    return {
      message: ''
    }
  },
  methods: {
    addToList: function(msg) {
      this.list.push({text: msg});
    },
    deleteItem: function(item) {
      var index = this.list.indexOf(item);
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