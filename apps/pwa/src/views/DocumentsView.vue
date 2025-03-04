<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {DocumentService} from '@hai/document-service';

const documentService = new DocumentService();
const documents = ref();
const document = ref({
  id: '',
  content: ''
});

async function getDocuments() {
  const docs = await documentService.getDocuments()
  documents.value = [...docs]
}

async function deleteDocument(id: string) {
  await documentService.deleteDocument(id)
  await getDocuments()
}

async function editDocument(id: string) {
  const doc = await documentService.getDocument(id)
  if (doc) {
    document.value = doc;
  }
}

function startDocument() {
  document.value = {id: '', content: ''}
}

async function saveDocument() {
  if (document.value.id) {
    await documentService.updateDocument(document.value.id, document.value.content)
  } else {
    await documentService.createDocument(document.value.content)
  }
  await getDocuments()
}

onMounted(async () => {
  await getDocuments()
});

</script>

<template>
  <div class="documents">
    <h1>Documents</h1>

    <button @click="startDocument">
      Start document
    </button>
    <hr>
    <div>
      <div v-for="doc in documents" :key="doc.id">
        <div @click="editDocument(doc.id)" style="cursor: pointer;">{{doc.content}}</div>
        <div>
          <span @click="editDocument(doc.id)" style="cursor: pointer;">edit</span> |
          <span @click="deleteDocument(doc.id)" style="cursor: pointer;">delete</span>
        </div>
      </div>
    </div>
    <hr>
    <textarea v-model="document.content"></textarea>
    <br>
    <button @click="saveDocument">
      Save
    </button>
  </div>
</template>

<style>
@media (min-width: 768px) {
  .documents {
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 1rem;
  }
}
</style>
