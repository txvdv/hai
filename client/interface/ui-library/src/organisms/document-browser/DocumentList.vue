<!--suppress CssUnusedSymbol -->
<script setup lang="ts">
import type { ComposedDocument } from '@hai/service-web';
import DocumentListItem from './DocumentListItem.vue';

interface DocumentListProps {
  documents: ComposedDocument[];
}

interface DocumentListEvents {
  (e: 'view-doc', id: string): void;
}

defineProps<DocumentListProps>();
const emit = defineEmits<DocumentListEvents>();

const onViewDoc = (id: string) => {
  emit('view-doc', id);
};
</script>

<template>
  <div class="document-list">
    <DocumentListItem
      v-for="document in documents"
      :key="document.id"
      :document="document"
      @view-doc="onViewDoc"
    />
  </div>
</template>

<style>
@reference '../../styles/style.css';

.document-list > .document:not(:last-child) {
  @apply border-b-1 border-gray-200;
}
</style>
