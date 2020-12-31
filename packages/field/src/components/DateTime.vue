<template>
  <span>{{ value }}</span>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, PropType } from 'vue';
import { formatter } from '@bfr-ui/utils/date';
import { ConfigType } from 'dayjs';
export default defineComponent({
  name: 'DateTimeFormatter',
  props: {
    format: {
      type: String,
      default: '',
    },
    text: {
      type: [String, Number, Date, Object] as PropType<ConfigType>,
      default: '',
    },
  },
  setup(props) {
    const { text, format = '' } = reactive(props);
    const value = ref('');
    value.value = text&&format?formatter(text, format): '-';
    return {
      value,
    };
  },
});
</script>
