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
let isUserInteraction = false; // Track whether changes came from the user or props

// Watch the `modelValue` prop and synchronize its initial value
watch(
  () => props.modelValue,
  (newValue) => {
    isUserInteraction = false; // Reset flag on external (prop-based) changes
    value.value = newValue; // Synchronize prop to internal value
  },
  { immediate: true } // Sync when component is initialized
);

// Use the reusable debounce composable
useDebounce(value, props.debounce, (debouncedValue: string) => {
  if (isUserInteraction) {
    // Emit user changes only
    console.log(`Debounced value changed to '${debouncedValue}'`);
    emit('update:modelValue', debouncedValue);
  }
});

// Detect when user changes the input
watch(value, (newValue, oldValue) => {
  if (value.value !== props.modelValue) {
    // Only set this for user-triggered changes
    isUserInteraction = true;
  }
});
</script>

<template>
  <PvTextarea v-model="value" variant="filled" rows="5" cols="50" />
</template>

<style>
@reference '../../styles/style.css';
</style>
