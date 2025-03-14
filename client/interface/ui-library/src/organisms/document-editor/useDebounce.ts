import { onBeforeUnmount, Ref, ref, watch } from 'vue';

export function useDebounce(
  valueRef: Ref<string>,
  delay: number,
  callback: (debouncedValue: string) => void
) {
  const timeout = ref<ReturnType<typeof setTimeout> | null>(null);

  watch(valueRef, (newValue) => {
    // If there's a pending debounce timeout, clear it
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
    // Set a new debounce timeout
    timeout.value = setTimeout(() => {
      callback(newValue);
    }, delay);
  });

  onBeforeUnmount(() => {
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
  });
}
