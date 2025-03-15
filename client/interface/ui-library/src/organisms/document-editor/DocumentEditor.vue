<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ProblemDetails } from '@hai/service-web';
import DocumentTextarea from './DocumentTextarea.vue';
import DocumentSaveIndicator from './DocumentSaveIndicator.vue';
import { DocumentService } from '@hai/ui-core';

// @ts-ignore
const FakeDocumentService: DocumentService = {
  getDocument: async () => {
    return {
      status: 'success',
      payload: {
        id: '123',
        content: 'Hello world',
      },
    };
  },
  updateDocument: async () => {
    console.log('updating');
    return {
      status: 'error',
      payload: {
        type: 'InvalidDocumentError',
        title: 'Invalid document',
      },
    };
  },
};

const doc = ref('');
const status = ref<'success' | 'error'>('success');
const problems = ref<ProblemDetails | undefined>();

function getDocument() {
  FakeDocumentService.getDocument('123').then((response) => {
    status.value = response.status as 'success' | 'error';
    if (response.status === 'error') {
      problems.value = response.payload;
    } else {
      doc.value = response.payload.content;
    }
  });
}

function saveDocument() {
  FakeDocumentService.updateDocument('123', 'n/a').then((response) => {
    status.value = response.status as 'success' | 'error';
    if (response.status === 'error') {
      problems.value = response.payload;
    }
  });
}

onMounted(() => {
  getDocument();
});
</script>

<template>
  <div class="editor flex items-start">
    <DocumentTextarea v-model="doc" @update:modelValue="saveDocument" />
    <DocumentSaveIndicator :status="status" :problems="problems" />
  </div>
</template>

<style>
@reference '../../styles/style.css';
</style>
