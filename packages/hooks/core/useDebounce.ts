import { debounce, DebouncedFunc } from 'lodash';
export interface DebounceOptions {
  // 指定调用在节流开始前
  leading?: boolean;
  // 指定调用在节流结束后
  trailing?: boolean;
  // 只执行一次
  once?: boolean;
}
export type DebounceResult = [DebouncedFunc<(this: unknown, ...args: any) => void>, ()=>void];
/**
 *
 * @param handle
 * @param wait
 * @param options
 */
export function useDebounce(
  handle: (this: unknown, ...args: any) => any,
  wait: number,
  options: DebounceOptions = { trailing: true, leading: false },
):DebounceResult {
  const { once, leading, trailing } = options;
  let canceled = false;
  function throttleFn(this: unknown, ...args: any) {
    if (canceled) {
      return;
    }
    if (once) {
      canceled = true;
    }
    handle.apply(this, args);
  }
  const fn = debounce(throttleFn, wait, { leading, trailing });
  function cancel() {
    canceled = true;
    fn.cancel();
  }
  return [fn, cancel];
}
