<script setup lang="ts">
import Navigation from "../../organisms/navigation/Navigation.vue";

const navItems = [{
  text: 'HAI',
  link: '/'
}, {
  text: 'Dashboard',
  link: '/dashboard'
}, {
  text: 'Composer',
  link: '/composer'
}]
</script>

<template>
  <div class="container">
    <Navigation :items="navItems" />
    <h1 class="text-4xl">Dashboard Page</h1>
  </div>
</template>
