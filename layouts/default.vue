<template lang="pug">
  div
    div(v-if="$auth.loggedIn") {{ $auth.user.mail }}
      NuxtLink(to="/") Logout
    div(v-else)
      NuxtLink(to="/login") Login
      NuxtLink(to="/date-picker") Date Picker
      NuxtLink(to="/two-pickers") Two Pickers
      NuxtLink(to="/items-list") Items List
      NuxtLink(to="/memos") Memos
      NuxtLink(to="/beautiful-memos") Beautiful Memos
    Nuxt
</template>

<style lang="stylus" scoped>
a
  margin-right 10px

html {
  font-family: "Roboto";
}
</style>
