<script setup lang="ts">
import ThemeToggle from "./ThemeToggle.vue";

interface NavItem {
  text: string;
  link: string;
}

defineProps<{
  items: NavItem[]
}>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4 navigation">
      <router-link v-for="item in items" :to="item.link">
        <span class="">{{item.text}}</span>
      </router-link>
    </div>
    <ThemeToggle/>
  </div>
</template>