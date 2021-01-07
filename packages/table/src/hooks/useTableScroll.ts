import type { BasicTableProps, TableRowSelection } from '../types/table';
import type { Ref, ComputedRef } from 'vue';
import { computed, unref, ref } from 'vue';
import type { BasicColumn } from '@bfr-ui/table';

export function useTableScroll(
  propsRef: ComputedRef<BasicTableProps>,
  columnsRef: ComputedRef<BasicColumn[]>,
  rowSelectionRef: ComputedRef<TableRowSelection<any> | null>,
) {
  const getScrollX = computed(() => {
    let width = 0;
    if (unref(rowSelectionRef)) {
      width += 60;
    }

    // TODO props
    const NORMAL_WIDTH = 150;

    const columns = unref(columnsRef);

    columns.forEach(item => {
      width += Number.parseInt(item.width as string) || 0;
    });
    const unsetWidthColumns = columns.filter(item => !Reflect.has(item, 'width'));

    const len = unsetWidthColumns.length;
    if (len !== 0) {
      width += len * NORMAL_WIDTH;
    }
    return width;
  });

  const getScrollRef = computed(() => {
    const { scroll, maxHeight } = unref(propsRef);

    return {
      x: unref(getScrollX),
      scrollToFirstRowOnChange: false,
      ...scroll,
      y: maxHeight ? maxHeight : null,
    };
  });

  return { getScrollRef };
}
