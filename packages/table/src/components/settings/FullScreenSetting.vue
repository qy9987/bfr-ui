<template>
  <Tooltip placement="top">
    <template #title>
      <span>全屏</span>
    </template>
    <FullscreenOutlined v-if="!isFullscreenRef" @click="handleFullScreen" />
    <FullscreenExitOutlined v-else @click="handleFullScreen" />
  </Tooltip>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useTableContext } from '../../hooks/useTableContext';
import { Tooltip } from 'ant-design-vue';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';
import { useFullscreen } from '@bfr-ui/hooks/web/useFullScreen';

export default defineComponent({
  name: 'FullScreenSetting',
  components: {
    FullscreenExitOutlined,
    FullscreenOutlined,
    Tooltip,
  },

  setup() {
    const table = useTableContext();

    const { toggleFullscreen, isFullscreenRef } = useFullscreen(table.wrapRef);

    function handleFullScreen() {
      toggleFullscreen();
    }

    return {
      handleFullScreen,
      isFullscreenRef,
    };
  },
});
</script>
