<script setup lang="ts">
import Hero from "./Hero.vue";
import Features from "./Features.vue";
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
  <div>
    <Navigation :items="navItems" />
    <Hero />
    <Features />
  </div>
</template>

<style>
</style>
