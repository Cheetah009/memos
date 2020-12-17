<script>
export default {
  data () {
    return {
    }
  },
  props: {
    data: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    tag: {
      type: String,
      required: true,
      default () {
        return 'ul'
      }
    },
    itemTag: {
      type: String,
      required: true,
      default () {
        return 'li'
      }
    }
  },
  render (h) {
    console.log(h)
    // const func = () => ['IAIAIAIA']
    return h('div', { class: 'container' }, [
      this.$slots.header && h('h1', { class: 'container__header' }, this.$slots.header),
      h(this.tag, { class: 'il' },
        [
          this.data.length ? this.data.map((item, index) => {
            return h(this.itemTag, { class: 'il__item' },
              [
                h('div', { class: 'il__item__content' },
                  [
                    this.$scopedSlots.item ? this.$scopedSlots.item({ item, index }) : item
                  ]
                ),
                this.$scopedSlots.tools && h('div', { class: 'il__item__tools' },
                  [
                    this.$scopedSlots.tools ? this.$scopedSlots.tools({ item, index }) : item
                  ]
                )
              ])
          }) : this.$slots.empty
        ]
      ),

      // this.$slots.footer &&
      // h('div', {}, (this.$slots.footer || (() => {
      //   return ['Default Content: ', 'ahh']
      // })))
      h('div', { class: 'footer' }, this.$slots.footer)
    ])
  }
}
</script>

<style lang="stylus" scoped>
  .container
    width 100%
    max-width 600px
    &:__header
      margin-bottom 2000px

  .footer
    margin-top: 1rem;

  .il
    display flex
    flex-direction column
    flex-wrap wrap
    max-width 100%
    &__item
      display flex
      // flex-flow row nowrap
      max-width 100%
      // height auto
      align-items center
      min-height 4rem
      border-bottom 1px solid rgba(black, 0.05)
      &__content
        text-align left
        flex 4
      &__tools
        text-align right
        align-items center
        flex 2
  // .il
  //   display flex
  //   flex-flow column wrap
  //   list-style: none;
  //   justify-content center
  //   // align-items center
  //   max-width 100%
  //   width 100%
  //   text-align left
  //   &__item
  //     display flex
  //     flex-flow row nowrap
  //     max-width 100%
  //     border-bottom 1px solid black
  //     align-items center
  //     justify-content center
  //     &__content
  //       flex 3
  //     &__tools
  //       // justify-self flex end
  //       text-align right
  //       justify-content center
  //       align-self center
  //       flex 2
</style>
