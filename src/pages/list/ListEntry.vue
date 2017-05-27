<template>
<div>
  <li v-on:click="deleteItem">{{text}}</li>
</div>
</template>



<script>

export default {
  props: ['deleteItem', 'text'],
  data() {
    return {
      message: ''
    }
  }
}

</script>



<style>

</style>