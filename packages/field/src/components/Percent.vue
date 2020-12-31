<template>
  <span>{{ text }} %</span>
</template>
<script lang="ts">
import { defineComponent,PropType  } from 'vue';
export default defineComponent({
  props: {
    text: [Number, String] as PropType<string|number>,
  },
});
</script>
