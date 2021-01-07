<template>
  <span :class="[prefixCls, { 'show-span': span && $slots.default }]">
    <slot />
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
