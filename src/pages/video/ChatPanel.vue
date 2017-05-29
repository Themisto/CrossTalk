<template>
<div class="messages">
  <text-box></text-box>
  <text-box></text-box>
  <input-box></input-box>
</div>
</template>


<script>
import InputBox from './InputBox.vue'
import TextBox from './TextBox.vue'
export default {
  methods: {

  },
  components: {
    InputBox,
    TextBox
  }
}

</script>


<style>
.messages {
  background-color: lightgrey;
}
</style>