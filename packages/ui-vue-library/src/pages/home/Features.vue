<script setup lang="ts">
const featureSummary = {
  caption: "Everything you need",
  title: "All The Features Belong To You",
  description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione."
}

const features = [{
  title: "Feature 1",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quae."
},{
  title: "Feature 2",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quae."
},{
  title: "Feature 3",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quae."
},{
  title: "Feature 4",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quae."
},{
  title: "Feature 5",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quae."
},{
  title: "Feature 6",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quae."
}]
</script>

<template>
  <div class="py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="features__grid">
        <div>
          <h2 class="features__caption">{{featureSummary.caption}}</h2>
          <p class="features__title">{{featureSummary.title}}</p>
          <p class="features__description">{{featureSummary.description}}</p>
        </div>

        <dl class="feature-list">
          <div v-for="feature in features" :key="feature.title" class="feature">
            <dt class="feature__title">
              <i class="pi pi-check"></i>
              {{ feature.title }}
            </dt>
            <dd class="feature__description">{{feature.description}}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style>
@reference '../../styles/style.css';

.features__grid {
  @apply
  mx-auto
  grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3
}

.features__caption {
  @apply
  text-lg text-primary font-semibold leading-8 tracking-tight
}

.features__title {
  @apply
  mt-2
  text-3xl font-bold tracking-tight sm:text-4xl
}

.features__description {
  @apply
  mt-6
  text-base leading-7
}

.feature-list {
  @apply
  col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:gap-y-16
  text-base leading-7
}

.feature {
  @apply
  relative
  pl-9
}

.feature__icon {
  @apply
  absolute
  top-1 left-0
  h-5 w-5
}

.feature__title {
  @apply
  font-semibold text-primary
}

.feature__description {
  @apply
  mt-2
}
</style>
