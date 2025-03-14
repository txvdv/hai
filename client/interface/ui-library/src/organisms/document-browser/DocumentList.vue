<!--suppress CssUnusedSymbol -->
<script setup lang="ts">
import type { DocumentListItem as DocumentListItemType } from './DocumentBrowser.state';
import DocumentListItem from './DocumentListItem.vue';

withDefaults(
  defineProps<{
    documents: DocumentListItemType[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  }
);

const emit = defineEmits<{
  (e: 'view-doc', id: string): void;
}>();

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
