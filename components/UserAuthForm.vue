<template lang="pug">
form(@submit.prevent="submitForm(userinfo)")
  p
    label(for="name") username
    input(id="name" v-model="userinfo.name" type="text" name="name")

  p
    label(for="password") password
    input(id="password" v-model="userinfo.password" type="password" name="password")

  p
    input(type="submit" value="send")
</template>

<script>
export default {
  data () {
    return {
      userinfo: {
        name: '',
        password: ''
      }
    }
  },
  props: {
    submitForm: {
      type: Function,
      required: true
    }
  }
}
</script>
