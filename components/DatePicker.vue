<template lang="pug">
  .containerDatePicker
    .date-picker-wrapper
      input.inputDatePicker(type="text" name="date-picker" placeholder="dd.mm.yyyy" v-model="inputValue" v-mask="'##.##.####'" @keyup.up="changeInput(true)" @keyup.down="changeInput(false)" :disabled="pickerState === 'disabled'" :readonly="pickerState === 'readonly'" ref="dateInput" :class="isError ? 'inputError' : ''" @blur="handleBlur")
      span.close(@click="inputValueReset") &times;
      .calendarButton(@click="handleClick")
        font-awesome-icon(:icon="['far', 'calendar-alt']")
    calendar.drooped(v-if="showCalendar", v-bind:dateAttribute="cashedinputValue", @update-input="onUpdateInput" v-bind:disabledDay="disabledDay")
</template>

<script>
import Calendar from '@/components/Calendar'
// import { IMaskDirective } from 'vue-imask'
import { format, parse, isValid as isDateValid } from 'date-fns'
import { VueMaskDirective } from 'v-mask'

export default {
  props: {
    inputDate: {
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
    },
    pickerState: {
      type: String,
      required: false,
      default () {
        return ''
      }
    },
    dateFormat: {
      type: Object,
      required: false,
      default () {
        return {
          format: 'dd.MM.yyyy',
          emptyValue: ''
        }
      }
    }
  },
  data () {
    return {
      inputValue: '',
      cashedinputValue: '',
      mask: {
        mask: Date,
        pattern: 'd.m.Y'
      },
      showCalendar: false,
      isError: false,
      displayFormat: 'dd.MM.yyyy'
    }
  },
  components: {
    Calendar
  },
  computed: {
  },
  created () {
  },
  watch: {
    // inputDate: {
    //   immediate: true,
    //   handler () {
    //     console.log('watch input Date', this.inputDate)
    //     console.log('watch input Value', this.inputValue)
    //     console.log('watch input cashedValue', this.cashedinputValue)
    //     // this.inputValue = this.inputDate ? format(parse(this.inputDate, this.dateFormat.format, new Date()), this.displayFormat) : ''
    //     // if (this.inputDate) {
    //     //   console.log('konoyaro', format(parse(this.inputDate, this.dateFormat.format, new Date()), this.displayFormat))
    //     // }
    //   }
    // },
    inputValue: {
      handler () {
        this.dateChoice()
        if (this.inputValue.length !== 10) {
          // this.isError = true
          this.isError = false
          console.log('ITS NOT TEN')
          return
        }
        if (!isDateValid(parse(this.inputValue, this.displayFormat, new Date()))) {
          console.log('НЕСУЩЕСТВУЮЩАЯ ДАТА', this.inputValue)
          this.isError = true
          return
        }
        if (this.disabledDay(parse(this.inputValue, this.displayFormat, new Date()))) {
          console.log('ЗАПРЕТНАЯ ДАТА')
          this.isError = true
          // this.inputValue = this.cashedinputValue
          return
        }
        this.isError = false
        this.cashedinputValue = this.inputValue
        console.log('hey', this.cashedinputValue, 'end hey')
      }
    },
    cashedinputValue: {
      handler () {
        if (this.inputValue !== this.cashedinputValue) {
          this.inputValue = this.cashedinputValue
        }
        // if (this.cashedinputValue === '') {
        //   this.$emit('inputChanged', this.dateFormat.emptyValue)
        // }
        if (this.cashedinputValue === '') {
          this.$emit('inputChanged', '')
          return
        }
        this.$emit('inputChanged', format(parse(this.cashedinputValue, this.displayFormat, new Date()), this.dateFormat.format))
        // this.$emit('inputChanged', this.cashedinputValue)
      }
    }
  },
  methods: {
    handleClick () {
      this.dateChoice()
      if (!(this.pickerState === 'disabled' || this.pickerState === 'readonly')) {
        this.showCalendar = !this.showCalendar
      }
    },
    dateChoice () {
      if (this.inputValue[9] === '_') {
        this.inputValue = this.inputValue.slice(0, 9) + this.inputValue[10]
      }
      if (this.inputValue.length !== 10) {
        this.inputValue = this.inputValue.slice(0, 10)
      }
    },
    inputValueReset () {
      console.log('hey')
      if (!(this.pickerState === 'disabled' || this.pickerState === 'readonly')) {
        this.cashedinputValue = ''
      }
    },
    onUpdateInput (date) {
      this.$refs.dateInput.focus()
      this.inputValue = format(date, this.displayFormat)
      this.showCalendar = false
    },
    changeInput (isUp) {
      this.dateChoice()
      if (this.inputValue.length !== 10) {
        return
      }
      const currentInputValue = parse(this.inputValue, this.displayFormat, new Date())
      if (isUp) {
        this.inputValue = format(currentInputValue.setDate(currentInputValue.getDate() + 1), this.displayFormat)
      } else {
        this.inputValue = format(currentInputValue.setDate(currentInputValue.getDate() - 1), this.displayFormat)
      }
    },
    handleBlur () {
      if (this.isError) {
        this.inputValue = this.cashedinputValue
      }
    }
  },
  directives: {
    // imask: IMaskDirective,
    mask: VueMaskDirective
  }
}
</script>

<style lang="stylus">
$w = 1rem
$border_radius = 15px
$border_color = #3498db

.containerDatePicker
  // height auto
  // width 10%
  // display flex
  // flex-direction column
  // justify-content flex-start
  // display: inline-block
  position relative

.date-picker-wrapper
  // display flex
  position: relative;
  width 200px

.inputDatePicker
  padding 15px 35px
  width 200px
  height 40px
  box-sizing border-box
  border-radius $border_radius
  border 1px solid transparent
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
  &:focus
    outline none
    border 1px solid green
  &readonly
    border 1px solid $border_color

.inputError
  border 1px solid red
  &:focus
    outline none
    border 1px solid red
  &readonly
    border 1px solid red

.calendarButton
  position absolute
  top 11px
  right 13px
  width: auto
  opacity 0.6
  // border-top-right-radius $border_radius
  // border-bottom-right-radius $border_radius
  // border 1px solid $border_color
  // padding-right: ($w / 3);
  &:hover
    cursor: pointer;
  &:active
    outline none
    background-color rgba(gray, 0.3)
  &:focus
    outline none

.close
  opacity: 0.3;
  position absolute
  top 11px
  right 33px
  // padding 1px
  &:hover
    cursor: pointer;

.drooped {
  position absolute
  top 13px
}
</style>
