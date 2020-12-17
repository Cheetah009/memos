<template lang="pug">
  items-list(:data="collection" tag="ul" itemTag="li")
    template(#header) Заголовок
      button(@click="addHandle()") Add
      input(v-model="textToAdd")
    template(#item="{ item, index }") {{ item.text }} {{ item.date }}
    template(#footer) {{ footerRender() }}
    template(#empty) {{ emptyHandler() }}
    template(#tools="{ item,index }")
      button(@click="handleDelete(item,index)") Delete
</template>

<script>
import ItemsList from '@/components/ItemsList'

export default {
  components: {
    ItemsList
  },
  methods: {
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
      this.collection.push({ id: new Date(), text: this.textToAdd })
    }
  },
  data () {
    return {
      collection: [
        {
          id: 1,
          text: 'Hello',
          date: '05.12.2020'
        },
        {
          id: 2,
          text: 'There!',
          date: '07.12.2020'
        },
        {
          id: 3,
          text: 'There!',
          date: '12.12.2020'
        }
      ],
      textToAdd: 'Новый элемент'
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
