<template>
<div>
login
</div>
</template>





<script>
import Auth from '../../services/Auth'

const auth = new Auth()

export default {
  data () {
    auth.handleAuthentication()
    this.$router.push('/')
    return {}
  }
}
</script>






<style>

</style>