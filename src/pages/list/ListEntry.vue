<template>
<div>
  <li v-on:click="deleteItem(index)">{{index}}{{item}}</li>
</div>
</template>



<script>

export default {
  props: ['deleteItem', 'index', 'item'],
  data() {
    return {
      message: ''
    }
  }
}

</script>



<style>

</style>