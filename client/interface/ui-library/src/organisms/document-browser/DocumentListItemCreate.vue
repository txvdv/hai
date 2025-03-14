<script setup lang="ts">
import PrimeButton from 'primevue/button';
import { computed } from 'vue';

const props = defineProps<{
  isFirst: boolean;
}>();

const emit = defineEmits<{
  (e: 'create-doc'): void;
}>();

const createText = computed<string>(() => {
  return props.isFirst
    ? 'Create your first document'
    : 'Create another document';
});

const createNewDoc = () => {
  emit('create-doc');
};
</script>

<template>
  <div class="document__create">
    <PrimeButton
      @click="createNewDoc"
      :label="createText"
      size="small"
      variant="link"
    />
  </div>
</template>

<style>
@reference '../../styles/style.css';

.document__create {
  @apply border-b-1 border-gray-200;
}
</style>
