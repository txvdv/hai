<script setup lang="ts">
import { Navigation } from '@hai/ui-vue-library';
import { computed, inject, onMounted, ref } from 'vue';
import { ClientCore } from '../main';
import { waitForServiceWorkerController } from '../service/app-service';

const navItems = [
  {
    text: 'HAI',
    link: '/',
  },
  {
    text: 'Dashboard',
    link: '/dashboard',
  },
  {
    text: 'Composer',
    link: '/composer',
  },
];

type ExistingDocument = {
  id: string;
  content: string;
};

const core = inject('core') as ClientCore;

const textareaVisible = ref(false);
function showTextarea() {
  textareaVisible.value = true;
}
function hideTextarea() {
  textareaVisible.value = false;
}

const doc = ref<ExistingDocument>({
  id: '',
  content: '',
});
// Create a reactive variable for documents
const docs = ref<ExistingDocument[]>([]);

const createDocumentText = computed(() => {
  // if (!docs.value.length) return
  return docs.value.length === 0 ? 'Create your first document' : 'Create a new document';
})

async function deleteDocument(id: string) {
  try {
    await core.documentService.deleteDocument(id);
    if (doc.value.id === id) resetDocument();
    await getDocuments();
  } catch (error) {
    console.error('Error creating document:', error);
  }
}

async function editDocument(id: string) {
  showTextarea()
  const selectedDoc = docs.value.find((document) => document.id === id);
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

async function saveDocument() {
  const { id, content } = doc.value;
  if (id) {
    await core.documentService.updateDocument(id, content);
  } else {
    await core.documentService.createDocument(content);
  }
  hideTextarea()
  await getDocuments();
}

function resetDocument() {
  doc.value = {
    id: '',
    content: '',
  };
}

onMounted(async () => {
  await waitForServiceWorkerController(5000);
  getDocuments();
});
</script>

<template>
  <Navigation :items="navItems" />
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2 lg:w-1/3 p-4">
      <button
        type="button"
        @click="showTextarea"
        aria-label="Create Document"
        class="btn-link"
      >{{createDocumentText}}</button>

      <ul>
        <li v-for="doc in docs" :key="doc.id" class="mb-4">
          <div>{{ doc.content }}</div>
          <button
            type="button"
            @click="editDocument(doc.id)"
            aria-label="Edit Document"
            class="btn-link"
          >
            edit
          </button>
          -
          <button
            type="button"
            @click="deleteDocument(doc.id)"
            aria-label="Delete Document"
            class="btn-link"
          >
            delete
          </button>
        </li>
      </ul>
    </div>
    <div class="w-full md:w-1/2 lg:w-1/3 p-4">
      <div v-if="textareaVisible">
        <textarea
          v-model="doc.content"
          id="document"
          rows="20"
          class="document-textarea"
          placeholder="Write here..."
        ></textarea>
        <button type="button" aria-label="Save Document" @click="saveDocument" class="btn-light" :disabled="doc.content === ''">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@reference "tailwindcss";

.btn-light {
  @apply text-gray-900
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
  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700;
}

.btn-link {
  @apply underline cursor-pointer select-none;
}

.document-textarea {
  @apply block
  mb-2
  p-2.5
  w-full
  text-sm text-gray-900
  bg-gray-50 rounded-sm border border-gray-300
  focus:ring-blue-500 focus:border-blue-500
  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
  dark:focus:ring-blue-500 dark:focus:border-blue-500;
}
</style>