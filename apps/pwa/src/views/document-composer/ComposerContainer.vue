<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { ProblemDetails } from '@hai/service-web';
import { DocumentSaveIndicator, DocumentTextarea } from '@hai/ui-library';
import { useDocumentService } from '../../service/use-document-service';

const { documentService } = useDocumentService();
const route = useRoute();
const id = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const doc = ref('');
const status = ref<'success' | 'error'>('success');
const problems = ref<ProblemDetails | undefined>();

function getDocument() {
  documentService.getDocument({ id }).then((res) => {
    if (res.ok) {
      status.value = 'success';
      doc.value = res.data.content;
    } else {
      status.value = 'error';
      problems.value = res.error;
    }
  });
}

function updatedDocument() {
  documentService
    .updateDocument({
      id,
      content: doc.value,
    })
    .then((res) => {
      if (!res.ok) {
        status.value = 'error';
        problems.value = res.error;
      }
    });
}

function updateOrDeleteDocument() {
  if (doc.value) {
    updatedDocument();
  } else {
    documentService.deleteDocument({ id }).then((res) => {
      if (!res.ok) {
        status.value = 'error';
        problems.value = res.error;
      }
    });
  }
}

onMounted(() => {
  getDocument();
});

onUnmounted(() => {
  updateOrDeleteDocument();
});

// Ensure the document is deleted on page unload if empty
window.addEventListener(
  'beforeunload',
  () => {
    if (!doc.value) {
      documentService.deleteDocument({ id });
    }
  },
  {
    capture: true, // Trigger in the capture phase to ensure early execution
  }
);
</script>

<template>
  <div class="editor flex items-start">
    <DocumentTextarea
      v-model="doc"
      :debounce="500"
      @update:modelValue="updatedDocument"
    />
    <DocumentSaveIndicator :status="status" :problems="problems" />
  </div>
</template>
