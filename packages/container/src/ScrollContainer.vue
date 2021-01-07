<template>
  <Scrollbar
    ref="scrollbarRef"
    class="scroll-container"
    v-bind="$attrs"
  >
    <slot />
  </Scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, unref, nextTick } from 'vue';
import Scrollbar, { ScrollbarType } from '@bfr-ui/scrollbar';

import { useScrollTo } from '@bfr-ui/hooks/event/useScrollTo';

export default defineComponent({
  name: 'BfrScrollContainer',
  components: { Scrollbar },
  setup() {
    const scrollbarRef = ref<Nullable<ScrollbarType>>(null);

    function scrollTo(to: number, duration = 500) {
      const scrollbar = unref(scrollbarRef);
      if (!scrollbar) return;

      nextTick(() => {
        const wrap = unref(scrollbar.wrap);
        if (!wrap) return;
        const { start } = useScrollTo({
          el: wrap,
          to,
          duration,
        });
        start();
      });
    }

    function getScrollWrap() {
      const scrollbar = unref(scrollbarRef);
      if (!scrollbar) return null;
      return scrollbar.wrap;
    }

    function scrollBottom() {
      const scrollbar = unref(scrollbarRef);
      if (!scrollbar) return;

      nextTick(() => {
        const wrap = unref(scrollbar.wrap);
        if (!wrap) return;
        const scrollHeight = wrap.scrollHeight as number;
        const { start } = useScrollTo({
          el: wrap,
          to: scrollHeight,
        });
        start();
      });
    }

    return {
      scrollbarRef,
      scrollTo,
      scrollBottom,
      getScrollWrap,
    };
  },
});
</script>
