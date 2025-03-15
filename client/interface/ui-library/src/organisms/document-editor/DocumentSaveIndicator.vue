<script setup lang="ts">
import { computed, ref } from 'vue';
import PvButton from 'primevue/button';
import PvPopover from 'primevue/popover';
import AppProblemDetails from '../../molecules/problem-details/ProblemDetails.vue';
import type { ProblemDetails } from '@hai/service-web';

interface DocumentSaveIndicatorProps {
  status: 'success' | 'error';
  problems?: ProblemDetails;
}

const props = defineProps<DocumentSaveIndicatorProps>();

const op = ref();

const iconSeverity = computed<string>(() => {
  return props.status === 'success' ? 'success' : 'danger';
});

const iconType = computed<string>(() => {
  return props.status === 'success'
    ? 'pi pi-check'
    : 'pi pi-exclamation-circle';
});

const toggle = (event: MouseEvent) => {
  op.value.toggle(event);
};
</script>

<template>
  <PvButton
    @click="toggle"
    :severity="iconSeverity"
    :icon="iconType"
    variant="text"
    rounded
    aria-label="Document Save Indicator"
  />
  <PvPopover ref="op">
    <AppProblemDetails v-if="problems" :problemDetails="problems" />
    <p v-else>Document saved</p>
  </PvPopover>
</template>

<style>
@reference '../../styles/style.css';
</style>
