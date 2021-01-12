<template>
  <Table
    :show-header="false"
    :bordered="false"
    :pagination="false"
    :data-source="getDataSource"
    :row-key="(r) => r[rowKey]"
    :columns="getColumns"
    table-layout="fixed"
    :scroll="scroll"
  />
</template>
<script lang="ts">
import { PropType, ref, watch } from 'vue';

import { defineComponent, unref, computed } from 'vue';
import { Table } from 'ant-design-vue';
import { cloneDeep, isEmpty } from 'lodash';
import { isFunction } from '@bfr-ui/utils/is';
import type { BasicColumn } from '../types/table';
import { propTypes } from '@bfr-ui/utils/propTypes';
import { useTableContext } from '../hooks/useTableContext';
import { defaultSummaryMethod } from '../hooks/useTableFooter';

export default defineComponent({
  name: 'BasicTableFooter',
  components: { Table },
  props: {
    summaryMethod: {
      type: Function as PropType<typeof defaultSummaryMethod>,
    },
    summaryText: {
      type: String,
      default: '合计',
    },
    data: {
      type: Array,
    },
    columns: {
      type: Array,
    },
    scroll: {
      type: Object as PropType<Recordable>,
    },
    rowKey: propTypes.string.def('key'),
  },
  setup(props) {
    const table = useTableContext();
    const summaryMethod = ref(props.summaryMethod);
    const getDataSource = computed(()=>{
      const columns: BasicColumn[] = cloneDeep(table.getColumns());
      if (!isFunction(unref(summaryMethod))) {
        return [];
      }
      // TODO 考虑更好实现
      const summaryData = summaryMethod.value(table.getDataSource(), columns);
      const dataSource = { [`${props.rowKey}`]: 'rowKey' };
      columns.forEach((column, index)=>{
        // 序号列存在，序号列即为第一列
        if(index==0&&!(props.summaryMethod instanceof defaultSummaryMethod)) {
          dataSource[column.dataIndex] = props.summaryText;
        }else {
          if(!isEmpty(column.dataIndex)) {
            dataSource[column.dataIndex] = summaryData[index] as string;
          }
        }
      });
      return [dataSource];
    });
    const getColumns = computed(() => {
      const columns: BasicColumn[] = cloneDeep(table.getColumns());
      if (!isFunction(unref(summaryMethod))) {
        return [];
      }
      const resColumns = columns.map(column=>{
        Reflect.deleteProperty(column, 'customRender');
        return column;
      });
      return resColumns;
    });


    return { getColumns, getDataSource };
  },
});
</script>
