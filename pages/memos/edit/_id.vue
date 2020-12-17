<template lang="pug">
  //- div
  //-   h1 {{ elem.title }}
  //-   p {{ elem.text }}
  //-   button(@click="handleEdit") edit
  div.editContaner
    h1 Редактирование заметки
    input-form(:submitForm="handleEdit" :dataFromAPI="editData" :inputPlaceholder="inputPlaceholder")
    nuxt-link.add-btn(:to="'/memos/'") {{ 'Назад' }}
</template>

<script>

export default {
  data () {
    return {
      // editData: {
      //   title: this.$store.getters.get_note_byID(this.$route.params.id).title,
      //   text: this.$store.getters.get_note_byID(this.$route.params.id).text
      // },
      inputPlaceholder: {
        title: 'Заголовок',
        text: 'Введите текст...',
        button: 'Изменить'
      }
    }
  },
  async asyncData (ctx) {
    try {
      await ctx.store.dispatch('getNote', ctx.route.params.id)
      const editData = ctx.store.getters.getNodeForView
      return {
        editData
      }
    } catch {
      alert('Ошибка на сервере!')
      ctx.route.push('/memo')
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    handleEdit (data) {
      const toPost = {
        ...data,
        id: this.$store.getters.get_note_byID(this.$route.params.id).id
      }
      try {
        this.$store.dispatch('editNote', toPost)
      } catch (e) {
        alert('Ошибка: ', e)
      }
      alert('Отправлено!')
    }
  }
}
</script>

<style lang="stylus" scoped>
$myBlueDark = #3498db
$myBlueLight = #3498db

.editContaner
  text-align center
  font-family 'Roboto'

a
  cursor: pointer;
  color: black
  &:hover
    color $myBlueLight
    text-decoration underline
</style>
