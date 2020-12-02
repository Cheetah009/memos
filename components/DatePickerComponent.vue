<template lang="pug">
  div.calendar
    div
      //- input(v-bind:value="componentDate.toLocaleDateString()" v-on:input="componentDate = new Date($event.target.value)")
      input(v-model="componentDate.toLocaleDateString()")
    div.calendar-header
      button(@click="changeYear(false)") <<
      button(@click="changeMonth(false)") <
      span {{ componentDate.getMonth() + 1 }} {{ componentDate.getFullYear() }}
      button(@click="changeMonth(true)") >
      button(@click="changeYear(true)") >>
    div.calendar-content
      table.calendar-content-table
        thead
          tr
            th(v-for="dayName in ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']") {{ dayName }}
        tbody
          tr(v-for="week in dateArray")
            td(v-for="day in week" @click="chooseDay(day)" :class="(todayDate.getFullYear() === componentDate.getFullYear() && todayDate.getMonth() === componentDate.getMonth() && getDay(todayDate) === day) ? 'calendar-today' : ''") {{ day === 0 ? '' : day }}
</template>

<script>
export default {
  // props: {
  //   dateAttribute: {
  //     type: Date,
  //     required: true
  //   }
  // },
  data () {
    return {
      dateArray: [],
      componentDate: this.$attrs.value
    }
  },
  computed: {
    todayDate () {
      return new Date()
    }
  },
  created () {
    this.dateArray = this.createCalendarArray(this.componentDate)
  },
  methods: {
    // createCalendar
    createCalendarArray (date) {
      const mon = date.getMonth()
      const year = date.getFullYear()
      const dummyDate = new Date(year, mon)

      const calendarArray = []
      let arrayRow = []
      for (let i = 0; i < this.getDay(dummyDate); i++) {
        arrayRow.push(0)
      }
      while (dummyDate.getMonth() === mon) {
        arrayRow.push(dummyDate.getDate())

        if (this.getDay(dummyDate) % 7 === 6) {
          calendarArray.push(arrayRow)
          arrayRow = []
        }

        dummyDate.setDate(dummyDate.getDate() + 1)
      }
      if (this.getDay(dummyDate) !== 0) {
        for (let i = this.getDay(dummyDate); i < 7; i++) {
          arrayRow.push(0)
        }
      }
      calendarArray.push(arrayRow)

      return calendarArray
    },
    getDay (date) {
      let day = date.getDay()
      if (day === 0) { day = 7 }
      return day - 1
    },
    changeMonth (isForward) {
      if (isForward) {
        this.componentDate.setMonth(this.componentDate.getMonth() + 1)
      } else {
        this.componentDate.setMonth(this.componentDate.getMonth() - 1)
      }
      this.dateArray = this.createCalendarArray(this.componentDate)
    },
    changeYear (isForward) {
      if (isForward) {
        this.componentDate.setFullYear(this.componentDate.getFullYear() + 1)
      } else {
        this.componentDate.setFullYear(this.componentDate.getFullYear() - 1)
      }
      this.dateArray = this.createCalendarArray(this.componentDate)
    },
    chooseDay (day) {
      if (day === 0) {
        return
      }
      this.componentDate.setDate(day)
      this.dateArray = this.createCalendarArray(this.componentDate)
    }
  }
}
</script>

<style lang="stylus">
.calendar
  display flex
  flex-direction column
  align-items center

.calendar-content-table
  border-collapse collapse

.calendar-content-table tr
  text-align center

.calendar-content-table td
  border: 1px solid black
  padding 2px
  &:hover
    background orange

.calendar-today
  background green
</style>
