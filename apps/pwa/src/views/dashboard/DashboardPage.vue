<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ComposedDocument } from '@hai/service-web';
import { UiCore } from '@hai/ui-core';
import { DocumentBrowser, Navigation } from '@hai/ui-library';

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

const core = inject('core') as UiCore;
const documentService = core.getDocumentService();

const router = useRouter();

const docs = ref<ComposedDocument[]>([]);

function getDocuments() {
  documentService.getDocuments().then((response) => {
    if (response.status === 'error') {
      throw response.payload;
    } else {
      docs.value = response.payload.documents;
    }
  });
}

function createAndOpenDocument() {
  documentService.createDocument('').then((response) => {
    if (response.status === 'error') {
      throw response.payload;
    } else {
      viewDoc(response.payload.id);
    }
  });
}

function viewDoc(id: string) {
  router.push(`/compose/${id}`);
}

onMounted(() => {
  getDocuments();
});
</script>

<template>
  <Navigation :items="navItems" />
  <DocumentBrowser
    :documents="docs"
    @view-doc="viewDoc"
    @new-doc="createAndOpenDocument"
  />
</template>
