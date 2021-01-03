<template>
  <div
    ref="wrapRef"
    :class="[
      prefixCls,
      {
        [`${prefixCls}-form-container`]: getBindValues.useSearchForm,
        [`${prefixCls}--inset`]: getBindValues.inset,
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
        <slot :name="item" v-bind="data"></slot>
      </template>
    </Table>
  </div>
</template>
<script lang="ts">
import type { BasicTableProps, TableActionType, SizeType, SorterResult } from './types/table';
import { PaginationProps } from './types/pagination';

import { defineComponent, ref, computed, unref } from 'vue';
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
// import { useExpose } from '/@/hooks/core/useExpose';

import './style/index.less';
export default defineComponent({
  components: { Table /*BasicForm*/ },
  props: basicProps,
  emits: [
    'fetch-success',
    'fetch-error',
    'selection-change',
    'register',
    'row-click',
    'row-dbClick',
    'row-contextmenu',
    'row-mouseenter',
    'row-mouseleave',
  ],
  setup(props, { attrs, emit, slots }) {
    const tableElRef = ref<ComponentRef>(null);

    const wrapRef = ref<Nullable<HTMLDivElement>>(null);
    const innerPropsRef = ref<Partial<BasicTableProps>>();

    const prefixCls = 'bfr-table';
    // const [registerForm, formActions] = useForm();

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
    });

    const { getLoading, setLoading } = useLoading(getProps);
    const { getPaginationInfo, getPagination, setPagination } = usePagination(getProps);
    const {
      getSortFixedColumns,
      getColumns,
      setColumns,
      getColumnsRef,
      getCacheColumns,
    } = useColumns(getProps, getPaginationInfo);

    const {
      getDataSourceRef,
      getDataSource,
      setTableData,
      fetch,
      getRowKey,
      reload,
      getAutoCreateKey,
    } = useDataSource(
      getProps,
      {
        getPaginationInfo,
        setLoading,
        setPagination,
        getFieldsValue:() =>({}), //formActions.getFieldsValue,
      },
      emit,
    );

    const {
      getRowSelection,
      getRowSelectionRef,
      getSelectRows,
      clearSelectedRowKeys,
      getSelectRowKeys,
      deleteSelectRowByKey,
      setSelectedRowKeys,
    } = useRowSelection(getProps, emit);

    const { getScrollRef } = useTableScroll(
      getProps,
      getColumnsRef,
      getRowSelectionRef,
    );

    const { customRow } = useCustomRow(getProps, {
      setSelectedRowKeys,
      getSelectRowKeys,
      clearSelectedRowKeys,
      getAutoCreateKey,
      emit,
    });

    const { getRowClassName } = useTableStyle(getProps, prefixCls);

    const { getHeaderProps } = useTableHeader(getProps, slots);

    const { getFooterProps } = useTableFooter(
      getProps,
      getScrollRef,
      tableElRef,
      getDataSourceRef,
    );


    const getBindValues = computed(() => {
      let propsData: Recordable = {
        size: 'middle',
        ...attrs,
        customRow,
        ...unref(getProps),
        ...unref(getHeaderProps),
        scroll: unref(getScrollRef),
        loading: unref(getLoading),
        tableLayout: 'fixed',
        rowSelection: unref(getRowSelectionRef),
        rowKey: unref(getRowKey),
        columns: unref(getSortFixedColumns),
        pagination: unref(getPaginationInfo),
        dataSource: unref(getDataSourceRef),
        footer: unref(getFooterProps),
      };
      if (slots.expandedRowRender) {
        propsData = omit(propsData, 'scroll');
      }
      return propsData;
    });

    const getEmptyDataIsShowTable = computed(() => {
      const { emptyDataIsShowTable, useSearchForm } = unref(getProps);
      if (emptyDataIsShowTable || !useSearchForm) {
        return true;
      }
      return !!unref(getDataSourceRef).length;
    });

    function handleTableChange(
      pagination: PaginationProps,
      filters: Partial<Recordable<string[]>>,
      sorter: SorterResult,
    ) {
      const { clearSelectOnPageChange, sortFn } = unref(getProps);
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
      getPaginationRef: getPagination,
      getColumns,
      getCacheColumns,
      getSize: () => {
        return unref(getBindValues).size as SizeType;
      },
    };
    createTableContext({ ...tableAction, wrapRef, getBindValues });

    // useExpose<TableActionType>(tableAction);

    // emit('register', tableAction, formActions);

    return {
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
