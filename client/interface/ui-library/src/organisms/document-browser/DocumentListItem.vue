<script setup lang="ts">
import AppButton from 'primevue/button';
import type { DocumentListItem } from './DocumentBrowser.state';

const props = defineProps<{
  document: DocumentListItem;
}>();

const emit = defineEmits<{
  (e: 'delete-doc', id: string): void;
  (e: 'edit-doc', id: string): void;
  (e: 'view-doc', id: string): void;
}>();

const deleteDoc = () => {
  emit('delete-doc', props.document.id);
};

const editDoc = () => {
  emit('edit-doc', props.document.id);
};

const viewDoc = () => {
  emit('view-doc', props.document.id);
};
</script>

<template>
  <div class="document">
    <h2 class="document__title px-2">{{ document.title }}</h2>
    <p class="document__content px-2">{{ document.content }}</p>
    <div class="document__actions">
      <AppButton @click="viewDoc" label="View" size="small" variant="link" />
      <AppButton @click="editDoc" label="Edit" size="small" variant="link" />
      <AppButton
        @click="deleteDoc"
        label="Delete"
        size="small"
        variant="link"
      />
    </div>
  </div>
</template>

<style>
@reference '../../styles/style.css';

.document__title {
  @apply text-xl font-bold;
}
</style>
