<!--suppress CssUnusedSymbol -->

<script setup lang="ts">
import { computed } from 'vue';
import Skeleton from 'primevue/skeleton';
import type { DocumentListItem as DocumentListItemType } from './DocumentBrowser.state';
import DocumentListItem from './DocumentListItem.vue';

const props = withDefaults(
  defineProps<{
    documents: DocumentListItemType[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  }
);

const emit = defineEmits<{
  (e: 'delete-doc', id: string): void;
  (e: 'edit-doc', id: string): void;
  (e: 'view-doc', id: string): void;
}>();

const isEmpty = computed(() => props.documents.length === 0);

const onDeleteDoc = (id: string) => {
  emit('delete-doc', id);
};

const onEditDoc = (id: string) => {
  emit('edit-doc', id);
};

const onViewDoc = (id: string) => {
  emit('view-doc', id);
};
</script>

<template>
  <div>
    <template v-if="loading">
      <Skeleton
        height="1rem"
        width="100px"
        style="margin-bottom: 4px"
      ></Skeleton>
      <Skeleton
        height="1rem"
        width="400px"
        style="margin-bottom: 8px"
      ></Skeleton>
      <Skeleton height="3rem" width="600px"></Skeleton>
    </template>
    <template v-else-if="isEmpty">
      <p>No documents</p>
      <p>Go create one</p>
    </template>
    <template v-else>
      <div class="document-list">
        <DocumentListItem
          v-for="document in documents"
          :key="document.id"
          :document="document"
          @delete-doc="onDeleteDoc"
          @edit-doc="onEditDoc"
          @view-doc="onViewDoc"
        />
      </div>
    </template>
  </div>
</template>

<style>
@reference '../../styles/style.css';

.document-list > .document:not(:last-child) {
  @apply border-b-1 border-gray-200;
}
</style>
