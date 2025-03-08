<script setup lang="ts">
import { ref } from 'vue'
import { DocumentService } from '../service/document-service';

// Create a reactive variable for documents
const docs = ref<Array<{id: string, content: string}>>([])

async function createDocument() {
  try {
    const doc = await DocumentService.createDocument()
    console.log("doc", doc);
    await getDocuments()
  } catch (error) {
    console.error("Error creating document:", error)
  }
}

async function updateDocument(id: string, content: string) {
  try {
    const doc = await DocumentService.updateDocument(id, content + " updated")
    console.log("doc", doc);
    await getDocuments()
  } catch (error) {
    console.error("Error creating document:", error)
  }
}

async function deleteDocument(id: string) {
  try {
    const doc = await DocumentService.deleteDocument(id)
    console.log("doc", doc);
    await getDocuments()
  } catch (error) {
    console.error("Error creating document:", error)
  }
}

async function getDocuments() {
  try {
    const serviceDocs = await DocumentService.getDocuments()
    console.log("serviceDocs", serviceDocs);
    docs.value = serviceDocs
    console.log(docs.value)
  } catch (error) {
    console.error("Error fetching documents:", error)
  }
}
</script>

<template>
  <button @click="createDocument" style="text-decoration: underline; cursor: pointer; user-select: none;">
    Create document
  </button>
  <br>
  <ul>
    <li v-for="doc in docs" :key="doc.id">
      <div>{{ doc.content }}</div>
      <span @click="updateDocument(doc.id, doc.content)" style="text-decoration: underline; cursor: pointer; user-select: none;">
        update
      </span> -
      <span @click="deleteDocument(doc.id)" style="text-decoration: underline; cursor: pointer; user-select: none;">
        delete
      </span>
    </li>
  </ul>
</template>
