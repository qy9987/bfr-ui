<template>
  <div v-if="imgList && imgList.length" :class="prefixCls">
    <PreviewGroup>
      <template v-for="img in imgList" :key="img">
        <Image :width="size" :src="img" />
      </template>
    </PreviewGroup>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Image } from 'ant-design-vue';

export default defineComponent({
  name: 'TableImage',
  components: { Image, PreviewGroup: Image.PreviewGroup },
  props: {
    imgList: {
      type: Array as PropType<string[]>,
      default: null,
    },
    size: {
      type: Number as PropType<number>,
      default: 40,
    },
  },
  setup() {
    const prefixCls = 'bfr-table-img';
    return { prefixCls };
  },
});
</script>
