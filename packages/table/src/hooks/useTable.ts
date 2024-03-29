import type { BasicTableProps, TableActionType, FetchParams, BasicColumn } from '../types/table';
import type { PaginationProps } from '../types/pagination';

import { ref, onUnmounted, unref } from 'vue';
import { isInSetup } from '@bfr-ui/utils/vue';

const isProdMode = () => process.env.NODE_ENV==='production';

export function useTable(
  tableProps?: Partial<BasicTableProps>,
): [(instance: TableActionType) => void, TableActionType] {
  isInSetup();

  const tableRef = ref<Nullable<TableActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  function register(instance: TableActionType) {
    isProdMode() &&
      onUnmounted(() => {
        tableRef.value = null;
        loadedRef.value = null;
      });

    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) {
      return;
    }
    tableRef.value = instance;
    tableProps && instance.setProps(tableProps);
    loadedRef.value = true;
  }

  function getTableInstance(): TableActionType {
    const table = unref(tableRef);
    if (!table) {
      throw new Error('table is undefined!');
    }
    return table;
  }

  const methods: TableActionType = {
    reload: (opt?: FetchParams) => {
      getTableInstance().reload(opt);
    },
    setProps: (props: Partial<BasicTableProps>) => {
      getTableInstance().setProps(props);
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading);
    },
    getDataSource: () => {
      return getTableInstance().getDataSource();
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
      const columns = getTableInstance().getColumns({ ignoreIndex }) || [];

      return columns;
    },
    setColumns: (columns: BasicColumn[]) => {
      getTableInstance().setColumns(columns);
    },
    setTableData: (values: any[]) => {
      return getTableInstance().setTableData(values);
    },
    setPagination: (info: Partial<PaginationProps>) => {
      return getTableInstance().setPagination(info);
    },
    deleteSelectRowByKey: (key: string) => {
      getTableInstance().deleteSelectRowByKey(key);
    },
    getSelectRowKeys: () => {
      return getTableInstance().getSelectRowKeys();
    },
    getSelectRows: () => {
      return getTableInstance().getSelectRows();
    },
    clearSelectedRowKeys: () => {
      getTableInstance().clearSelectedRowKeys();
    },
    setSelectedRowKeys: (keys: string[] | number[]) => {
      getTableInstance().setSelectedRowKeys(keys);
    },
    getPagination: () => {
      return getTableInstance().getPagination();
    },
    getSize: () => {
      return getTableInstance().getSize();
    },
  } as TableActionType;

  return [register, methods];
}
