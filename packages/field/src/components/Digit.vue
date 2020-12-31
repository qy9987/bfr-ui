<template>
  <span>{{ digit }}</span>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    text: Number,
  },
  setup(props) {
    // setup(props,context)
    const digit =  new Intl.NumberFormat().format(Number(props.text) as number);
    return {
      digit,
    };
  },
});
</script>
