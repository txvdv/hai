<script setup lang="ts">
import { ref } from 'vue';
import Navigation from '../organisms/navigation/Navigation.vue';
import DocumentEditor from '../organisms/document-editor/DocumentEditor.vue';
import DocumentBrowser from '../organisms/document-browser/DocumentBrowser.vue';

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

const doc = ref('');
const documents = ref([]);
</script>

<template>
  <div class="h-screen">
    <Navigation :items="navItems" />
    <main class="grid grid-cols-2 gap-4">
      <DocumentBrowser :documents="documents" />
      <DocumentEditor :model-value="doc" />
    </main>
  </div>
</template>

<style></style>
