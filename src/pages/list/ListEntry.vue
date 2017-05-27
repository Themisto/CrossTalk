<template>
<div>
  <li v-on:click="deleteItem(item)">{{item.text}}</li>
</div>
</template>



<script>

export default {
  props: ['deleteItem', 'item'],
  data() {
    return {
      message: ''
    }
  }
}

</script>



<style>

</style>