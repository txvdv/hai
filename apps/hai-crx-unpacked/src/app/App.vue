<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> -
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="css"></style>
