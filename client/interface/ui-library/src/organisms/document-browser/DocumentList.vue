<!--suppress CssUnusedSymbol -->

<script setup lang="ts">
import { computed } from 'vue';
import Skeleton from 'primevue/skeleton';
import type { DocumentListItem as DocumentListItemType } from './DocumentBrowser.state';
import DocumentListItem from './DocumentListItem.vue';
import PrimeButton from 'primevue/button';

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
  (e: 'new-doc'): void;
  (e: 'view-doc', id: string): void;
}>();

const isEmpty = computed(() => props.documents.length === 0);

const createDoc = () => {
  emit('new-doc');
};

const onViewDoc = (id: string) => {
  emit('view-doc', id);
};
</script>

<template>
  <div class="w-96">
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
      <PrimeButton
        @click="createDoc"
        label="Create your first doc"
        size="small"
        variant="link"
      />
    </template>
    <template v-else>
      <div class="document-list">
        <DocumentListItem
          v-for="document in documents"
          :key="document.id"
          :document="document"
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
