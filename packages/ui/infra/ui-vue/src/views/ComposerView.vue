<script setup lang="ts">
import { ref } from 'vue';
import PvTextarea from 'primevue/textarea';
import Button from 'primevue/button';

const value = ref('');
</script>

<template>
  <main>
    <p class="italic text-2xl text-red-500">tailwind</p>
    <Button label="Click me" />
    <PvTextarea v-model="value" variant="filled" rows="10" cols="50" />
  </main>
</template>
