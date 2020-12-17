<template lang="pug">
div
  button(@click="changeState('disabled')") disable
  button(@click="changeState('readonly')") readonly
  button(@click="changeState('')") refresh
  date-picker(v-bind:inputDate="dateAttribute", v-on:inputChanged="inputChanged", v-bind:disabledDay="disabledDay" v-bind:pickerState="pickerState")
</template>

<script>
import DatePicker from '@/components/DatePicker'
import { format, parse } from 'date-fns'
// const dateAttribute = new Date()

export default {
  components: {
    DatePicker
  },
  data () {
    return {
      dateAttribute: '',
      pickerState: ''
    }
  },
  // watch: {
  //   dateAttribute: {
  //     handler () {
  //       console.log('watch', this.dateAttribute)
  //     }
  //   }
  // },
  methods: {
    inputChanged (value) {
      console.log('inputChanged', value)
      this.dateAttribute = value
    },
    disabledDay (day) {
      const minDate = '06.11.2020'
      const maxDate = '10.02.2024'
      const daysToDisable = [
        '17.12.2020',
        '21.12.2020',
        '31.12.2020'
      ]

      return day <= parse(minDate, 'dd.MM.yyyy', new Date()) ||
        day > parse(maxDate, 'dd.MM.yyyy', new Date()) ||
        daysToDisable.includes(format(day, 'dd.MM.yyyy'))
    },
    changeState (state) {
      this.pickerState = state
    }
  }
}
</script>

<style lang="stylus" scoped>
div
  text-align center

button
  margin-bottom: 10px;
</style>
