import { defineAsyncComponent } from 'vue';
import { Spin } from 'ant-design-vue';

interface Options {
  size?: 'default' | 'small' | 'large';
  delay?: number;
  timeout?: number;
  loading?: boolean;
  retry?: boolean;
}

export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const { size = 'small', delay = 100, timeout = 30000, loading = false, retry = true } = options;
  return defineAsyncComponent({
    loader,
    // <Spin spinning={true} size={size} />
    loadingComponent: loading ? Spin : undefined,
    timeout,
    delay,
    onError: !retry
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      ? ()=>{}
      : (error, retry, fail, attempts) => {
        if (error.message.match(/fetch/) && attempts <= 3) {
          // 重试三次
          retry();
        } else {
          fail();
        }
      },
  });
}
