<script setup lang="ts">
import { Navigation } from '@hai/ui-library';

const navItems = [
  {
    text: 'HAI',
    link: '/',
  },
  {
    text: 'Dashboard',
    link: '/dashboard',
  },
];
</script>

<template>
  <div class="app-layout">
    <Navigation :items="navItems" />
    <router-view></router-view>
  </div>
</template>

<style>
@media (min-width: 768px) {
  .app-layout {
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 1rem;
  }
}
</style>
