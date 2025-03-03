<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header style="margin-bottom: 1rem;">
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/notes">Notes</RouterLink> |
      <RouterLink to="/compose">Compose</RouterLink> |
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
