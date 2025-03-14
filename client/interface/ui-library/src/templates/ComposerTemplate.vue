<script setup lang="ts">
import Navigation from '../organisms/navigation/Navigation.vue';
import DocumentEditor from '../organisms/document-editor/DocumentEditor.vue';
import { ref } from 'vue';

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
</script>

<template>
  <div class="h-screen">
    <Navigation :items="navItems" />
    <main class="grid grid-cols-2 gap-4 h-dvh">
      <div class="w-auto border">
        <div>browser</div>
      </div>
      <div class="w-auto h-full border">
        <div>editor</div>
        <DocumentEditor :model-value="doc" />
      </div>
    </main>
  </div>
</template>

<style></style>
