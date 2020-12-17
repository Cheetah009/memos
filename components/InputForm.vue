<template lang="pug">
div
  form(@submit.prevent="submitForm(dataFromAPI)")
    p
      //- label(for="title") Title
        span {{ ' ' }}
      input.textInput(id="title" v-model="dataFromAPI.title" type="text" name="title" :placeholder="inputPlaceholder.title")

    p
      //- label(for="text") Text
        span {{ ' ' }}
      textarea(id="text" v-model="dataFromAPI.text" name="text" :placeholder="inputPlaceholder.text" rows="10")

    p.btn
      input.pinkButtonBig(type="submit" :value="inputPlaceholder.button")
</template>

<script>
export default {
  props: {
    inputPlaceholder: {
      type: Object,
      required: false,
      default () {
        return {
          header: 'Заголовок',
          title: 'Заголовок',
          text: 'Введите Ваш Текст',
          button: 'Создать'
        }
      }
    },
    dataFromAPI: {
      type: Object,
      required: false,
      default () {
        return {
          title: '',
          text: ''
        }
      }
    },
    submitForm: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
  $black = #333438
  $grey = #D8D8D8
  $pink = #FF598B
  $white = #FFFFFF

  *
    font-family 'Roboto'

  div
    // width 100%
    display flex
    justify-content center

  form
    text-align center

  .textInput
    font-size: 22px;
    line-height: 26px;
    letter-spacing: 0.02em;
    width 820px
    height: 60px;
    padding 20px
    box-sizing border-box
    background: #FFFFFF;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    border none
    &::placeholder
      color $grey
    @media (max-width: 800px)
      width 400px

  .btn
    margin-top: 40px;
    margin-bottom 0

  .pinkButtonBig
    background-color $pink
    height 40px
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
    border-radius: 15px;
    color $white
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    letter-spacing: 0.02em;
    cursor pointer
    border none
    box-sizing border-box
    min-width 180px
    display: flex;
    align-items: center;
    justify-content center

  textarea
    width 100%
    resize none
    // font-family sans-serif
    box-sizing border-box
    padding 20px
    font-size: 22px;
    line-height: 26px;
    letter-spacing: 0.02em;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    border none
    &::placeholder
      color $grey
</style>
