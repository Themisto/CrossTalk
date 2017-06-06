<template>
<div>
</div>
</template>





<script>

export default {
  props: ['auth'],
  data () {
    this.auth.handleAuthentication()
    this.$router.push('/')
    return {}
  }
}
</script>






<style scoped>

</style>