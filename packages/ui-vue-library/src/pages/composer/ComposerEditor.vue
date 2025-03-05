<script setup lang="ts">
import Button from "primevue/button"

defineProps<{
  documentContent: string;
}>()

const emit = defineEmits<{
  (e: 'save-doc'): void
}>()

const saveDoc = () => {
  emit('save-doc');
};
</script>

<template>
  <div>
    <textarea
        class="composer-editor__textarea"
        placeholder="Enter your text here"
    >
    </textarea>
    <br>
    <Button
        @click="saveDoc"
        label="Save"
    />
  </div>
</template>

<style>
@reference '../../styles/style.css';

.composer-editor__textarea {
  @apply w-[500px] h-[500px] border border-gray-300 rounded-md p-2
}
</style>
