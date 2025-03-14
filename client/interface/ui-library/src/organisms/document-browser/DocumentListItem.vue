<script setup lang="ts">
import PrimeButton from 'primevue/button';
import type { DocumentListItem } from './DocumentBrowser.state';

interface DocumentListItemProps {
  document: DocumentListItem;
}

interface DocumentListItemEvents {
  (e: 'view-doc', id: string): void;
}

const props = defineProps<DocumentListItemProps>();
const emit = defineEmits<DocumentListItemEvents>();

const viewDoc = () => {
  emit('view-doc', props.document.id);
};
</script>

<template>
  <div class="document">
    <p class="document__content">{{ document.content }}</p>
    <div class="document__actions">
      <PrimeButton @click="viewDoc" label="View" size="small" variant="link" />
    </div>
  </div>
</template>

<style>
@reference '../../styles/style.css';
</style>
