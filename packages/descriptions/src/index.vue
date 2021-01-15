<template>
  <Descriptions
    :bordered="bordered"
    :colon="colon"
    :column="column"
    :extra="extra"
    :layout="layout"
    :size="size"
    :title="title"
  >
    <template #title><slot name="title" /></template>
    <template #extra><slot name="extra" /></template>
    <DescriptionsItem v-for="(item, index) in itemsRef" :key="`${item.dataIndex}${index}`" v-bind="item">
      <template #label>
        <slot v-if="item.slots&&item.slots.label" :name="item.slots.label" :index="index" />
      </template>
      <slot
        v-if="item.slots&&item.slots.default"
        :name="item.slots.default"
        :prop="item.dataIndex"
        :record="dataSource"
        :index="index"
      />
      <template v-else>
        {{ item.value }}
      </template>
    </DescriptionsItem>
  </Descriptions>
</template>

<script lang="ts">
import { computed, defineComponent, PropType,  VNode } from 'vue';
import { Descriptions } from 'ant-design-vue';
import { get } from 'lodash';
import { formatter } from '@bfr-ui/utils/date';
import { getPercent } from '@bfr-ui/utils';
import { DescriptionItem, ValueType } from './type';
export default defineComponent({
  name: 'BfrDescriptions',
  components: {
    Descriptions,
    DescriptionsItem: Descriptions.Item,
  },
  props: {
    dataSource: {
      type: Object as PropType<Recordable>,
      default: ()=>({}),
    },
    items: {
      type: Array as PropType<DescriptionItem[]>,
      default: ()=>[],
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    colon: {
      type: Boolean,
      default: true,
    },
    column: {
      type: [Number, Object] as PropType<number| Recordable>,
      default: 3,
    },
    extra: {
      type: [String, Object] as PropType<string|VNode>,
    },
    layout: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
    size: {
      type: String as PropType<'default' | 'middle' | 'small'>,
      default: 'default',
    },
    title: {
      type: [String, Object] as PropType<string|VNode>,
    },
  },
  setup(props) {
    // setup(props,context)
    const getValue = (path: string) =>{
      return get(props.dataSource, path);
    };
    const valueTypeFormat = ( item: DescriptionItem, value: any) => {
      const valueType: ValueType = item.valueType;
      if(valueType==='date') {
        return formatter(value, item.dateTemplate||'YYYY-MM-DD');
      } else if(valueType==='datetime') {
        console.log(formatter(value, item.dateTemplate||'YYYY-MM-DD HH:mm:ss'));
        return formatter(value, item.dateTemplate||'YYYY-MM-DD HH:mm:ss');
      }else if(valueType==='percent') {
        return getPercent(value, item.percentRelative);
      } else  {
        return value;
      }
    };
    const itemsRef = computed(()=>{
      const items = props.items;
      items.forEach((item, index)=> {
        if(!item.valueType) {
          item.valueType = 'default';
        }
        if(item.slots&&item.slots.label) {
          item.label = undefined;
        }
        const value = getValue(item.dataIndex);
        const formatter = item.formatter;
        item.value = formatter?formatter(props.dataSource, index):valueTypeFormat(item, value);
      });
      return items;
    });

    return {
      itemsRef,
    };
  },
});
</script>
