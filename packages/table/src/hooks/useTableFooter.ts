import { ComputedRef, Ref } from 'vue';
import type {  BasicColumn, BasicTableProps } from '../types/table';
import { unref, computed, h, nextTick, watchEffect } from 'vue';
import TableFooter from '../components/TableFooter.vue';
import { useEventListener } from '@bfr-ui/hooks/event/useEventListener';
import { ACTION_COLUMN_FLAG, INDEX_COLUMN_FLAG } from '../const';
export function defaultSummaryMethod (dataSources: Recordable[], columns: BasicColumn[]):Array<string|number> {
  const data = [];
  columns.forEach((column, index) => {
    if([INDEX_COLUMN_FLAG, ACTION_COLUMN_FLAG].includes(column.flag)){
      data[index] = '';
      return;
    }
    const values = dataSources.map(item => Number(item[column.dataIndex]));
    // 判断当前列数据是否都不是NaN
    if (!values.every(value => isNaN(value))) {
      data[index] = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0);
    }else {
      data[index] = '';
    }
  });
  return data;
}
export function useTableFooter(
  propsRef: ComputedRef<BasicTableProps>,
  scrollRef: ComputedRef<{
    x: string | number | true;
    y: Nullable<number|string>;
    scrollToFirstRowOnChange: boolean;
  }>,
  tableElRef: Ref<ComponentRef>,
  getDataSourceRef: ComputedRef<Recordable>,
) {
  const getIsEmptyData = computed(() => {
    return (unref(getDataSourceRef) || []).length === 0;
  });
  const getFooterProps = computed((): Recordable | undefined => {
    const { summaryMethod, showSummary, summaryText } = unref(propsRef);
    return showSummary && !unref(getIsEmptyData)
      ? data => {
        return h(TableFooter, { summaryText, summaryMethod: summaryMethod??defaultSummaryMethod, scroll: unref(scrollRef) });
      }
      : undefined;
  });

  watchEffect(() => {
    handleSummary();
  });

  function handleSummary() {
    const { showSummary } = unref(propsRef);
    if (!showSummary || unref(getIsEmptyData)) return;

    nextTick(() => {
      const tableEl = unref(tableElRef);
      if (!tableEl) return;
      const bodyDomList = tableEl.$el.querySelectorAll('.ant-table-body');
      const bodyDom = bodyDomList[0];
      useEventListener({
        el: bodyDom,
        name: 'scroll',
        listener: () => {
          const footerBodyDom = tableEl.$el.querySelector(
            '.ant-table-footer .ant-table-body',
          ) as HTMLDivElement;
          if (!footerBodyDom || !bodyDom) return;
          footerBodyDom.scrollLeft = bodyDom.scrollLeft;
        },
        wait: 0,
        options: true,
      });
    });
  }
  return { getFooterProps };
}
