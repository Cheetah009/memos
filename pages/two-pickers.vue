<template lang="pug">
div.container
  div.list
    items-list(:data="filteredCollection" tag="ul" itemTag="li")
      template(#header) Заголовок
        input(v-model="textToAdd")
        button(@click="addHandle()") Add
      template(#item="{ item, index }") {{ displayInterval(item, index) }}
      template(#footer) {{ footerRender() }}
      template(#empty) {{ emptyHandler() }}
      template(#tools="{ item,index }")
        button(@click="handleDelete(item,index)") Delete
  div.calendars
    date-picker(v-bind:inputDate="dateStart", v-on:inputChanged="inputChangedStart", v-bind:disabledDay="disabledDayStart" :style="{ '--color': startColor }" :dateFormat="startFormat")
    date-picker(v-bind:inputDate="dateEnd", v-on:inputChanged="dateEnd = $event", v-bind:disabledDay="disabledDayEnd" :style="{ '--color': endColor }" :dateFormat="endFormat")
</template>

<script>
import DatePicker from '@/components/DatePicker'
import ItemsList from '@/components/ItemsList'
import { parse, format } from 'date-fns'

export default {
  components: {
    DatePicker,
    ItemsList
  },
  data () {
    return {
      startColor: 'green',
      endColor: 'blue',
      dateStart: '',
      dateEnd: '',
      startFormat: {
        format: 'yyyy-MM-dd',
        emptyValue: ''
      },
      endFormat: {
        format: 'TT',
        emptyValue: ''
      },
      collection: [
        {
          id: 1,
          text: 'FISRT',
          date: parse('05.12.2020', 'dd.MM.yyyy', new Date())
        },
        {
          id: 2,
          text: 'Second',
          date: parse('07.12.2020', 'dd.MM.yyyy', new Date())
        },
        {
          id: 3,
          text: 'Третий',
          date: parse('12.12.2020', 'dd.MM.yyyy', new Date())
        }
      ],
      textToAdd: 'Новый элемент'
    }
  },
  computed: {
    filteredCollection () {
      return this.collection.filter((item) => {
        if (item.date >= parse(this.dateStart, this.startFormat.format, new Date()) && item.date <= parse(this.dateEnd, this.endFormat.format, new Date())) {
          return item
        }
      })
    }
  },
  methods: {
    inputChangedStart (data) {
      console.log('outside input changed', data)
      this.dateStart = data
    },
    disabledDayStart (day) {
      return this.dateEnd && day > parse(this.dateEnd, this.endFormat.format, new Date())
    },
    disabledDayEnd (day) {
      return this.dateStart && day <= parse(this.dateStart, this.startFormat.format, new Date())
    },
    changeState (state) {
      this.pickerState = state
    },
    handleDelete (item, index) {
      this.collection.splice(index, 1)
    },
    footerRender () {
      return 'Всего: ' + this.collection.length
    },
    emptyHandler () {
      return 'Элементов нет'
    },
    addHandle () {
      this.collection.push({ id: new Date(), text: this.textToAdd, date: new Date() })
    },
    displayInterval (item, index) {
      // if (item.date >= parse(this.dateStart, this.startFormat.format, new Date()) || item.date <= parse(this.dateEnd, this.endFormat.format, new Date())) {
      return item.text + ', ' + format(item.date, 'dd.MM.yyyy')
      // }
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  display flex
  flex-direction column

.calendars
  display flex
  width: 100%;
  justify-content space-evenly

.list
  margin-top: 10px;

button
  margin-bottom: 10px;
</style>
