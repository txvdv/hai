<script setup lang="ts">
import { computed } from 'vue';
import type { ProblemDetails } from '@hai/service-web';

interface DocumentListItemProps {
  problemDetails: ProblemDetails;
}

const props = defineProps<DocumentListItemProps>();

const errors = computed<string[] | undefined>(() => {
  if (!props.problemDetails.errors) return undefined;
  return props.problemDetails.errors.map((err) => err.detail);
});
</script>

<template>
  <div>{{ problemDetails.title }}</div>
  <p v-if="problemDetails.detail">
    {{ problemDetails.detail }}
  </p>
  <ul v-if="errors">
    <li v-for="(detail, idx) in errors" :key="idx">
      {{ detail }}
    </li>
  </ul>
</template>

<style>
@reference '../../styles/style.css';
</style>
