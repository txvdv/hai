<script setup lang="ts">
import { ref } from 'vue';
import PvTextarea from 'primevue/textarea';
import Button from 'primevue/button';

const value = ref('');
</script>

<template>
  <main>
    <PvTextarea v-model="value" variant="filled" rows="10" cols="50" />
    <br />
    <Button label="Copy" />
    <span class="italic text-sm text-gray-400">
      This is a fake button. Copy doesn't do anything.
    </span>
  </main>
</template>
