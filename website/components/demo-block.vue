<template>
  <div
    class="demo-block"
    :class="[blockClass, { 'hover': hovering }]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="source">
      <slot name="source" />
    </div>
    <div
      ref="control"
      class="demo-block-control"
      @click="isExpanded = !isExpanded"
    >
      <transition name="arrow-slide" mode="out-in">
        <CaretUpOutlined v-if="isExpanded" class="icon" :class="{ 'hovering': hovering }" />
        <CaretDownOutlined v-else class="icon" :class="{ 'hovering': hovering }" />
      </transition>
      <transition name="text-slide">
        <span v-show="hovering" class="text">{{ controlText }}</span>
      </transition>
    </div>
    <div ref="meta" class="meta">
      <div v-if="$slots.default" class="description">
        <slot />
      </div>
      <div class="highlight">
        <slot name="highlight" />
      </div>
    </div>
  </div>
</template>
<script>
import { nextTick } from 'vue';
import hljs from 'highlight.js';
import { stripScript, stripStyle, stripTemplate } from '../util';
import { CaretUpOutlined,CaretDownOutlined } from '@ant-design/icons-vue';
export default {
  components: {
    CaretUpOutlined,CaretDownOutlined,
  },
  data() {
    return {
      codepen: {
        script: '',
        html: '',
        style: '',
      },
      hovering: false,
      isExpanded: false,
      scrollParent: null,
    };
  },

  computed: {
    lang() {
      return this.$route.path.split('/')[1];
    },

    langConfig() {
      return [];
    },

    blockClass() {
      return `demo-${ this.lang } demo-${ this.$router.currentRoute.value.path.split('/').pop() }`;
    },

    controlText() {
      return this.isExpanded ? '隐藏代码' : '显示代码';
    },

    codeArea() {
      return this.$el.getElementsByClassName('meta')[0];
    },

    codeAreaHeight() {
      if (this.$el.getElementsByClassName('description').length > 0) {
        return this.$el.getElementsByClassName('description')[0].clientHeight +
            this.$el.getElementsByClassName('highlight')[0].clientHeight + 20;
      }
      return this.$el.getElementsByClassName('highlight')[0].clientHeight;
    },
  },

  watch: {
    isExpanded(val) {
      this.codeArea.style.height = val ? `${ this.codeAreaHeight + 1 }px` : '0';
    },
  },

  created() {
    const highlight = this.$slots.highlight();
    if (highlight && highlight[0]) {
      let code = '';
      let cur = highlight[0];
      if (cur.type === 'pre' && (cur.children && cur.children[0])) {
        cur = cur.children[0];
        if (cur.type === 'code') {
          code = cur.children;
        }
      }
      if (code) {
        this.codepen.html = stripTemplate(code).replace(/<\/?template>/g, '');
        this.codepen.script = stripScript(code);
        this.codepen.style = stripStyle(code);
      }
    }
  },

  mounted() {
    nextTick(() => {
      let highlight = this.$el.getElementsByClassName('highlight')[0];
      if (this.$el.getElementsByClassName('description').length === 0) {
        highlight.style.width = '100%';
        highlight.borderRight = 'none';
      }

      try {
        hljs.highlightBlock(highlight.querySelector('code'));
      } catch (error) {
        console.log(error);
      }
    });
  },
};
</script>
<style lang="less" scoped>
  .demo-block {
    border: solid 1px #ebebeb;
    border-radius: 3px;
    transition: .2s;

    &.hover {
      box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
    }

    code {
      font-family: Menlo, Monaco, Consolas, Courier, monospace;
    }

    .demo-button {
      float: right;
    }

    .source {
      padding: 24px;
    }

    .meta {
      background-color: #fafafa;
      border-top: solid 1px #eaeefb;
      overflow: hidden;
      height: 0;
      transition: height .2s;
    }

    .description {
      padding: 20px;
      box-sizing: border-box;
      border: solid 1px #ebebeb;
      border-radius: 3px;
      font-size: 14px;
      line-height: 22px;
      color: #666;
      word-break: break-word;
      margin: 10px;
      background-color: #fff;

      p {
        margin: 0;
        line-height: 26px;
      }

      code {
        color: #5e6d82;
        background-color: #e6effb;
        margin: 0 4px;
        display: inline-block;
        padding: 1px 5px;
        font-size: 12px;
        border-radius: 3px;
        height: 18px;
        line-height: 18px;
      }
    }

    :deep .highlight {
      pre {
        margin: 0;
      }

      code.hljs {
        margin: 0;
        border: none;
        max-height: none;
        border-radius: 0;

        &::before {
          content: none;
        }
      }
    }

    .demo-block-control {
      border-top: solid 1px #eaeefb;
      height: 44px;
      box-sizing: border-box;
      background-color: #fff;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: center;
      margin-top: -1px;
      color: #d3dce6;
      cursor: pointer;
      position: relative;

      &.is-fixed {
        position: fixed;
        bottom: 0;
        width: 868px;
      }

      .icon {
        font-size: 16px;
        line-height: 44px;
        transition: .3s;
        &.hovering {
          transform: translateX(-40px);
        }
      }

      > .text {
        position: absolute;
        transform: translateX(-30px);
        font-size: 14px;
        line-height: 44px;
        transition: .3s;
        display: inline-block;
      }

      &:hover {
        color: #409EFF;
        background-color: #f9fafc;
      }

      & .text-slide-enter,
      & .text-slide-leave-active {
        opacity: 0;
        transform: translateX(10px);
      }

      .control-button {
        line-height: 26px;
        position: absolute;
        top: 0;
        right: 0;
        font-size: 14px;
        padding-left: 5px;
        padding-right: 25px;
      }
    }
  }
</style>
