<template>
  <span v-if="title" class="bfr-table-title show-span">
    {{ title }}
    <BasicHelp v-if="helpMessage" class="bfr-table-title__help" :text="helpMessage" />
  </span>
</template>
<script lang="ts">
import {  defineComponent, PropType } from 'vue';
import { BasicHelp } from '@bfr-ui/basic';
export default defineComponent({
  name: 'BasicTableTitle',
  components: {
    BasicHelp,
  },
  props: {
    title: {
      type: String,
    },
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
  },
});
</script>
