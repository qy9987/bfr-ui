import { computed, ref, unref, watchEffect } from 'vue';

export function useLoading(value?: boolean) {
  const loadingRef = ref(value || false);
  watchEffect(() => {
    loadingRef.value = value||false;
  });
  const loading = computed(() => {
    return unref(loadingRef);
  });

  function setLoading(loading: boolean) {
    loadingRef.value = loading;
  }

  return { loading, setLoading };
}
