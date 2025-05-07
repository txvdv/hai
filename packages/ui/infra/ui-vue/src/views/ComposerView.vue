<script setup lang="ts">
import { ref } from 'vue';
import PvTextarea from 'primevue/textarea';

const value = ref('');
</script>

<template>
  <main>
    <PvTextarea v-model="value" variant="filled" rows="30" cols="50" />
  </main>
</template>
