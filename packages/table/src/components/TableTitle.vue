<template>
  <span v-if="title" class="bfr-table-title">
    {{ title }}
    <Tooltip
      v-if="helpMessage"
      class="bfr-table-title__help"
      placement="right"
      :title="helpMessage"
    >
      <InfoCircleOutlined />
    </Tooltip>
  </span>
</template>
<script lang="ts">
import {  defineComponent } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'BasicTableTitle',
  components: {
    Tooltip,
    InfoCircleOutlined,
  },
  props: {
    title: {
      type: String,
    },
    helpMessage: {
      type: String,
    },
  },
});
</script>
