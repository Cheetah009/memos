<template lang='pug'>
  .container
    Logo
    div
      p
        NuxtLink(to="/date-picker") Date Picker
      p
        NuxtLink(to="/two-pickers") Two Pickers
      p
        NuxtLink(to="/items-list") Items List
      p
        NuxtLink(to="/memos") Memos
      p
        NuxtLink(to="/beautiful-memos") Beautiful Memos
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.container {
  /* margin: 0 auto; */
  /* min-height: 100vh; */
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
/*
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
} */
</style>
