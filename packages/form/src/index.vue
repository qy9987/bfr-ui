<template>
  <div class="bfr-form">
    <Form
      :ref="formRef"
      :model="formModelRef"
      v-bind="{...$attrs, ...$props}"
    >
      <FormItem
        v-for="schema in schemas"
        :key="schema.dataIndex"
        v-bind="schema"
      >
        <template
          v-for="slot in schema.slots"
          :key="slot"
          #[dynamicSlotName(slot)]="data"
        >
          <slot :name="dynamicSlotName(slot)" v-bind="data" />
        </template>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue';
import { Form } from 'ant-design-vue';
import FormItem from './components/FormItem.vue';
import { defaultFormProps } from './props';
import { setFormContext } from './hooks/useFormContext';
import { BasicFormMethods } from '@bfr-ui/form/src/types/form';
import { get, set } from 'lodash';
export default defineComponent({
  name: 'BfrForm',
  components: {
    Form,
    FormItem,
  },
  props: defaultFormProps,
  emits:['submit', 'validate', 'finish', 'finishFailed'],
  setup(props, { slots }) {
    const formModelRef = ref(props.model);
    const formRef = ref(null);
    const dynamicSlotName = slot =>slot in slots?slot:'_trash';
    const actions: BasicFormMethods = {
      validate:async nameList=> await formRef.value.validate(nameList),
      validateFields:async nameList=> await formRef.value.validateFields(nameList),
      scrollToField: (name, options)=> formRef.value.scrollToField(name, options),
      resetFields:()=> formRef.value.resetFields(),
      clearValidate:()=> formRef.value.clearValidate(),
    };
    const instance = getCurrentInstance();
    if (instance) {
      Object.assign(instance.proxy, actions);
    }
    const getModel = key => {
      return get(formModelRef.value,key);
    };
    const setModel = (key: string, value:any)=> {
      set(formModelRef.value, key, value);
    };
    setFormContext({ ...props, model: formModelRef, getModel, setModel });
    return {
      formModelRef,
      formRef,
      dynamicSlotName,
      actions,
    };
  },
});
</script>
