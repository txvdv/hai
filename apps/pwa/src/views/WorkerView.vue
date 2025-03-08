<script setup lang="ts">
import { ref } from 'vue'
import { DocumentService } from '../service/document-service';

// Create a reactive variable for documents
const docs = ref<string[]>([])

// Fetch documents and update the `docs` array
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
  <button
    @click="getDocuments"
    style="text-decoration: underline; cursor: pointer;"
  >
    Get documents
  </button>
  <ul>
    <li v-for="(doc, index) in docs" :key="index">
      {{ doc }}
    </li>
  </ul>
</template>
