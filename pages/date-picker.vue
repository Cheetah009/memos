<template lang="pug">
  //- date-picker-component(v-bind:dateAttribute="dateAttribute")
  date-picker-component(v-model="dateAttribute")
</template>

<script>
import DatePickerComponent from '@/components/DatePickerComponent'

const dateAttribute = new Date()

export default {
  components: {
    DatePickerComponent
  },
  data () {
    return {
      dateAttribute
    }
  }
}
</script>
