<template>
  <Tooltip placement="top">
    <template #title>
      <span>列设置</span>
    </template>
    <Popover
      :get-popup-container="getPopupContainer"
      placement="bottomLeft"
      trigger="click"
      :overlay-class-name="`${prefixCls}__cloumn-list`"
      @visibleChange="handleVisibleChange"
    >
      <template #title>
        <div :class="`${prefixCls}__popover-title`">
          <Checkbox
            v-model:checked="checkAll"
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
          >
            列展示
          </Checkbox>

          <!-- <Checkbox v-model:checked="checkIndex" @change="handleIndexCheckChange">
            序号列
          </Checkbox> -->

          <a-button size="small" type="link" @click="reset">
            重置
          </a-button>
        </div>
      </template>

      <template #content>
        <ScrollContainer>
          <CheckboxGroup ref="columnListRef" v-model:value="checkedList" @change="onChange">
            <template v-for="item in plainOptions" :key="item.value">
              <div :class="`${prefixCls}__check-item`">
                <DragOutlined class="table-coulmn-drag-icon" />
                <Checkbox :value="item.value"> {{ item.label }} </Checkbox>
                <template v-if="showFixed">
                  <Tooltip placement="bottomLeft" :mouse-leave-delay="0.4">
                    <template #title> 固定到左侧</template>
                    <ArrowLeftOutlined
                      :class="[
                        `${prefixCls}__fixed-left`,
                        {
                          active: item.fixed === 'left',
                          disabled: !checkedList.includes(item.value),
                        },
                      ]"
                      @click="handleColumnFixed(item, 'left')"
                    />
                  </Tooltip>
                  <Divider type="vertical" />
                  <Tooltip placement="bottomLeft" :mouse-leave-delay="0.4">
                    <template #title>固定到右侧</template>
                    <ArrowRightOutlined
                      :class="[
                        `${prefixCls}__fixed-right`,
                        {
                          active: item.fixed === 'right',
                          disabled: !checkedList.includes(item.value),
                        },
                      ]"
                      @click="handleColumnFixed(item, 'right')"
                    />
                  </Tooltip>
                </template>
              </div>
            </template>
          </CheckboxGroup>
        </ScrollContainer>
      </template>
      <SettingOutlined />
    </Popover>
  </Tooltip>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  watchEffect,
  nextTick,
  unref,
  computed,
} from 'vue';
import { Tooltip, Popover, Checkbox, Divider } from 'ant-design-vue';
import { SettingOutlined, DragOutlined,ArrowLeftOutlined, ArrowRightOutlined  } from '@ant-design/icons-vue';
import { ScrollContainer } from '@bfr-ui/container';

import { useTableContext } from '../../hooks/useTableContext';
import { useSortable } from '@bfr-ui/hooks/web/useSortable';

import { isNullAndUnDef } from '@bfr-ui/utils/is';
import { getPopupContainer } from '@bfr-ui/utils';

import type { BasicColumn, BasicTableProps } from '../../types/table';
import { propTypes } from '@bfr-ui/utils/propTypes';

  interface State {
    indeterminate: boolean;
    checkAll: boolean;
    checkedList: string[];
    defaultCheckList: string[];
  }

  interface Options {
    label: string;
    value: string;
    fixed?: boolean | 'left' | 'right';
  }
interface ChangeEvent extends Event {
  target: HTMLInputElement;
}
export default defineComponent({
  name: 'ColumnSetting',
  components: {
    SettingOutlined,
    Popover,
    Tooltip,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    DragOutlined,
    ScrollContainer,
    Divider,
    ArrowLeftOutlined,
    ArrowRightOutlined,
  },
  props: {
    showFixed: propTypes.bool.def(false),
  },
  setup() {
    const table = useTableContext();

    let inited = false;

    const cachePlainOptions = ref<Options[]>([]);
    const plainOptions = ref<Options[]>([]);

    const plainSortOptions = ref<Options[]>([]);

    const columnListRef = ref<ComponentRef>(null);
    const state = reactive<State>({
      indeterminate: false,
      checkAll: true,
      checkedList: [],
      defaultCheckList: [],
    });

    const checkIndex = ref(false);

    const prefixCls = 'bfr-column-setting';

    const getValues = computed(() => {
      return unref(table?.getBindValues) || {};
    });

    watchEffect(() => {
      const columns = table.getColumns();
      if (columns.length) {
        init();
      }
    });


    watchEffect(() => {
      const values = unref(getValues) as BasicTableProps<any>;
      checkIndex.value = !!values.showIndexColumn;
    });

    function getColumns() {
      const ret: Options[] = [];
      table.getColumns().forEach(item => {
        ret.push({
          label: item.title as string,
          value: (item.dataIndex || item.title) as string,
          ...item,
        });
      });
      return ret;
    }
    function getCacheColumns() {
      const ret: Options[] = [];
      table.getCacheColumns().forEach(item => {
        ret.push({
          label: item.title as string,
          value: (item.dataIndex || item.title) as string,
          ...item,
        });
      });
      return ret;
    }

    function init() {
      const columns = getCacheColumns();
      const checkList = table
        .getColumns()
        .map(item => {
          if (item.defaultHidden) {
            return '';
          }
          return item.dataIndex || item.title;
        })
        .filter(Boolean) as string[];

      if (!plainOptions.value.length) {
        plainOptions.value = columns;
        plainSortOptions.value = columns;
        cachePlainOptions.value = columns;
        state.defaultCheckList = checkList;
      } else {
        const unrefOpt = unref(plainOptions);
        columns.forEach((item: BasicColumn) => {
          const findItem = unrefOpt.find((col: BasicColumn) => col.dataIndex === item.dataIndex);
          if (findItem) {
            item.fixed = findItem.fixed;
          }
        });
        plainOptions.value = columns;
        // unref(plainOptions).forEach((item: BasicColumn) => {
        //   const findItem = columns.find((col: BasicColumn) => col.dataIndex === item.dataIndex);
        //   if (findItem) {
        //     item.fixed = findItem.fixed;
        //   }
        // });
      }

      state.checkedList = checkList;
    }

    // checkAll change
    function onCheckAllChange(e: ChangeEvent) {
      state.indeterminate = false;
      const checkList = plainOptions.value.map(item => item.value);
      if (e.target.checked) {
        state.checkedList = checkList;
        table.setColumns(checkList);
      } else {
        state.checkedList = [];
        table.setColumns([]);
      }
    }

    // Trigger when check/uncheck a column
    function onChange(checkedList: string[]) {
      const len = plainOptions.value.length;
      state.indeterminate = !!checkedList.length && checkedList.length < len;
      state.checkAll = checkedList.length === len;

      const sortList = unref(plainSortOptions).map(item => item.value);
      checkedList.sort((prev, next) => {
        return sortList.indexOf(prev) - sortList.indexOf(next);
      });
      table.setColumns(checkedList);
    }

    // reset columns
    function reset() {
      state.checkedList = [...state.defaultCheckList];
      state.checkAll = true;
      state.indeterminate = false;
      plainOptions.value = unref(cachePlainOptions);
      plainSortOptions.value = unref(cachePlainOptions);
      table.setColumns(table.getCacheColumns());
    }
    // Open the pop-up window for drag and drop initialization
    function handleVisibleChange() {
      if (inited) return;
      nextTick(() => {
        const columnListEl = unref(columnListRef);
        if (!columnListEl) return;
        const el = columnListEl.$el;
        if (!el) return;
        // Drag and drop sort
        const { initSortable } = useSortable(el, {
          handle: '.table-coulmn-drag-icon ',
          onEnd: evt => {
            const { oldIndex, newIndex } = evt;
            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
              return;
            }
            // Sort column
            const columns = getColumns();
            const [old] = columns.splice(oldIndex, 1);
            columns.splice(newIndex, 0, old);
            plainSortOptions.value = columns;
            plainOptions.value = columns;
            table.setColumns(columns);
          },
        });
        initSortable();
        inited = true;
      });
    }

    // Control whether the serial number column is displayed
    function handleIndexCheckChange(e: ChangeEvent) {
      table.setProps({
        showIndexColumn: e.target.checked,
      });
    }


    function handleColumnFixed(item: BasicColumn, fixed?: 'left' | 'right') {
      if (!state.checkedList.includes(item.dataIndex as string)) return;

      const columns = getColumns() as BasicColumn[];
      const isFixed = item.fixed === fixed ? false : fixed;
      const index = columns.findIndex(col => col.dataIndex === item.dataIndex);
      if (index !== -1) {
        columns[index].fixed = isFixed;
      }
      item.fixed = isFixed;
      if (isFixed && !item.width) {
        item.width = 100;
        if(index !== -1) {
          columns[index].width = 100;
        }
      }
      table.setColumns(columns);
    }

    return {
      ...toRefs(state),
      onCheckAllChange,
      onChange,
      plainOptions,
      reset,
      prefixCls,
      columnListRef,
      handleVisibleChange,
      checkIndex,
      handleIndexCheckChange,
      handleColumnFixed,
      getPopupContainer,
    };
  },
});
</script>
