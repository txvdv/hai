<script setup lang="ts">
import { computed, reactive } from 'vue';
import PvButton from 'primevue/button';

const layoutConfig = reactive({
  darkTheme: false,
});

const toggleDarkMode = () => {
  if (!('startViewTransition' in document)) {
    executeDarkModeToggle();
    return;
  }
  (document as any).startViewTransition(() => executeDarkModeToggle());
};

const executeDarkModeToggle = () => {
  layoutConfig.darkTheme = !layoutConfig.darkTheme;
  document.documentElement.classList.toggle('dark');
};

const toggleIcon = computed(() => {
  if (layoutConfig.darkTheme) {
    return 'pi pi-moon';
  } else {
    return 'pi pi-sun';
  }
});
</script>

<template>
  <div class="flex">
    <PvButton
      :icon="toggleIcon"
      rounded
      variant="text"
      aria-label="Toggle theme"
      @click="toggleDarkMode"
    />
  </div>
</template>
