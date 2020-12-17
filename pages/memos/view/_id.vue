<template lang="pug">
  div.viewContainer
    h1 {{ elem.title }}
      p.date {{ format(parse(elem.date_create, 't', new Date()), 'dd.MM.yyyy') }}
    p {{ elem.text }}
    nuxt-link.add-btn(:to="'/memos/'") {{ 'Назад' }}
</template>

<script>
import { parse, format } from 'date-fns'

export default {
  async asyncData (ctx) {
    try {
      await ctx.store.dispatch('getNote', ctx.route.params.id)
      const elem = ctx.store.getters.getNodeForView
      return {
        elem
      }
    } catch {
      alert('Ошибка на сервере!')
      ctx.route.push('/memo')
    }
  },
  methods: {
    parse,
    format
  },
  // computed: {
  //   viewElem () {
  //     this.elem =
  //   }
  // },
  created () {
    console.log('View Page Created!')
  },
  beforeMount () {
    console.log('BeforeMount')
  },
  mounted () {
    console.log('Route', this.$route)
    // this.$store.dispatch('getNote', this.$route.params.id)
    // this.elem = this.$store.getters.getNodeForView
    // console.log('Mount', this.elem)
  }
}
</script>

<style lang="stylus" scoped>
$myBlueDark = #3498db
$myBlueLight = #3498db

.viewContainer
  text-align center
  font-family 'Roboto'

.date
  font-size: 0.8rem
  opacity 0.4

a
  cursor: pointer;
  // background-color: green;
  color: black
  // text-decoration none
  &:hover
    color $myBlueLight
    text-decoration underline
</style>
