<script setup lang="ts">
import { ref, watch } from 'vue';
import PvTextarea from 'primevue/textarea';
import { useDebounce } from './useDebounce';

interface DocumentEditorProps {
  modelValue: string;
  debounce?: number;
}

interface DocumentEditorEvents {
  (e: 'update:modelValue', value: string): void;
}

// Define props and emits
const props = withDefaults(defineProps<DocumentEditorProps>(), {
  modelValue: '',
  debounce: 3000,
});
const emit = defineEmits<DocumentEditorEvents>();

// State and helper variables
const value = ref('');

// Watch the `modelValue` prop and synchronize its initial value
watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue; // Update internal value when prop changes
  },
  { immediate: true } // Sync when component is initialized
);

// Use the reusable debounce composable
useDebounce(value, props.debounce, (debouncedValue: string) => {
  console.log(`Debounced value changed to '${debouncedValue}'`);
  emit('update:modelValue', debouncedValue); // Emit updated value after delay
});
</script>

<template>
  <div class="editor">
    <PvTextarea
      v-model="value"
      variant="filled"
      rows="5"
      cols="30"
      class="textarea-full-height"
    />
  </div>
</template>

<style>
@reference '../../styles/style.css';

.editor {
}

.textarea-full-height {
}
</style>
