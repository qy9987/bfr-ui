import type { BasicTableProps, FetchParams } from '../types/table';
import type { PaginationProps } from '../types/pagination';

import { ref, unref, ComputedRef, computed, onMounted, watchEffect } from 'vue';

import { useTimeout } from '@bfr-ui/hooks/core/useTimeout';

import { buildUUID } from '@bfr-ui/utils/uuid';
import { isFunction, isBoolean } from '@bfr-ui/utils/is';
import { cloneDeep, get } from 'lodash';

import { FETCH_SETTING, ROW_KEY, PAGE_SIZE } from '../const';

interface ActionType {
  paginationInfo: ComputedRef<boolean | PaginationProps>;
  setPagination: (info: Partial<PaginationProps>) => void;
  setLoading: (loading: boolean) => void;
}
export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  { paginationInfo, setPagination, setLoading }: ActionType,
  emit: EmitType,
) {
  const dataSourceRef = ref<Recordable[]>([]);

  watchEffect(() => {
    const { dataSource, api } = unref(propsRef);
    !api && dataSource && (dataSourceRef.value = dataSource);
  });
  // 设置行 key
  function setTableKey(originitems: any[]) {
    const items = cloneDeep(originitems);
    if (!items || !Array.isArray(items)) return;
    items.forEach(item => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID();
      }
      if (item.children && item.children.length) {
        item.children = setTableKey(item.children);
      }
    });
    return items;
  }
  // 是否自动生成key
  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });
  // 获取table 行 rowKey 值
  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });
  // 获取数据源
  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return [];
    }
    if (unref(getAutoCreateKey)) {
      dataSourceRef.value = setTableKey(unref(dataSourceRef));
    }
    return unref(dataSourceRef);
  });
  // 获取异步数据
  async function fetch(opt?: FetchParams) {
    const { api, searchInfo, fetchSetting, beforeFetch, afterFetch } = unref(
      propsRef,
    );
    if (!api || !isFunction(api)) return;
    try {
      setLoading(true);
      const { pageField, sizeField, listField, totalField } =Object.assign(FETCH_SETTING, fetchSetting?fetchSetting:{});
      let pageParams: Recordable = {};

      const { current = 1, pageSize = PAGE_SIZE } = unref(paginationInfo) as PaginationProps;

      if (isBoolean(paginationInfo)) {
        pageParams = {};
      } else {
        pageParams[pageField] = (opt && opt.page) || current;
        pageParams[sizeField] = pageSize;
      }

      let params: Recordable = {
        ...pageParams,
        ...searchInfo,
        ...(opt ? opt.searchInfo : {}),
        ...(opt ? opt.sortInfo : {}),
        ...(opt ? opt.filterInfo : {}),
      };
      if (beforeFetch && isFunction(beforeFetch)) {
        params = beforeFetch(params) || params;
      }

      const res = await api(params);

      const isArrayResult = Array.isArray(res);

      let resultItems: Recordable[] = isArrayResult ? res : get(res, listField);
      const resultTotal: number = isArrayResult ? 0 : get(res, totalField);

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      const currentTotalPage = Math.ceil(resultTotal / pageSize);
      if (current > currentTotalPage) {
        setPagination({
          current: currentTotalPage,
        });
        fetch(opt);
      }

      if (afterFetch && isFunction(afterFetch)) {
        resultItems = afterFetch(resultItems) || resultItems;
      }
      dataSourceRef.value = resultItems;
      setPagination({
        total: resultTotal || 0,
      });
      if (opt && opt.page) {
        setPagination({
          current: opt.page || 1,
        });
      }
      emit('fetch-success', {
        items: unref(resultItems),
        total: resultTotal,
      });
    } catch (error) {
      emit('fetch-error', error);
      dataSourceRef.value = [];
      setPagination({
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  function setTableData<T = Recordable>(values: T[]) {
    dataSourceRef.value = values;
  }

  function getDataSource<T = Recordable>() {
    return getDataSourceRef.value as T[];
  }

  async function reload(opt?: FetchParams) {
    await fetch(opt);
  }

  onMounted(() => {
    useTimeout(() => {
      unref(propsRef).immediate && fetch();
    }, 0);
  });

  return {
    getDataSourceRef,
    getDataSource,
    getRowKey,
    setTableData,
    getAutoCreateKey,
    fetch,
    reload,
  };
}
