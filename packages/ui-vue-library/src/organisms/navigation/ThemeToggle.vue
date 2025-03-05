<script setup lang="ts">
import { reactive } from 'vue';
import Button from 'primevue/button';

const layoutConfig = reactive({
  darkTheme: false
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

</script>

<template>
  <div class="flex">
    <Button icon="pi pi-sun"
            rounded
            variant="outlined"
            aria-label="Toggle theme"
            @click="toggleDarkMode"
    />
  </div>
</template>
