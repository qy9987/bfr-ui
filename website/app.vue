<template>
  <div id="app" class="is-component">
    <main-header />
    <bfr-scrollbar
      ref="scroll"
      class="main-cnt"
      wrap-class="main-cnt__wrap"
      @scroll="handlerScroll"
    >
      <router-view />
    </bfr-scrollbar>
    <a-back-top
      :target="getScrollTarget"
    />
    <!-- <main-footer /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App',
  setup(props) {
    // setup(props,context)
    const handleScroll = () => {
      // top
    };
    return {
      handleScroll,
      props,
    };
  },
  watch: {
    '$route'(newval, oldval) {
      if(newval.path!==oldval.path){
        setTimeout(() => {
          this.goAnchor();
        }, 500);
      }
    },
  },
  mounted() {
    this.$nextTick(()=>{
      setTimeout(()=>{
        this.goAnchor();

      }, 500);
    });
  },
  methods: {
    goAnchor() {
      if (location.href.match(/#/g).length > 1) {
        const anchor = location.href.match(/#[^#]+$/g);
        if (!anchor) return;
        const elm = document.querySelector(anchor[0]);
        if (!elm) return;
        setTimeout(() => {
          this.$refs.scroll.scrollToY((elm as HTMLElement).offsetTop - 60);
        }, 50);
      }
    },
    getScrollTarget() {
      return document.querySelector('.main-cnt .bfr-scrollbar__wrap');
    },
  },
});
</script>

<style lang="less" scoped>
.main-cnt {
  height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
}
</style>
