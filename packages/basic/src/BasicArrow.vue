<template>
  <span :class="getClass">
    <RightOutlined />
  </span>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import { propTypes } from '@bfr-ui/utils/propTypes';

export default defineComponent({
  name: 'BasicArrow',
  components: { RightOutlined },
  props: {
    // Expand contract, expand by default
    expand: propTypes.bool,
    top: propTypes.bool,
    bottom: propTypes.bool,
    inset: propTypes.bool,
  },
  setup(props) {
    const prefixCls = 'bfr-basic-arrow';

    const getClass = computed(() => {
      const { expand, top, bottom, inset } = props;
      return [
        prefixCls,
        {
          [`${prefixCls}--active`]: expand,
          top,
          inset,
          bottom,
        },
      ];
    });

    return {
      getClass,
    };
  },
});
</script>
