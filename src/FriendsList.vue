<template>
<div id="friends-list">
  <div v-for="friend in friends">{{friend.name}}</div>
</div>
</template>



<script>

export default {

  props: [],
  data: function() {
    return {
      friends: [
        {name: 'Anton'},
        {name: 'Mark'},
        {name: 'Sam'},
        {name: 'Tyler'}
      ]
    };
  },
  methods: {

  },
  components: {

  }

}

</script>



<style scoped>

#friends-list {
  background-color: black;
  position: absolute;
  display: block;
  top: 54px;
  left: 0px;
  min-width: 300px;
  z-index: 100;
  /*Opacity doesn't seem to override Navbar styling*/
  opacity: 1;
}

</style>
