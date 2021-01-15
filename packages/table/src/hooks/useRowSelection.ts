import type { BasicTableProps, TableRowSelection } from '../types/table';

import { computed, ref, unref, ComputedRef } from 'vue';


export function useRowSelection(propsRef: ComputedRef<BasicTableProps> , emit: EmitType) {
  const selectedRowKeysRef = ref<string[]>([]);
  const selectedRowRef = ref<Recordable[]>([]);

  const getRowSelectionRef = computed((): TableRowSelection | null => {
    const selectedRowKeys = unref(selectedRowKeysRef);
    const { rowSelection } = unref(propsRef);
    if (!rowSelection) {
      return null;
    }
    return {
      selectedRowKeys,
      hideDefaultSelections: false,
      ...rowSelection,
      onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
        rowSelection.onChange && rowSelection.onChange(selectedRowKeys, selectedRows);
        selectedRowKeysRef.value = selectedRowKeys;
        selectedRowRef.value = selectedRows;
        emit('selection-change', {
          keys: selectedRowKeys,
          rows: selectedRows,
        });
      },
    };
  });
  function setSelectedRowKeys(rowKeys: string[]) {
    selectedRowKeysRef.value = rowKeys;
    const { rowKey, dataSource } = unref(propsRef);
    const getRowKey = record => typeof rowKey === 'function' ? rowKey(record) : rowKey;
    selectedRowRef.value = dataSource.filter(i=>rowKeys.includes(i[getRowKey(i)]));
  }

  function clearSelectedRowKeys() {
    selectedRowRef.value = [];
    selectedRowKeysRef.value = [];
  }

  function deleteSelectRowByKey(key: string) {
    const selectedRowKeys = unref(selectedRowKeysRef);
    const index = selectedRowKeys.findIndex(item => item === key);
    if (index !== -1) {
      unref(selectedRowKeysRef).splice(index, 1);
    }
  }

  function getSelectRowKeys() {
    return unref(selectedRowKeysRef);
  }

  function getSelectRows<T = Recordable>() {
    return unref(selectedRowRef) as T[];
  }

  function getRowSelection() {
    return unref(getRowSelectionRef);
  }

  return {
    getRowSelection,
    getRowSelectionRef,
    getSelectRows,
    getSelectRowKeys,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    deleteSelectRowByKey,
  };
}
