<script lang="ts">
import { defineComponent, h, unref } from 'vue';

import { Popconfirm } from 'ant-design-vue';
import BasicButton from './BasicButton.vue';
import { propTypes } from '@bfr-ui/utils/propTypes';
// import { extendSlots } from '/@/utils/helper/tsxHelper';
import { omit } from 'lodash';

export default defineComponent({
  name: 'PopButton',
  components: { Popconfirm, BasicButton },
  inheritAttrs: false,
  props: {
    enable: propTypes.bool.def(true),
    okText: propTypes.string.def('确定'),
    cancelText: propTypes.string.def('取消'),
  },
  setup(props, { slots, attrs }) {
    return () => {
      const popValues = { ...props, ...unref(attrs) };

      const Button = h(BasicButton, omit(unref(attrs), 'icon'), slots);
      if (!props.enable) {
        return Button;
      }

      return h(Popconfirm, omit(popValues, 'icon'), { default: () => Button });
    };
  },
});
</script>
