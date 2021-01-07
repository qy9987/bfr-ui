<template>
  <div class="bfr-scrollbar">
    <div
      ref="wrap"
      :class="[wrapClass, 'bfr-scrollbar__wrap',{'bfr-scrollbar__overflow-x': widthPercentage>=100,'bfr-scrollbar__overflow-y': heightPercentage>=100}]"
      :style="style"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        ref="resize"
        :class="['bfr-scrollbar__view', viewClass]"
        :style="viewStyle"
      >
        <slot />
      </component>
    </div>
  </div>
</template>
<script lang="ts">
import { toObject } from './util';
import { throttle } from 'lodash';
import {
  defineComponent,
  ref,
  provide,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from 'vue';
import { addResizeListener, removeResizeListener } from '@bfr-ui/utils/event/resizeEvent';

export default defineComponent({
  name: 'BfrScrollbar',
  props: {
    wrapStyle: {
      type: [String, Array],
      default: '',
    },
    wrapClass: {
      type: [String, Array],
      default: '',
    },
    viewClass: {
      type: [String, Array],
      default: '',
    },
    viewStyle: {
      type: [String, Array],
      default: '',
    },
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div',
    },
  },
  emits: ['scroll'],
  setup(props, { emit }) {
    const heightPercentage = ref(0);
    const widthPercentage = ref(0);
    const wrap = ref<any>(null);
    const resize = ref<any>(null);

    provide('scroll-bar-wrap', wrap);

    const handleScroll = throttle(() => {
      emit('scroll', { top: wrap.value.scrollTop, left: wrap.value.scrollTop });
    }, 300, { leading: false });
    const update = () => {
      console.log(1);
      if (!wrap.value) return;
      heightPercentage.value = (wrap.value.clientHeight * 100) / wrap.value.scrollHeight;
      widthPercentage.value = (wrap.value.clientWidth * 100) / wrap.value.scrollWidth;
    };

    onMounted(() => {
      nextTick(update);
      addResizeListener(resize.value, update);
    });

    onBeforeUnmount(() => {
      removeResizeListener(resize.value, update);
    });
    const style = computed(() => {
      let style: any = props.wrapStyle;
      if (Array.isArray(props.wrapStyle)) {
        style = toObject(props.wrapStyle);
      }
      return style;
    });
    const scrollToY = (y:number) => {
      if(!wrap.value) return;
      wrap.value.scrollTop = y;
    };
    return {
      heightPercentage,
      widthPercentage,
      style,
      wrap,
      resize,
      handleScroll,
      scrollToY,
    };
  },
});
</script>
