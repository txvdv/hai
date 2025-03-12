<script setup lang="ts">
import Button from "primevue/button"
</script>

<template>
  <footer>
    <ul>
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
      <li><a href="#">Link 3</a></li>
    </ul>
    <Button label="Button" />
  </footer>
</template>

<style>
@reference '../../styles/style.css';

footer {
  @apply bg-black p-4 sm:flex sm:items-center sm:justify-between
}

footer > ul {
  @apply flex items-center flex-wrap
}

footer > ul > li {
  @apply text-sm text-gray-300 hover:text-gray-100 hover:underline mr-4 md:mr-6
}
</style>
