<script setup lang="ts">
import { Navigation } from '@hai/ui-library';
import { DocumentBrowserViewState, UiCore } from '@hai/ui-core';
import Dialog from './Dialog.vue';
import { computed, inject, onMounted, ref, nextTick, onUnmounted } from 'vue';
import { waitForServiceWorkerController } from '../../service/service-worker-utils';

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

const core = inject('core') as UiCore;
const viewModel = core.getDocumentBrowserViewModel();
const viewState = ref(viewModel.getState());
const viewStateSub = (s: DocumentBrowserViewState) => {
  viewState.value = s;
};
onMounted(() => {
  viewModel.subscribe(viewStateSub);
});
onUnmounted(() => {
  viewModel.unsubscribe(viewStateSub);
});

const isDialogVisible = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const textareaVisible = ref(false);
function showTextarea() {
  textareaVisible.value = true;
  // Add a small delay to ensure the textarea is rendered in the DOM
  nextTick(() => {
    textareaRef.value?.focus();
  });
}
function hideTextarea() {
  textareaVisible.value = false;
}

const doc = ref<ExistingDocument>({
  id: '',
  content: '',
});
let docCache: ExistingDocument | null = null;

function createDocument() {
  if (
    textareaVisible.value &&
    doc.value.id === '' &&
    doc.value.content === ''
  ) {
    return;
  }

  if (docCache && docCache.content !== doc.value.content) {
    isDialogVisible.value = true;
    return;
  }

  showTextarea();
}

const createDocumentText = computed(() => {
  return viewState.value.documents.length === 0
    ? 'Create your first document'
    : 'Create a new document';
});

async function deleteDocument(id: string) {
  try {
    await viewModel.deleteDocument(id);
    if (viewState.value.problem) return;
    if (doc.value.id === id) resetDocument();
  } catch (error) {
    console.error('Error creating document:', error);
  }
}

async function editDocument(id: string) {
  showTextarea();
  const selectedDoc = viewState.value.documents.find(
    (document) => document.id === id
  );
  if (selectedDoc) {
    doc.value = { ...selectedDoc };
    docCache = selectedDoc;
  }
}

async function saveDocument() {
  const { id, content } = doc.value;
  await viewModel.saveDocument(content, id);
  if (viewState.value.problem) return;

  hideTextarea();
  docCache = null;
}

function resetDocument() {
  doc.value = {
    id: '',
    content: '',
  };
  docCache = null;
}

async function onDialogConfirm() {
  const { id, content } = doc.value;
  await viewModel.saveDocument(content, id);
  isDialogVisible.value = false;
  resetDocument();
}

function onDialogClose() {
  isDialogVisible.value = false;
  resetDocument();
}

function customCancelAction() {
  isDialogVisible.value = false;
  resetDocument();
}

onMounted(async () => {
  await waitForServiceWorkerController(5000);
  await viewModel.loadDocuments();
});
</script>

<template>
  <Navigation :items="navItems" />

  <Dialog
    v-model="isDialogVisible"
    @confirm="onDialogConfirm"
    @close="onDialogClose"
  >
    <!-- Providing custom title using slot -->
    <template #title> Unsaved Changes </template>

    <!-- Providing custom body using slot -->
    <template #body>
      <p>Do you want to save your changes?</p>
    </template>

    <!-- Custom actions using slot -->
    <template #actions>
      <button
        type="button"
        class="dialog__button dialog__button--confirm"
        @click="onDialogConfirm"
        aria-label="Confirm Action"
      >
        Save
      </button>
      <button
        type="button"
        class="dialog__button dialog__button--cancel"
        @click="customCancelAction"
        aria-label="Cancel Action"
      >
        Cancel
      </button>
    </template>
  </Dialog>

  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2 lg:w-1/3 p-4">
      <button
        type="button"
        @click="createDocument"
        aria-label="Create Document"
        class="btn-link mb-4"
      >
        {{ createDocumentText }}
      </button>

      <ul>
        <li v-for="doc in viewState.documents" :key="doc.id" class="mb-4">
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
          ref="textareaRef"
          id="document"
          rows="20"
          class="document-textarea"
          placeholder="Write here..."
        ></textarea>
        <button
          type="button"
          aria-label="Save Document"
          @click="saveDocument"
          class="btn-light"
          :disabled="doc.content === ''"
        >
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
