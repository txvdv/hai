<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { UiCore } from '@hai/ui-core';
import { DocumentBrowser } from '@hai/ui-library';

type ComposedDocument = {
  id: string;
  content: string;
};

const core = inject('core') as UiCore;
const documentService = core.getDocumentService();

const router = useRouter();

const docs = ref<ComposedDocument[]>([]);

function getDocuments() {
  documentService.getDocuments().then((res) => {
    if (res.ok) {
      docs.value = res.data;
    } else {
      throw res.error;
    }
  });
}

function createAndOpenDocument() {
  documentService.createDocument({ content: '' }).then((res) => {
    if (res.ok) {
      viewDoc(res.data.id);
    } else {
      throw res.error;
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
  <DocumentBrowser
    :documents="docs"
    @view-doc="viewDoc"
    @new-doc="createAndOpenDocument"
  />
</template>
