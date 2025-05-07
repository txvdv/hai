<script setup lang="ts">
import Button from 'primevue/button';

const handleClick = () => {
  console.log('Clicked');
};
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button label="Click me" @click="handleClick" />
  </div>
</template>

<style>
@media (min-width: 768px) {
  .about {
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 1rem;
  }
}
</style>
