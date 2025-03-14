<!--suppress CssUnusedSymbol -->

<script setup lang="ts">
import { computed } from 'vue';
import type { DocumentListItem as DocumentListItemType } from './DocumentBrowser.state';
import DocumentListItemCreate from './DocumentListItemCreate.vue';
import DocumentListItemLoading from './DocumentListItemLoading.vue';
import DocumentList from './DocumentList.vue';

interface DocumentBrowserProps {
  documents: DocumentListItemType[];
  loading?: boolean;
}

interface DocumentBrowserEvents {
  (e: 'new-doc'): void;
  (e: 'view-doc', id: string): void;
}

const props = withDefaults(defineProps<DocumentBrowserProps>(), {
  loading: false,
});
const emit = defineEmits<DocumentBrowserEvents>();

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
    <DocumentListItemCreate
      :is-first="isEmpty"
      @create-doc="createDoc"
      class="border-b-1 border-gray-200"
    />
    <template v-if="loading">
      <DocumentListItemLoading />
    </template>
    <template v-else>
      <DocumentList :documents="documents" @view-doc="onViewDoc" />
    </template>
  </div>
</template>

<style>
@reference '../../styles/style.css';
</style>
