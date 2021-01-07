<template>
  <Button v-bind="bindValue" @click="clickHandler">
    <slot />
  </Button>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';
import { Button } from 'ant-design-vue';
import { useLoading } from '@bfr-ui/hooks/component/useLoading';
import { propTypes } from '@bfr-ui/utils/propTypes';
export default defineComponent({
  name: 'BfrButton',
  components: {
    Button,
  },
  props: {
    loading: propTypes.bool.def(false),
  },
  emits:['click'],
  setup(props, { emit, attrs }) {
    // setup(props,context)
    const { loading, setLoading } = useLoading(props.loading);
    const start = () => {
      setLoading(true);
    };
    const done = () => {
      setLoading(false);
    };
    const clickHandler = e => {
      emit('click', e, { start, done });
    };
    const bindValue = computed(()=>{
      return { ...attrs, ...props, loading: unref(loading) };
    });
    return {
      bindValue,
      clickHandler,
    };
  },
});
</script>
