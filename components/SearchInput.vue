<template lang="pug">
  div
    input(type="text" placeholder="Поиск..." v-model="inputData")
    //- @input="$emit('searchInputChanged', inputData)"
</template>

<script>
import { debounce } from 'debounce'

export default {
  data () {
    return {
      inputData: this.textToSearch
    }
  },
  props: {
    textToSearch: {
      required: false,
      type: String,
      default () {
        return ''
      }
    }
  },
  watch: {
    inputData: {
      immediate: true,
      handler: debounce(function () {
        this.$store.dispatch('filterNotes', this.inputData)
        this.$emit('searchInputChanged', this.inputData)
      }, 130)
    }
  }
}
</script>

<style lang="stylus" scoped>
$border_color = #3498db
$border_radius = 15px

input
  border-radius $border_radius
  border 1px solid transparent
  box-sizing border-box
  height 40px
  font-family 'Roboto'
  padding-left 50px
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
  width: 100%
  &:focus
    outline none
    // border 1px solid green
  @media (max-width: 425px)
    font-size 1.5rem
    height 50px
    padding-left 60px
</style>
