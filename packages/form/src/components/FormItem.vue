<template>
  <a-form-item v-bind="formItemPropsRef">
    <template v-if="slots.help" #help>
      <slot :name="slots.help" />
    </template>
    <template v-if="slots.label" #label>
      <slot :name="slots.label" />
    </template>
    <template v-if="slots.extra" #extra>
      <slot :name="slots.extra" />
    </template>
    <template v-if="isCustom">
      <slot :name="slots.content" :model="modelRef" :setModel="setCustomModel" />
    </template>
    <template v-else>
      <component
        :is="`a-${component}`"
        v-bind="componentPropsRef"
        v-model:value="modelRef"
      />
    </template>
  </a-form-item>
</template>
<script lang="ts">
import { computed, defineComponent, ref, unref, watch } from 'vue';
import { useLabelWidth } from '../hooks/useLabelWidth';
import { customPropType } from '@bfr-ui/utils/propTypes';
import { propTypes } from '@bfr-ui/utils/propTypes';
import { AntFormItem, FormItemSlot } from '@bfr-ui/form/src/types/form';
import { useFormContext } from '@bfr-ui/form/src/hooks/useFormContext';
export default defineComponent({
  name: 'BfrFormItem',
  props: {
    itemProps: customPropType<AntFormItem>(propTypes.object.def({})),
    slots: customPropType<FormItemSlot>(propTypes.object.def({})), // help和extra slot的优先级低于itemProps设置的优先级，要是有help、extra的slot，不要填写itemProps的help和extra
    labelWidth: customPropType<string|number>(propTypes.string.def()),
    component: propTypes.string,
    dataIndex: propTypes.string,
    componentProps: customPropType<AntFormItem>(propTypes.object),
  },
  setup(props, { slots }) {
    const { setModel, getModel } = useFormContext();
    const modelRef = ref(getModel(props.dataIndex));
    const setCustomModel = val=>{
      setModel(props.dataIndex,val);
    };
    watch(modelRef, newval=>{
      setCustomModel(newval);
    });

    const isCustom = computed(()=>Boolean(props.slots.content));
    const { labelCol, wrapperCol } = unref(useLabelWidth(props.labelWidth, props.itemProps));
    const formItemPropsRef = computed(()=>{
      return {
        ...props.itemProps,
        label: props.slots.label&&slots[props.slots.label]?undefined:props.itemProps.label,
        labelCol,
        wrapperCol,
      };
    });
    const componentPropsRef = computed(()=>{
      return {
        ...props.componentProps,
      };
    });
    return {
      formItemPropsRef,
      isCustom,
      modelRef,
      componentPropsRef,
      setCustomModel,
    };
  },
});
</script>
