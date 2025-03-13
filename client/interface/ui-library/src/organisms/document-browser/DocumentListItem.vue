<script setup lang="ts">
import PrimeButton from 'primevue/button';
import type { DocumentListItem } from './DocumentBrowser.state';

const props = defineProps<{
  document: DocumentListItem;
}>();

const emit = defineEmits<{
  (e: 'view-doc', id: string): void;
}>();

const viewDoc = () => {
  emit('view-doc', props.document.id);
};
</script>

<template>
  <div class="document">
    <p class="document__content px-2">{{ document.content }}</p>
    <div class="document__actions">
      <PrimeButton @click="viewDoc" label="View" size="small" variant="link" />
    </div>
  </div>
</template>

<style>
@reference '../../styles/style.css';

.document__title {
  @apply text-xl font-bold;
}
</style>
