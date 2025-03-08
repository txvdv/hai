<script setup lang="ts">
import { ref } from 'vue';
import { DocumentService } from '../service/document-service';

// Create a reactive variable for documents
const docs = ref<Array<{ id: string, content: string }>>([]);

async function createDocument() {
  try {
    await DocumentService.createDocument();
    await getDocuments();
  } catch (error) {
    console.error('Error creating document:', error);
  }
}

async function deleteDocument(id: string) {
  try {
    await DocumentService.deleteDocument(id);
    await getDocuments();
  } catch (error) {
    console.error('Error creating document:', error);
  }
}

async function getDocuments() {
  try {
    docs.value = await DocumentService.getDocuments();
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

async function updateDocument(id: string, content: string) {
  try {
    await DocumentService.updateDocument(id, content + ' updated');
    await getDocuments();
  } catch (error) {
    console.error('Error creating document:', error);
  }
}
</script>

<template>
  <button
    @click="createDocument"
    class="mb-8 btn-link">
    Create document
  </button>

  <ul>
    <li v-for="doc in docs" :key="doc.id" class="mb-4">
      <div>{{ doc.content }}</div>
      <span @click="updateDocument(doc.id, doc.content)"
            class="btn-link">
        update
      </span> -
      <span @click="deleteDocument(doc.id)"
            class="btn-link">
        delete
      </span>
    </li>
  </ul>
</template>

<style>
@reference "tailwindcss";

.btn-link {
  @apply underline cursor-pointer select-none
}
</style>