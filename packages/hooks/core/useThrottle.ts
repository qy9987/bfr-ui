import { throttle } from 'lodash';
export interface ThrottleOptions {
  // 指定调用在节流开始前
  leading?: boolean;
  // 指定调用在节流结束后
  trailing?: boolean;
  // 只执行一次
  once?: boolean;
}
export type ThrottleResult = [(this: unknown, ...args: any) => void, () => void];

/**
 *
 * @param handle
 * @param wait
 * @param options
 */
export function useThrottle<T extends unknown[]>(
  handle: (...args: any) => any,
  wait: number,
  options: ThrottleOptions = { trailing: true, leading: false },
): ThrottleResult {
  const { once, leading, trailing } = options;
  let canceled = false;
  function throttleFn(this: unknown, ...args: T) {
    if (canceled) {
      return;
    }
    if (once) {
      canceled = true;
    }
    handle.apply(this, args);
  }

  const fn = throttle(throttleFn, wait, { leading, trailing });
  function cancel() {
    canceled = true;
    fn.cancel();
  }
  return [fn, cancel];
}
