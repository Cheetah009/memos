<template lang="pug">
  .calendar
    .calendar-header
        div.controller(@click="changeYear(false)" :class="this.disabledDay(new Date(this.componentDate.getFullYear() - 1, this.componentDate.getMonth())) ? 'disabled' : ''")
          font-awesome-icon(:icon="['fas', 'angle-double-left']")
        div.controller(@click="changeMonth(false)" :class="this.disabledDay(new Date(this.componentDate.getFullYear(), this.componentDate.getMonth())) ? 'disabled' : ''")
          font-awesome-icon(:icon="['fas', 'angle-left']")
        div.monthName {{ monthFormat(componentDate) }} {{ componentDate.getFullYear() }}
        div.controller(@click="changeMonth(true)" :class="this.disabledDay(new Date(this.componentDate.getFullYear(), this.componentDate.getMonth() + 1)) ? 'disabled' : ''")
          font-awesome-icon(:icon="['fas', 'angle-right']")
        div.controller(@click="changeYear(true)" :class="this.disabledDay(new Date(this.componentDate.getFullYear() + 1, this.componentDate.getMonth())) ? 'disabled' : ''")
          font-awesome-icon(:icon="['fas', 'angle-double-right']")
    .calendar-content
      table.calendar-content-table
        thead
          tr
            th(v-for="dayName in ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']") {{ dayName.toUpperCase() }}
        tbody
          tr(v-for="week in dateArray")
            td(
              v-for="dayObj in week" @click="[chooseDay(dayObj), () => {dayObj.isChosen=true}]",
              :class="[ (todayDate.getFullYear() === componentDate.getFullYear() && todayDate.getMonth() === componentDate.getMonth() && todayDate.getDate() === dayObj.day) ? 'calendar-today' : '', (dayObj.day === 0 || dayObj.isDisabled) ? '' : 'hoverable', (chosenDate.getFullYear() === componentDate.getFullYear() && chosenDate.getMonth() === componentDate.getMonth() && chosenDate.getDate() === dayObj.day) ? 'chosen' : '', dayObj.isDisabled ? 'disabled' : '' ]"
              ) {{ dayObj.day === 0 ? '' : dayObj.day }}
</template>

<script>
import { parse, format } from 'date-fns'

export default {
  props: {
    dateAttribute: {
      type: String,
      required: true,
      default () {
        return ''
      }
    },
    disabledDay: {
      type: Function,
      required: true,
      default (day) {
        return false
      }
    }
  },
  data () {
    return {
      componentDate: ''
    }
  },
  computed: {
    todayDate () {
      return new Date()
    },
    chosenDate () {
      return parse(this.dateAttribute, 'dd.MM.yyyy', new Date())
    },
    dateArray () {
      // const date = this.componentDate
      const mon = this.componentDate.getMonth()
      const year = this.componentDate.getFullYear()
      const dummyDate = new Date(year, mon)

      const calendarArray = []
      let arrayRow = []
      for (let i = 0; i < this.getDay(dummyDate); i++) {
        const dayValue = {
          day: 0,
          isDisabled: true,
          isChosen: false
        }
        arrayRow.push(dayValue)
      }
      while (dummyDate.getMonth() === mon) {
        const dayValue = {
          day: dummyDate.getDate(),
          isDisabled: this.disabledDay(dummyDate),
          isChosen: false
        }
        arrayRow.push(dayValue)

        if (this.getDay(dummyDate) % 7 === 6) {
          calendarArray.push(arrayRow)
          arrayRow = []
        }

        dummyDate.setDate(dummyDate.getDate() + 1)
      }
      if (this.getDay(dummyDate) !== 0) {
        for (let i = this.getDay(dummyDate); i < 7; i++) {
          const dayValue = {
            day: 0,
            isDisabled: true,
            isChosen: false
          }
          arrayRow.push(dayValue)
        }
      }
      calendarArray.push(arrayRow)
      return calendarArray
    }
  },
  watch: {
    dateAttribute: {
      handler (val, oldVal) {
        if (this.dateAttribute.length !== 10) {
          this.componentDate = new Date()
        } else {
          this.componentDate = parse(this.dateAttribute, 'dd.MM.yyyy', new Date())
        }
      },
      immediate: true
    }
  },
  methods: {
    // createCalendar
    getDay (date) {
      let day = date.getDay()
      if (day === 0) { day = 7 }
      return day - 1
    },
    changeMonth (isForward) {
      if (isForward) {
        // console.log(this.disabledDay(new Date(this.componentDate.getFullYear(), this.componentDate.getMonth() + 1)))
        if (this.disabledDay(new Date(this.componentDate.getFullYear(), this.componentDate.getMonth() + 1))) {
          return
        }
        this.componentDate = new Date(this.componentDate.setMonth(this.componentDate.getMonth() + 1))
      } else {
        if (this.disabledDay(new Date(this.componentDate.getFullYear(), this.componentDate.getMonth()))) {
          return
        }
        this.componentDate = new Date(this.componentDate.setMonth(this.componentDate.getMonth() - 1))
      }
      // this.dateArray = this.createCalendarArray(this.componentDate)
    },
    changeYear (isForward) {
      if (isForward) {
        if (this.disabledDay(new Date(this.componentDate.getFullYear() + 1, this.componentDate.getMonth()))) {
          return
        }
        this.componentDate = new Date(this.componentDate.setFullYear(this.componentDate.getFullYear() + 1))
      } else {
        if (this.disabledDay(new Date(this.componentDate.getFullYear() - 1, this.componentDate.getMonth()))) {
          return
        }
        this.componentDate = new Date(this.componentDate.setFullYear(this.componentDate.getFullYear() - 1))
      }
      // this.dateArray = this.createCalendarArray(this.componentDate)
    },
    chooseDay (dayObj) {
      if (dayObj.day === 0 || dayObj.isDisabled) {
        return
      }
      this.componentDate = new Date(this.componentDate.setDate(dayObj.day))
      this.$emit('update-input', this.componentDate)
    },
    monthFormat (componentDate) {
      format(componentDate, 'MMM')
      return componentDate.toLocaleString('ru', {
        month: 'short'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
$belize_hole = #3498db
$carrot = #e67e22

.calendar
  // width 200px
  // height 180px
  position absolute
  z-index 1000
  top 2.5rem
  left 0
  // left auto
  background-color white
  padding 10px
  display flex
  flex-direction column
  align-items center
  // border-radius 5px
  border 1px solid rgba(black, 0.3)
  user-select: none;
  box-shadow: 0px 0px 13px -10px #000000;

.calendar-header
  width 100%
  display grid
  grid-template-columns auto auto 60% auto auto

.controller:hover
  color var(--color)
  cursor: pointer;

.calendar-content-table
  border-collapse collapse

.calendar-content-table th
  font-size 0.6rem
  opacity 0.7
  padding-top: 0.3rem;

.calendar-content-table tr
  text-align center

.calendar-content-table td
  // border: 1px solid black
  padding 4px
  border-bottom 2px solid transparent

.hoverable:hover
  background rgba($belize_hole, 0.2)
  border-radius 5px
  cursor pointer

.calendar-content-table .calendar-today
  color var(--color)
  border-bottom 2px solid $carrot

.calendar-content-table .chosen
  // background aquamarine
  color var(--color)
  border-bottom 2px solid var(--color)

.disabled
  opacity 0.5
  color: var(--color)
  &:hover
    // color inherit
    cursor: default

.monthName
  text-transform capitalize
  text-align center
</style>
