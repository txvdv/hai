<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { ProblemDetails } from '@hai/service-web';
import { UiCore } from '@hai/ui-core';
import {
  DocumentSaveIndicator,
  DocumentTextarea,
  Navigation,
} from '@hai/ui-library';

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
  {
    text: 'Composer',
    link: '/docs',
  },
];

const core = inject('core') as UiCore;
const documentService = core.getDocumentService();

const route = useRoute();
const id = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const doc = ref('');
const status = ref<'success' | 'error'>('success');
const problems = ref<ProblemDetails | undefined>();

function getDocument() {
  documentService.getDocument(id).then((response) => {
    status.value = response.status as 'success' | 'error';
    if (response.status === 'error') {
      problems.value = response.payload;
    } else {
      doc.value = response.payload.content;
    }
  });
}

function saveDocument() {
  documentService.updateDocument(id, doc.value).then((response) => {
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
  <Navigation :items="navItems" />
  <div class="editor flex items-start">
    <DocumentTextarea v-model="doc" @update:modelValue="saveDocument" />
    <DocumentSaveIndicator :status="status" :problems="problems" />
  </div>
</template>
