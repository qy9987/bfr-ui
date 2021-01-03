<template>
  <BasicTitle v-if="getTitle" :class="prefixCls" :help-message="helpMessage">
    {{ getTitle }}
  </BasicTitle>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import { BasicTitle } from '@bfr-ui/basic/index';
import { isFunction } from '@bfr-ui/utils/is';
export default defineComponent({
  name: 'BasicTableTitle',
  components: { BasicTitle },
  props: {
    title: {
      type: [Function, String] as PropType<string | ((data: Recordable) => string)>,
    },
    getSelectRows: {
      type: Function as PropType<() => Recordable[]>,
    },
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
  },
  setup(props) {
    const prefixCls = 'bfr-table-title';

    const getTitle = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const { title, getSelectRows = () => {} } = props;
      let tit = title;

      if (isFunction(title)) {
        tit = title({
          selectRows: getSelectRows(),
        });
      }
      return tit;
    });

    return { getTitle, prefixCls };
  },
});
</script>
<style lang="less">
  @prefix-cls: ~'bfr-basic-table-title';

  .@{prefix-cls} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
