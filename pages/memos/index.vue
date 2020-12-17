<template lang="pug">
div.container
  .calendars
    date-picker.calendars__from(v-bind:inputDate="dateStart", v-on:inputChanged="dateStart = $event", v-bind:disabledDay="disabledDayStart" :style="{ '--color': startColor }" :dateFormat="startFormat" v-if="calendarsOpened")
    search-input.calendars__search(v-model='textToSearch')
    date-picker.calendars__to(v-bind:inputDate="dateEnd", v-on:inputChanged="dateEnd = $event", v-bind:disabledDay="disabledDayEnd" :style="{ '--color': endColor }" :dateFormat="endFormat" v-if="calendarsOpened")
    .calendars__show(@click="toggleCalendars") {{ calendarsOpenedText }}
  .memos
    items-list(:data="filteredCollection" tag="div" itemTag="div")
      template(#header) Заметки
        nuxt-link.add-btn(:to="'/memos/add/'") {{ '+' }}
      template(#item="{ item, index }")
        nuxt-link.view-link(:to="'/memos/view/' + item.id") {{ item.title }}
        div.subtitle {{ format(parse(item.date_create, 't', new Date()), 'dd.MM.yyyy') }}
      template(#empty)
        template(v-if="!errorMessage") Ой, пусто
        template(v-else) {{ errorMessage }}
      template(#tools="{ item, index }")
        .threeDots(@click="toggleMenu(index)")
        .menu(:class="{ menuClosed: openedElement !== index }")
          .menu__content
            //- nuxt-link(:to="'/memos/view/' + item.id") {{ 'View' }}
            //- span {{ ' | ' }}
            nuxt-link.menu__content__elem(:to="'/memos/edit/' + item.id") {{ 'Edit' }}
            //- span {{ ' | ' }}
            p.delete-btn.menu__content__elem(@click="deleteElem(item)") Delete
      template(#footer)
</template>

<script>
import DatePicker from '@/components/DatePicker'
import ItemsList from '@/components/ItemsList'
import SearchInput from '@/components/SearchInput'
import { parse, format } from 'date-fns'

export default {
  components: {
    ItemsList,
    DatePicker,
    SearchInput
  },
  data () {
    return {
      startColor: 'green',
      endColor: 'blue',
      dateStart: '',
      dateEnd: '',
      startFormat: {
        format: 'TT',
        emptyValue: ''
      },
      endFormat: {
        format: 'TT',
        emptyValue: ''
      },
      textToSearch: '',
      isClosed: true,
      openedElement: -1,
      calendarsOpened: true,
      calendarsOpenedText: '+ Открыть календари'
    }
  },
  // watch: {
  //   textToSearch: {
  //     immediate: true,
  //     handler () {
  //       this.filteredCollection.slice()
  //     }
  //   }
  // },
  computed: {
    filteredCollection () {
      // console.log('Filtered', this.$store.getters.getErrorMessage)
      // if (!this.$store.state.error) {
      //   return
      // }
      console.log('Route', this.$route.fullPath)
      // debugger
      const array = this.$store.getters.getAllNotes
      console.log('array', array)
      return array.filter((elem) => {
        if (this.dateStart === '' || this.dateEnd === '') {
          return true
        }
        console.log('elem.date_create', elem.date_create, parse(this.dateEnd, this.endFormat.format, new Date()) / 1000)
        if (elem.date_create < parse(this.dateEnd, this.endFormat.format, new Date()) / 1000 &&
          elem.date_create >= parse(this.dateStart, this.startFormat.format, new Date()) / 1000) {
          return true
        }
      })
    },
    errorMessage () {
      return this.$store.getters.getErrorMessage
    }
  },
  methods: {
    handle () {
      // console.log(this.$store.getters.get_db[0].text)
    },
    deleteElem (item) {
      try {
        this.$store.dispatch('deleteNote', item.id)
      } catch (e) {
        alert('Ошибка: ', e)
      }
      alert('Удалено')
    },
    disabledDayStart (day) {
      return this.dateEnd && day > parse(this.dateEnd, this.endFormat.format, new Date())
    },
    disabledDayEnd (day) {
      return this.dateStart && day <= parse(this.dateStart, this.startFormat.format, new Date())
    },
    format,
    parse,
    toggleMenu (index) {
      if (this.openedElement === index) {
        this.openedElement = -1
      } else {
        this.openedElement = index
      }
    },
    toggleCalendars () {
      this.calendarsOpened = !this.calendarsOpened
      if (this.calendarsOpened) {
        this.calendarsOpenedText = '+ Закрыть календари'
      } else {
        this.calendarsOpenedText = '+ Открыть календари'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
$myBlueDark = #3498db
$myBlueLight = #3498db
$myRed = #e74c3c
$myRedDark = #c0392b

.calendars
  max-width 600px
  margin: 0 auto;
  margin-top 1rem

.container
  font-family 'Roboto'

.delete-btn
  cursor: pointer;
  margin: 0;
  margin-top: 0.7rem;
//   // background-color: green;
//   color: $myBlueDark
//   text-decoration none
//   &:hover
//     color $myBlueLight
//     text-decoration underline

// .delete-btn
//   display: inline-block;
//   background-color $myRed
//   color: #FFFFFF;
//   text-align: center;
//   text-decoration: none;
//   opacity: 0.9;
//   cursor: pointer;
//   // border: none;
//   border-radius 10px
//   border 1px solid transparent
//   padding 4px
//   height auto
//   &:hover
//     background-color $myRedDark
//     transition all 0.3s
//   &:active
//     outline none
//   &:focus
//     outline none

// a
//   cursor: pointer;
//   // background-color: green;
//   color: $myBlueDark
//   text-decoration none
//   &:hover
//     color $myBlueLight
//     text-decoration underline

.add-btn
  // color white
  display inline-block
  background-color rgba(black, 0.1)
  text-decoration none
  border 1px solid transparent
  // padding 3px
  padding-left 0.3rem
  padding-right 0.3rem
  margin-left: 10px;
  font-size 20rem
  border-radius 50%
  font-size: 1rem
  text-align center
  align-self center
  &:hover
    opacity 0.9
    background-color rgba(black, 0.2)
    text-decoration none
    transition all 0.3s
  &:active
    outline none

.memos
  width 80%
  text-align center
  margin 0 auto
  display flex
  flex-direction row
  justify-content center
  justify-items center

.container
  display flex
  flex-direction column

.calendars
  display flex
  width: 100%;
  justify-content space-evenly

.list
  margin-top: 10px;

.subtitle
  font-size 10px
  margin-top 0.2rem
  opacity 0.7

.menuClosed
  display none

.threeDots
  width: 1rem;
  height: 1rem;
  display inline-block
  background-image: radial-gradient(circle, black 0.1rem, transparent 0.11rem);
  background-size: 100% 33.33%;
  color: gray;
  border 1px solid transparent
  border-radius 50%
  &:hover
    background-color rgba(black, 0.1)
    cursor pointer

.view-link
  color black

.menu
  position absolute
  right 0
  &__content
    background-color: white;
    display flex
    flex-direction column
    position absolute
    top 0.5rem
    // bottom 2rem
    right 0
    padding-top 1rem
    padding-bottom 1rem
    border 1px solid transparent
    border-radius 2px
    -webkit-box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.57);
    box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.57);
    &__elem
      // padding-top: 0.7rem;
      text-align left
      text-decoration none
      color black
      padding-right: 3rem
      padding-left: 1rem
      border 1px solid transparent
      border-radius 1px
      &:hover
        background-color: rgba(black, 0.05);
        border 1px solid transparent
        border-radius 1px

.calendars__show
  display none

@media (max-width: 600px)
  .calendars
    flex-direction column
    justify-content center
    align-items center
  .calendars__from, .calendars__to, .calendars__show, .calendars__search
    margin-top 0.6rem
  // .calendars__from, .calendars__to
  //   display none
  .calendars__from
    order 1
  .calendars__to
    order 2
  .calendars__show
    display block
</style>
