<template>
  <div class="bfr-table-settings">
    <RedoSetting v-if="getSetting.size" class="redo-setting" />
    <SizeSetting v-if="getSetting.redo" class="size-setting" />

    <ColumnSetting v-if="getSetting.setting" class="column-setting" :show-fixed="getSetting.allowFixed" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import type { TableSetting } from '../../types/table';
import ColumnSetting from './ColumnSetting.vue';
import SizeSetting from './SizeSetting.vue';
import RedoSetting from './RedoSetting.vue';
export default defineComponent({
  name: 'TableSetting',
  components: {
    ColumnSetting,
    SizeSetting,
    RedoSetting,
  },
  props: {
    setting: {
      type: Object as PropType<TableSetting>,
      default: {},
    },
  },
  setup(props) {

    const getSetting = computed(
      (): TableSetting => {
        return {
          redo: true,
          size: true,
          setting: true,
          ...props.setting,
        };
      },
    );

    return { getSetting };
  },
});
</script>
