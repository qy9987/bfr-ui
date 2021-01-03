
import { isFunction } from '@bfr-ui/utils/is';
import { tryOnUnmounted } from '@bfr-ui/utils/vue';
import { ref, watch } from 'vue';
type TimeoutHandle = ReturnType<typeof setTimeout>;

export function useTimeout(handle: Fn<any>, wait: number) {
  if (!isFunction(handle)) {
    throw new Error('handle is not Function!');
  }
  const readyRef = ref(false);

  let timer: TimeoutHandle;
  function stop(): void {
    readyRef.value = false;
    timer && window.clearTimeout(timer);
  }
  function start(): void {
    stop();
    timer = setTimeout(() => {
      readyRef.value = true;
    }, wait);
  }

  start();

  tryOnUnmounted(stop);

  watch(
    readyRef,
    maturity => {
      maturity && handle();
    },
    { immediate: false },
  );
  return { readyRef, stop, start };
}
