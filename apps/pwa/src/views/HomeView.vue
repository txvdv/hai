<script setup lang="ts">
import {Footer} from '@hai/ui-vue-library'
</script>

<template>
  <div class="home">
    <h1>Home</h1>
    <Footer/>
  </div>
</template>

<style>
@media (min-width: 768px) {
  .home {
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 1rem;
  }
}
</style>