<!--suppress CssUnusedSymbol -->
<script setup>
import { ref } from 'vue';
import PrimeButton from 'primevue/button';
import PrimeTimeline from 'primevue/timeline';
import PrimeCard from 'primevue/card';

const documents = ref([
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.',
    date: '15/10/2020 10:30',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    content:
      'Nulla facilisi. Sed pulvinar quam ac augue vehicula, vitae convallis elit aliquet. Nam vel semper sem.',
    date: '15/10/2020 14:00',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    content:
      'Mauris tempus, lacus a accumsan faucibus, justo odio vehicula eros, ut luctus mauris nulla quis nunc. Ut quis eros at turpis consectetur sollicitudin.',
    date: '15/10/2020 16:15',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    content:
      'Aenean id dignissim nunc. Integer tincidunt metus et porta dictum. Fusce ac justo rutrum, pulvinar elit ut, lacinia nulla.',
    date: '16/10/2020 10:00',
  },
]);
</script>

<template>
  <div class="flex">
    <PrimeTimeline :value="documents">
      <template #opposite="slotProps">
        <small class="text-muted-color flex-none!">{{
          slotProps.item.date
        }}</small>
      </template>
      <template #content="slotProps">
        <PrimeCard class="mt-4">
          <template #content>
            <p>{{ slotProps.item.content }}</p>
          </template>
          <template #footer>
            <PrimeButton label="View" size="small" variant="text" />
          </template>
        </PrimeCard>
      </template>
    </PrimeTimeline>
  </div>
</template>

<style>
@reference '../../styles/style.css';

.p-timeline-event-opposite {
  @apply flex-none w-36;
}
</style>
