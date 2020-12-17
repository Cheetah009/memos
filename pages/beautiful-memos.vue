<template lang="pug">
div.container
  h1.container__title Мои заметки
  .container__inputBlock
    .container__inputBlock__block
      search-input.container__inputBlock__input(v-model='textToSearch')
      img.searchIcon(:src="require(`~/assets/img/search.svg`)")
      img.filterIcon(:src="require(`~/assets/img/filter.svg`)" @click="onClickFilter")
    button.container__inputBlock__button.pinkButtonBig(@click="onClickCreate")
      img.container__inputBlock__plusButton(:src="require(`~/assets/img/union.svg`)" @click="onClickFilter")
      span Создать

  .emptyNote(v-if="isEmpty") Ой, пусто!

  .memoContainer(ref="memoContainer")
    .memoElem(v-for="(elem, index) in filteredCollection")
      h2.memoElem__title {{ elem.title }}
      p.memoElem__text {{ elem.text }}
      .memoElem__bottom
        .memoElem__date {{ format(parse(elem.date_create, 't', new Date()), 'dd.MM.yyyy') }}
        .memoElem__tools
          img.memoElem__tools__edit(@click="onClickEdit(elem.id)" :src="require(`~/assets/img/editButton.svg`)")
          img.memoElem__tools__delete(@click="handleDelete(elem.id)" :src="require(`~/assets/img/deleteButton.svg`)")

  pop-up-modal(ref="createNote")
    template(#popTitle)
      p.modalTextBig Создать заметку
    template(#popClose)
      span(@click="onClickClose")
        img(:src="require(`~/assets/img/closeButton.svg`)")
    template(#popBody)
      input-form(:submitForm="handleAdd")

  pop-up-modal(ref="editNote")
    template(#popTitle)
      p.modalTextBig Редактировать заметку
    template(#popClose)
      span(@click="onClickClose")
        img(:src="require(`~/assets/img/closeButton.svg`)")
    template(#popBody)
      input-form(:submitForm="handleEdit" :dataFromAPI="editData" :inputPlaceholder="{ title: 'Заголовок', text: 'Введите Ваш Текст', button: 'Сохранить'}")

  pop-up-modal(ref="filterNote")
    template(#popTitle)
      p.modalText Отфильтровать
    template(#popClose)
      span(@click="$refs.filterNote.close")
        img(:src="require(`~/assets/img/closeButton.svg`)")
    template(#popBody)
      .filterBodyText По дате
      .datePickers
        .datePickers__content
          date-picker(v-bind:inputDate="dateStart", v-on:inputChanged="dateStartCashed = $event", v-bind:disabledDay="disabledDayStart" :style="{ '--color': startColor }" :dateFormat="startFormat" :value="dateStart")
          span c
        .datePickers__content
          date-picker(v-bind:inputDate="dateEnd", v-on:inputChanged="dateEndCashed = $event", v-bind:disabledDay="disabledDayEnd" :style="{ '--color': endColor }" :dateFormat="endFormat")
          span по
      .filterButtons
        button(@click="applyDatePickers") Применить
        button(@click="resetDatePickers") Сбросить

  pop-up-modal(ref="confirmNote")
    template(#popBody)
      .filterBodyText
        p Вы уверены, что хотите закрыть окно?
        p В этом случае, изменения не сохранятся
      .filterButtons
        button(@click="confirmBack") Вернуться
        button(@click="confirmClose") Закрыть
</template>

<script>
import PopUpModal from '@/components/PopUpModal'
import DatePicker from '@/components/DatePicker'
import ItemsList from '@/components/ItemsList'
import SearchInput from '@/components/SearchInput'
import { parse, format } from 'date-fns'

export default {
  components: {
    PopUpModal,
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
      dateStartCashed: '',
      dateEndCashed: '',
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
      calendarsOpenedText: '+ Открыть календари',
      editId: '',
      editData: {},
      windowHeight: 0,
      isEmpty: false
    }
  },
  watch: {
    filteredCollection: {
      // immediate: true,
      handler () {
        if (this.filteredCollection.length === 0) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
        }
        this.calculateMemosHeigth()
      }
    },
    textToSearch: {
      // immediate: true,
      handler () {
        this.calculateMemosHeigth()
      }
    }
  },
  mounted () {
    this.calculateMemosHeigth()
    this.$nextTick(function () {
      this.onResize()
      this.calculateMemosHeigth()
    })
    window.addEventListener('resize', this.onResize)
    this.windowHeight = window.outerWidth
  },
  computed: {
    filteredCollection () {
      const array = this.$store.getters.getAllNotes
      return array.filter((elem) => {
        if (this.dateStart === '' || this.dateEnd === '') {
          return true
        }
        if (elem.date_create < parse(this.dateEnd, this.endFormat.format, new Date()) / 1000 &&
          elem.date_create >= parse(this.dateStart, this.startFormat.format, new Date()) / 1000) {
          return true
        }
      })
    },
    errorMessage () {
      return this.$store.getters.getErrorMessage
    },
    determineMemosHeight () {
      let heightFirst = 0
      let heightSecond = 0
      let heightThird = 0
      let i = 0
      for (const elem of this.$refs.memoContainer.children) {
        if (this.windowHeight > 800) {
          // Можно сделать одной функцией через математику
          if (i % 3 === 0) {
            heightFirst += elem.clientHeight + 40
          }
          if (i % 3 === 1) {
            heightSecond += elem.clientHeight + 40
          }
          if (i % 3 === 2) {
            heightThird += elem.clientHeight + 40
          }
        } else if (this.windowHeight <= 800 && this.windowHeight > 425) {
          if (i % 2 === 0) {
            heightFirst += elem.clientHeight + 40
          }
          if (i % 2 === 1) {
            heightSecond += elem.clientHeight + 40
          }
        } else {
          heightFirst += elem.clientHeight + 40
        }
        i++
      }

      return Math.max(heightFirst, heightSecond, heightThird)
    }
  },
  methods: {
    onResize () {
      this.windowHeight = window.outerWidth
      if (this.$refs.memoContainer) {
        this.calculateMemosHeigth()
      }
    },
    calculateMemosHeigth () {
      this.$refs.memoContainer.style.height = this.determineMemosHeight + 'px'
    },
    onClickCreate () {
      this.$refs.filterNote.close()
      this.$refs.createNote.open()
      this.calculateMemosHeigth()
    },
    onClickEdit (id) {
      // this.editId = id
      this.getEditData(id)
      this.$refs.editNote.open()
    },
    onClickClose () {
      this.$refs.confirmNote.open()
    },
    async getEditData (id) {
      try {
        await this.$store.dispatch('getNote', id)
        const editData = this.$store.getters.getNodeForView
        this.editData = editData
        // return {
        //   editData
        // }
      } catch {
        alert('Ошибка на сервере!')
        // ctx.route.push('/memo')
      }
    },
    confirmBack () {
      this.$refs.confirmNote.close()
    },
    confirmClose () {
      this.$refs.confirmNote.close()
      this.$refs.createNote.close()
      this.$refs.editNote.close()
      this.editData = {}
    },
    onClickFilter () {
      this.$refs.filterNote.open()
      if (this.dateStartCashed) {
        this.dateStart = this.dateStartCashed
      }
    },
    applyDatePickers () {
      this.dateStart = this.dateStartCashed
      this.dateEnd = this.dateEndCashed
      this.$refs.filterNote.close()
    },
    resetDatePickers () {
      this.dateStart = ''
      this.dateEnd = ''
      this.dateStartCashed = ''
      this.dateEndCashed = ''
      this.$refs.filterNote.close()
    },
    handleAdd (data) {
      if (data.title === '' || data.text === '') {
        alert('Данные не заполнены полностью!')
        return
      }
      try {
        this.$store.dispatch('addNote', data)
      } catch (e) {
        alert('Ошибка: ', e)
      }
      alert('Отправлено!')
      this.$refs.createNote.close()
      this.calculateMemosHeigth()
    },
    handleEdit (data) {
      const toPost = {
        ...data,
        id: this.editData.id
      }
      try {
        this.$store.dispatch('editNote', toPost)
      } catch (e) {
        alert('Ошибка: ', e)
      }
      this.$refs.editNote.close()
      this.calculateMemosHeigth()
    },
    handleDelete (id) {
      try {
        this.$store.dispatch('deleteNote', id)
      } catch (e) {
        alert('Ошибка: ', e)
      }
      alert('Удалено')
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
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
$myBlueDark = #3498db
$myBlueLight = #3498db
$myRed = #e74c3c
$myRedDark = #c0392b

*
  font-family 'Roboto'
  color $black
  @media (max-width: 425px)
    font-size 1.5rem

img
  @media (max-width: 425px)
    height 1.5rem

$black = #333438
$grey = #D8D8D8
$pink = #FF598B
$white = #FFFFFF

.container
  padding-top 10vh
  min-width 600px
  max-width 1200px
  width 80%
  margin 0 auto
  &__title
    color $black
    font-style: normal;
    font-weight 500
    font-size 36px
    line-height: 42px;
    letter-spacing: 0.02em;
    margin-bottom 3rem
    @media (max-width: 800px)
      text-align center
    @media (max-width: 425px)
      font-size 4rem
  &__inputBlock
    display flex
    @media (max-width: 800px)
      flex-direction column
    &__block
      flex 7
      position relative
    &__input
      width 100%
    &__button
      flex 1
      min-width 180px
      margin-left 40px
      display: flex;
      align-items: center;
      justify-content center
      @media (max-width: 800px)
        margin-bottom 20px
        margin-left 0
        order -1
    &__plusButton
      padding-right 8px

.pinkButtonBig
  background-color $pink
  height 40px
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  color $white
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 42px;
  letter-spacing: 0.02em;
  cursor pointer
  border none
  box-sizing border-box

.searchIcon
  position absolute
  top 12px
  left 22px
  height 16px
  cursor pointer
  @media (max-width: 425px)
    height 1.5rem

.filterIcon
  position absolute
  top 12px
  right 22px
  height 16px
  cursor pointer
  @media (max-width: 425px)
    height 1.5rem

.modalTextBig
  font-weight 500
  font-size: 36px;
  line-height: 42px;
  letter-spacing: 0.02em;
  margin 0
  padding-right 20px

.modalText
  font-weight 700
  font-size: 22px;
  line-height: 26px;
  letter-spacing: 0.02em;
  margin 0

.emptyNote
  margin-top 20px

.datePickers
  display flex
  &__content
    position relative
  &__content span
    position absolute
    top 12px
    left 15px
    color $grey
    font-size 0.8rem
  &__content:first-child
    margin-right 20px

.filterBodyText
  text-align left
  margin-bottom 20px
  font-size: 18px;
  line-height: 21px;

.filterButtons
  margin-top 20px

.filterButtons button
  width 150px
  height 40px
  border-radius 15px
  border 2px solid #FF598B
  box-sizing: border-box;
  background-color #FF598B
  color white
  font-weight 500
  line-height: 16px;
  letter-spacing: 0.02em;
  cursor pointer

.filterButtons button:not(:first-child)
  background-color white
  color #FF598B
  margin-left 20px

.memoContainer
  margin-top 40px
  display flex
  flex-flow: column wrap;
  align-content: space-between;
  // height 300vh
  &::before, &::after
    content: "";
    flex-basis: 100%;
    width: 0;
    order: 2;

.memoElem
  background: #FFFFFF;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  width calc( 32% - 20px )
  margin 20px 10px
  padding 30px 20px
  box-sizing border-box
  height auto
  @media (max-width: 800px)
    width calc( 49% - 20px )
  @media (max-width: 425px)
    width calc( 99% - 20px )
  &__title
    font-size 22px
    line-height: 26px;
  &:nth-child(3n+1)
    order 1
    margin-left 0
    @media (max-width: 800px)
      order 0
      margin-left 20px
  &:nth-child(3n+2)
    order 2
    @media (max-width: 800px)
      order 0
      margin-left 20px
  &:nth-child(3n)
    order 3
    margin-right 0
    @media (max-width: 800px)
      order 0
      margin-left 20px
  &:nth-child(2n+1)
    @media (max-width: 800px)
      order 1
      margin-left 0
      @media (max-width: 425px)
        order 0
        margin 20px 10px
  &:nth-child(2n)
    @media (max-width: 800px)
      order 2
      margin-right 0
      @media (max-width: 425px)
        order 0
        margin 20px 10px
  &__bottom
    margin-top 50px
    display flex
    justify-content space-between
    align-items center
    // @media (max-width: 800px)
    //   flex-direction column
  &__title
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    margin: 0;
    color $black
  &__tools
    @media (max-width: 800px)
      margin-top 10px
      display flex
      justify-content space-between
    &__edit
      padding-right: 25px;
      cursor pointer
    &__delete
      cursor pointer
  &__date
    color $grey

.calendars
  max-width 600px
  margin: 0 auto;
  margin-top 1rem

.delete-btn
  cursor: pointer;
  margin: 0;
  margin-top: 0.7rem;

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
