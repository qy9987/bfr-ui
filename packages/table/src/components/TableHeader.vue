<template>
  <slot v-if="$slots.tableTitle" name="tableTitle" />
  <TableTitle v-if="!$slots.tableTitle && title" :help-message="titleHelpMessage" :title="title" />

  <div :class="`${prefixCls}__toolbar`">
    <slot name="toolbar" />
    <Divider v-if="$slots.toolbar" type="vertical" />
    <TableSetting v-if="showTableSetting" :setting="tableSetting" />
  </div>
</template>
<script lang="ts">
import type { TableSetting } from '../types/table';
import type { PropType } from 'vue';
import { Divider } from 'ant-design-vue';
import { defineComponent } from 'vue';

import TableSettingComp from './settings/index.vue';
import TableTitle from './TableTitle.vue';

export default defineComponent({
  name: 'BasicTableHeader',
  components: {
    Divider,
    TableTitle,
    TableSetting: TableSettingComp,
  },
  props: {
    title: {
      type: [Function, String] as PropType<string | ((data: Recordable) => string)>,
    },
    tableSetting: {
      type: Object as PropType<TableSetting>,
    },
    showTableSetting: {
      type: Boolean,
    },
    titleHelpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
  },
  setup() {
    const prefixCls = 'bfr-table-header';
    return { prefixCls };
  },
});
</script>
<style lang="less">
@prefix-cls: ~'bfr-table-header';

  .@{prefix-cls} {
    &__toolbar {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      > * {
        margin-right: 8px;
      }
    }
  }
</style>
