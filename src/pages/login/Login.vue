<template>
<div>
</div>
</template>





<script>
export default {
  props: ['auth'],
  data() {
    return {}
  },
  created() {
    this.auth.handleAuthentication();
    this.$router.push('/');
  }
}
</script>






<style scoped>

</style>