<template lang="pug">
  div.addContainer
    h1 Добавить заметку
    input-form(:submitForm="handleAdd" :inputPlaceholder="inputPlaceholder")
    nuxt-link.add-btn(:to="'/memos/'") {{ 'Назад' }}
</template>

<script>
import InputForm from '@/components/InputForm'

export default {
  data () {
    return {
      inputPlaceholder: {
        title: 'Заголовок',
        text: 'Введите текст...',
        button: 'Добавить'
      }
    }
  },
  components: {
    InputForm
  },
  methods: {
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
      this.$router.push('/memos')
      alert('Отправлено!')
    }
  }
}
</script>

<style lang="stylus" scoped>
$myBlueDark = #3498db
$myBlueLight = #3498db

.addContainer
  text-align center
  font-family 'Roboto'

a
  cursor: pointer;
  color: black
  &:hover
    color $myBlueLight
    text-decoration underline
</style>
