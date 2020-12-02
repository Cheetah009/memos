<template lang="pug">
  div
    h1 Login
    user-auth-form(:submitForm="loginUser")
</template>

<script>
import UserAuthForm from '@/components/UserAuthForm'

export default {
  components: {
    UserAuthForm
  },
  methods: {
    loginUser (logininfo) {
      this.$auth.loginWith('local', {
        data: logininfo
      })
      alert('Button pressed!')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
