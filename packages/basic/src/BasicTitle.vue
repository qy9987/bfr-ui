<template>
  <span :class="[prefixCls, { 'show-span': span && $slots.default }]">
    <slot></slot>
    <BasicHelp v-if="helpMessage" :class="`${prefixCls}__help`" :text="helpMessage" />
  </span>
</template>
<script lang="ts">
import type { PropType } from 'vue';

import { defineComponent } from 'vue';

import BasicHelp from './BasicHelp.vue';
import { propTypes } from '@bfr-ui/utils/propTypes';

export default defineComponent({
  name: 'BasicTitle',
  components: { BasicHelp },
  props: {
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    span: propTypes.bool,
  },
  setup() {
    const prefixCls = 'bfr-basic-title';
    return { prefixCls };
  },
});
</script>
<style lang="less" scoped>
  // @import (reference) '../../../design/index.less';
  @prefix-cls: ~'bfr-bfr-basic-title';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    padding-left: 7px;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: @text-color-base;

    .unselect();

    &.show-span::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      background: @primary-color;
      content: '';
    }

    &__help {
      margin-left: 10px;
    }
  }
</style>
