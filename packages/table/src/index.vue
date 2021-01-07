<template>
  <div
    ref="wrapRef"
    :class="[
      prefixCls,
      {
        [`${prefixCls}-form-container`]: getBindValues.useSearchForm,
        [`${prefixCls}--inset`]: getBindValues.inset,
        'bfr-table__noscroll': noScroll
      },
    ]"
  >
    <Table
      v-show="getEmptyDataIsShowTable"
      ref="tableElRef"
      v-bind="getBindValues"
      :row-class-name="getRowClassName"
      @change="handleTableChange"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data" />
      </template>
    </Table>
  </div>
</template>
<script lang="ts">
import type { BasicTableProps, TableActionType, SizeType, SorterResult } from './types/table';
import { PaginationProps } from './types/pagination';

import { defineComponent, ref, computed, unref, getCurrentInstance } from 'vue';
import { Table } from 'ant-design-vue';

import { isFunction } from '@bfr-ui/utils/is';

import { omit } from 'lodash-es';

import { usePagination } from './hooks/usePagination';
import { useColumns } from './hooks/useColumns';
import { useDataSource } from './hooks/useDataSource';
import { useLoading } from './hooks/useLoading';
import { useRowSelection } from './hooks/useRowSelection';
import { useTableScroll } from './hooks/useTableScroll';
import { useCustomRow } from './hooks/useCustomRow';
import { useTableStyle } from './hooks/useTableStyle';
import { useTableHeader } from './hooks/useTableHeader';
import { createTableContext } from './hooks/useTableContext';
import { useTableFooter } from './hooks/useTableFooter';

import { basicProps } from './props';

export default defineComponent({
  name: 'BfrTable',
  components: { Table /*BasicForm*/ },
  props: basicProps,
  emits: [
    'fetch-success',
    'fetch-error',
    'selection-change',
    // 'register',
    'row-click',
    'row-dbClick',
    'row-contextmenu',
    'row-mouseenter',
    'row-mouseleave',
  ],
  setup(props, { attrs, emit, slots }) {

    const prefixCls = 'bfr-table';
    // 设置tableRef
    const tableElRef = ref<ComponentRef>(null);
    const wrapRef = ref<Nullable<HTMLDivElement>>(null);
    // 获取初始props
    const innerPropsRef = ref<Partial<BasicTableProps>>();

    // const [registerForm, formActions] = useForm();
    // 真实props
    const realProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
    });
    const { getLoading, setLoading } = useLoading(realProps);
    // pagination hook
    const { paginationInfo, getPagination, setPagination } = usePagination(realProps);
    // column hook
    const {
      getSortFixedColumns,
      getColumns,
      setColumns,
      getColumnsRef,
      getCacheColumns,
    } = useColumns(realProps, paginationInfo);
    // data-source hook
    const {
      getDataSourceRef,
      getDataSource,
      setTableData,
      fetch,
      getRowKey,
      reload,
      getAutoCreateKey,
    } = useDataSource(
      realProps,
      {
        paginationInfo,
        setLoading,
        setPagination,
        getFieldsValue:() =>({}), //formActions.getFieldsValue,
      },
      emit,
    );
    // 行选择 hook
    const {
      getRowSelection,
      getRowSelectionRef,
      getSelectRows,
      clearSelectedRowKeys,
      getSelectRowKeys,
      deleteSelectRowByKey,
      setSelectedRowKeys,
    } = useRowSelection(realProps, emit);
    // 表格滚动hook
    const { getScrollRef } = useTableScroll(
      realProps,
      getColumnsRef,
      getRowSelectionRef,
    );
    // 判断是否需要显示滚动条
    const noScroll = computed(()=>{
      return !getScrollRef.value.y;
    });
    // 自定义行hook
    const { customRow } = useCustomRow(realProps, {
      setSelectedRowKeys,
      getSelectRowKeys,
      clearSelectedRowKeys,
      getAutoCreateKey,
      emit,
    });
    // 表格样式 hook
    const { getRowClassName } = useTableStyle(realProps, prefixCls);
    // 表头 hook
    const { getHeaderProps } = useTableHeader(realProps, slots);
    // 表底 hook
    const { getFooterProps } = useTableFooter(
      realProps,
      getScrollRef,
      tableElRef,
      getDataSourceRef,
    );

    // ant 表格绑定 attrs
    const getBindValues = computed(() => {
      let propsData: Recordable = {
        size: 'middle',
        ...attrs,
        customRow,
        ...unref(realProps),
        ...unref(getHeaderProps),
        scroll: unref(getScrollRef),
        loading: unref(getLoading),
        tableLayout: 'fixed',
        rowSelection: unref(getRowSelectionRef),
        rowKey: unref(getRowKey),
        columns: unref(getSortFixedColumns),
        pagination: unref(paginationInfo),
        dataSource: unref(getDataSourceRef),
        footer: unref(getFooterProps),
      };
      if (slots.expandedRowRender) {
        propsData = omit(propsData, 'scroll');
      }
      return propsData;
    });
    // 空数据时展示表格
    const getEmptyDataIsShowTable = computed(() => {
      const { emptyDataIsShowTable, useSearchForm } = unref(realProps);
      if (emptyDataIsShowTable || !useSearchForm) {
        return true;
      }
      return !!unref(getDataSourceRef).length;
    });
    // 表格数据change时触发事件
    function handleTableChange(
      pagination: PaginationProps,
      filters: Partial<Recordable<string[]>>,
      sorter: SorterResult,
    ) {
      const { clearSelectOnPageChange, sortFn } = unref(realProps);
      if (clearSelectOnPageChange) {
        clearSelectedRowKeys();
      }
      setPagination(pagination);

      if (sorter && isFunction(sortFn)) {
        const sortInfo = sortFn(sorter);
        fetch({ sortInfo });
        return;
      }
      fetch();
    }

    function setProps(props: Partial<BasicTableProps>) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }

    const tableAction: TableActionType = {
      reload,
      getSelectRows,
      clearSelectedRowKeys,
      getSelectRowKeys,
      deleteSelectRowByKey,
      setPagination,
      setTableData,
      setSelectedRowKeys,
      setColumns,
      setLoading,
      getDataSource,
      setProps,
      getRowSelection,
      getPagination,
      getColumns,
      getCacheColumns,
      getSize: () => {
        return unref(getBindValues).size as SizeType;
      },
    };
    createTableContext({ ...tableAction, wrapRef, getBindValues });
    const instance = getCurrentInstance();
    if (instance) {
      Object.assign(instance.proxy, tableAction);
    }

    // emit('register', tableAction);

    return {
      paginationInfo,
      noScroll,
      tableElRef,
      getBindValues,
      getLoading,
      getEmptyDataIsShowTable,
      handleTableChange,
      getRowClassName,
      wrapRef,
      tableAction,
      prefixCls,
    };
  },
});
</script>
