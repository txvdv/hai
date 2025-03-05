<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from "primevue/button"

const router = useRouter()
const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="hero">
    <div class="text-center">
      <div class="hero__caption">POWERED BY YOU</div>
      <div class="hero__title">Human Accepted Interaction</div>
      <div class="hero__subtitle">A place to write and help your fellow human.</div>
      <Button label="Get Started" @click="goToDashboard" />
    </div>
  </div>
</template>

<style>
@reference '../../styles/style.css';

.hero {
  @apply px-6 py-20 md:px-12 lg:px-20
}

.hero__caption {
  @apply
  mb-4
  font-bold text-primary-500
}

.hero__title {
  @apply font-bold text-5xl mb-4
}

.hero__subtitle {
  @apply text-2xl mb-8
}
</style>
