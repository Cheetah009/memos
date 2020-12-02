<template lang="pug">
  div
    div(v-if="$auth.loggedIn") {{ $auth.user.mail }}
      NuxtLink(to="/") Logout
    div(v-else)
      NuxtLink(to="/login") Login
      NuxtLink(to="/date-picker") Date Picker
    Nuxt
</template>

<style lang="stylus" scoped>
a
  margin-right 10px
</style>
