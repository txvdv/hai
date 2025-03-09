<script setup lang="ts">
import { Navigation } from "@hai/ui-vue-library";
import { inject, onMounted, ref } from 'vue';
import { ClientCore } from '../main';

const navItems = [{
  text: 'HAI',
  link: '/'
}, {
  text: 'Dashboard',
  link: '/dashboard'
}, {
  text: 'Composer',
  link: '/composer'
}]

type ExistingDocument = {
  id: string;
  content: string;
}

const core = inject('core') as ClientCore

async function doPingPong() {
  const res = await core.appService.pingPong('ping')
  console.log(res)
}

const doc = ref<ExistingDocument>({
  id: '',
  content: ''
});
// Create a reactive variable for documents
const docs = ref<ExistingDocument[]>([]);

async function deleteDocument(id: string) {
  try {
    await core.documentService.deleteDocument(id);
    if (doc.value.id === id) resetDocument()
    await getDocuments();
  } catch (error) {
    console.error('Error creating document:', error);
  }
}

async function editDocument(id: string) {
  const selectedDoc = docs.value.find(document => document.id === id);
  if (selectedDoc) {
    doc.value = { ...selectedDoc };
  }
}

async function getDocuments() {
  try {
    docs.value = await core.documentService.getDocuments();
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

async function newDocument() {
  const {id, content} = doc.value;
  if (id) {
    await core.documentService.updateDocument(id, content);
  }
  resetDocument()
}

async function saveDocument() {
  const {id, content} = doc.value;
  if (id) {
    await core.documentService.updateDocument(id, content);
  } else {
    await core.documentService.createDocument(content);
  }
  await getDocuments()
}

function resetDocument() {
  doc.value = {id: '', content: ''}
}

onMounted(() => {
  // setTimeout(() => {
    getDocuments();
  // }, 5000);
})
</script>

<template>
  <Navigation :items="navItems" />
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2 lg:w-1/3 p-4">
      <textarea v-model="doc.content" id="message" rows="20" class="document-textarea" placeholder="Write here..."></textarea>
      <button type="button" @click="saveDocument" class="btn-light">Save</button>
    </div>
    <div class="w-full md:w-1/2 lg:w-1/3 p-4">
      <button
        @click="doPingPong"
        class="mb-8 btn-link">
        Ping
      </button> - <button
        @click="newDocument"
        class="mb-8 btn-link">
        New document
      </button>
      <ul>
        <li v-for="doc in docs" :key="doc.id" class="mb-4">
          <div>{{ doc.content }}</div>
          <button type="button"
                @click="editDocument(doc.id)"
                aria-label="Edit Document"
                class="btn-link">edit</button> -
          <button type="button"
                  @click="deleteDocument(doc.id)"
                  aria-label="Delete Document"
                  class="btn-link">delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
@reference "tailwindcss";

.btn-light {
  @apply
  text-gray-900
  bg-white border
  border-gray-300
  focus:outline-none
    hover:cursor-pointer
  hover:bg-gray-100
  focus:ring-4 focus:ring-gray-100
  font-medium
  rounded-sm
  text-sm
  px-3
  py-2
  me-2
  mb-2
  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700
}

.btn-link {
  @apply underline cursor-pointer select-none
}

.document-textarea {
  @apply
  block
  mb-2
  p-2.5
  w-full
  text-sm text-gray-900
  bg-gray-50 rounded-sm border border-gray-300
  focus:ring-blue-500 focus:border-blue-500
  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
  dark:focus:ring-blue-500 dark:focus:border-blue-500
}

</style>