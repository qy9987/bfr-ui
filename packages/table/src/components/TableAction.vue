<template>
  <div :class="[prefixCls, getAlign]">
    <template v-for="(action, index) in getActions" :key="`${index}`">
      <PopConfirmButton v-bind="action">
        <i v-if="action.icon" :icon="action.icon" class="mr-1" />
        {{ action.label }}
      </PopConfirmButton>
      <Divider v-if="divider && index < getActions.length" type="vertical" />
    </template>

    <Dropdown :trigger="['hover']" :drop-menu-list="getDropList">
      <slot name="more" />
      <a-button v-if="!$slots.more" type="link" size="small">
        <MoreOutlined class="icon-more" />
      </a-button>
    </Dropdown>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ActionItem } from '@bfr-ui/table';
import { PopConfirmButton } from '@bfr-ui/button';
import { Divider } from 'ant-design-vue';
import Dropdown from '@bfr-ui/dropdown';
import { MoreOutlined } from '@ant-design/icons-vue';
import { propTypes } from '@bfr-ui/utils/propTypes';
import { useTableContext } from '../hooks/useTableContext';
import { ACTION_COLUMN_FLAG } from '../const';
export default defineComponent({
  name: 'TableAction',
  components: {  PopConfirmButton, Divider, Dropdown, MoreOutlined },
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    dropDownActions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    divider: propTypes.bool.def(true),
  },
  setup(props) {
    const prefixCls ='bfr-table-action';
    const table = useTableContext();
    const getActions = computed(() => {
      return props.actions.map(action => {
        const { popConfirm } = action;
        return {
          type: 'link',
          size: 'small',
          ...action,
          ...(popConfirm || {}),
          onConfirm: popConfirm?.confirm,
          onCancel: popConfirm?.cancel,
          enable: !!popConfirm,
        };
      });
    });

    const getDropList = computed(() => {
      return props.dropDownActions.map((action, index) => {
        const { label } = action;
        return {
          ...action,
          text: label,
          divider: index < props.dropDownActions.length - 1 ? props.divider : false,
        };
      });
    });

    const getAlign = computed(() => {
      const columns = table.getColumns();
      const actionColumn = columns.find(item => item.flag === ACTION_COLUMN_FLAG);
      return actionColumn?.align ?? 'left';
    });

    return { prefixCls, getActions, getDropList, getAlign };
  },
});
</script>
<style lang="less">
  @prefix-cls: ~'bfr-bfr-table-action';

  .@{prefix-cls} {
    display: flex;
    align-items: center;

    &.left {
      justify-content: flex-start;
    }

    &.center {
      justify-content: center;
    }

    &.right {
      justify-content: flex-end;
    }

    button {
      display: flex;
      align-items: center;

      span {
        margin-left: 0 !important;
      }
    }

    .ant-divider,
    .ant-divider-vertical {
      margin: 0 2px;
    }

    .icon-more {
      transform: rotate(90deg);

      svg {
        font-size: 1.1em;
        font-weight: 700;
      }
    }
  }
</style>
