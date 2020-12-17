<template lang="pug">
  transition(name="fade", mode="out-in")
    .popUp(v-if="status")
      .popUp__content
        .popUp__header
          div.popUp__header__title
            slot(name="popTitle")
          .popUp__header__close
            slot(name="popClose")
        .popUp__body
          slot(name="popBody")
        //- .popUp__buttons
        //-   slot(name="popButtons")
</template>

<script>
export default {
  name: 'PopUpModal',
  props: {
    overlay: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      status: false
    }
  },
  methods: {
    open () {
      this.status = true
    },
    close () {
      this.status = false
    }
  }
}
</script>

<style lang="stylus">
  .popUp
    position fixed
    width 100%
    height 100%
    z-index 9999
    overflow-x hidden
    overflow-y auto
    // padding-top 10vh
    left 0
    top 0
    background rgba(0,0,0,.37)
    display flex
    align-items center
    justify-content center
    flex-flow column no-warp
    &__content
      box-sizing border-box
      min-width 420px
      padding 40px
      background white
      border-radius 5px
    &__header
      display flex
      justify-content space-between
      align-items center
      margin-bottom: 20px;
      // &__title
      //   font-weight 700
      &__close
        // font-size 20px
        // height 25px
        cursor pointer
      &__close img
        height 25px
    // &__body
    //   margin-bottom: 20px;
    &__buttons button
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
      &__buttons button:not(:first-child)
        background-color white
        color #FF598B
        margin-left 20px
  .fade
    &-enter-active, &-leave-active
      transition opacity .3s ease
    &-enter, &-leave-to
      opacity 0
</style>
