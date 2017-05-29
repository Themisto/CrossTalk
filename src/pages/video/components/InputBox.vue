<template>
<div>
  <input placeholder="Enter chat here">
  <button> Send </button>
</div>
</template>


<script>
export default {
  methods: {
    sendMessage: function (message) {
      console.log(message)
    }
  },
  components: {

  }
}

</script>


<style>

</style>