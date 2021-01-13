import type { PaginationProps } from '../types/pagination';
import type { BasicTableProps } from '../types/table';

import { computed, unref, ref, ComputedRef } from 'vue';

import { isBoolean } from '@bfr-ui/utils/is';

import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../const';

export function usePagination(refProps: ComputedRef<BasicTableProps>) {
  const configRef = ref<PaginationProps>({});

  const paginationInfo = computed((): PaginationProps | boolean => {
    const { pagination } = unref(refProps);
    if (isBoolean(pagination) && !pagination) {
      return false;
    }
    return {
      current: 1,
      pageSize: PAGE_SIZE,
      size: 'small',
      defaultPageSize: PAGE_SIZE,
      showTotal: total => `共 ${total} 条数据`,
      showSizeChanger: true,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      itemRender: isBoolean(pagination)?null:pagination?.itemRender,
      showQuickJumper: true,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
    };
  });
  // 设置分页组件配置
  function setPagination(info: Partial<PaginationProps>) {
    const unRefPaginationInfo = unref(paginationInfo);
    configRef.value = {
      ...(!isBoolean(unRefPaginationInfo) ? unRefPaginationInfo : {}),
      ...info,
    };
  }
  // 获取分页配置
  function getPagination() {
    return unref(paginationInfo);
  }
  return { getPagination, paginationInfo, setPagination };
}
