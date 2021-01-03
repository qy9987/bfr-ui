<template>
  <Button v-bind="getBindValue" :class="[getColor, $attrs.class]">
    <template #default="data">
      <i v-if="preIcon" :icon="preIcon" :size="14" />
      <slot v-bind="data" />
      <i v-if="postIcon" :icon="postIcon" :size="14" />
    </template>
  </Button>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';

import { Button } from 'ant-design-vue';
import { propTypes } from '@bfr-ui/utils/propTypes';

export default defineComponent({
  name: 'AButton',
  components: { Button },
  inheritAttrs: false,
  props: {
    type: propTypes.oneOf(['primary', 'default', 'danger', 'dashed', 'link']).def('default'),
    color: propTypes.oneOf(['error', 'warning', 'success', '']),
    loading: propTypes.bool,
    disabled: propTypes.bool,
    preIcon: propTypes.string,
    postIcon: propTypes.string,
  },
  setup(props, { attrs }) {
    const getColor = computed(() => {
      const { color, disabled } = props;
      return {
        [`ant-btn-${color}`]: !!color,
        [`is-disabled`]: disabled,
      };
    });

    const getBindValue = computed((): any => {
      return { ...attrs, ...props };
    });

    return { getBindValue, getColor };
  },
});
</script>
