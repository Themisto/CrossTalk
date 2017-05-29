<template>
<div>
  <text-box
    v-for="message in messages"
    :message="message"
  ></text-box>
</div>
</template>


<script>
import TextBox from './TextBox.vue'
export default {
  data: function () {
    return {
      messages: [
        {id: 0, text: 'test_message_0'},
        {id: 1, text: 'test_message_1'},
        {id: 2, text: 'test_message_2'},
      ]
    }
  },
  methods: {

  },
  components: {
    TextBox
  }
}

</script>


<style>

</style>