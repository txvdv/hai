<script setup lang="ts">
import { ref } from 'vue';

const documents = ref([
  {
    id: '1001',
    content:
      'Getting Started with the API. This guide walks through the basics of setting up your API environment. It includes instructions on generating API keys, authenticating requests, and making your first successful API call. Ideal for beginners who want to start integrating our services quickly and efficiently.',
    date: '2025-01-01',
  },
  {
    id: '1002',
    content:
      'Authentication and Security Best Practices. This document provides detailed guidelines on API authentication methods including OAuth 2.0 and API keys. It also covers recommended practices to secure API endpoints and handle sensitive data responsibly to prevent unauthorized access.',
    date: '2025-01-02',
  },
  {
    id: '1003',
    content:
      'Error Handling and Troubleshooting. This guide focuses on understanding the error codes returned by the API and how to resolve common issues. It includes examples of error responses and troubleshooting steps for scenarios like rate limiting, invalid parameters, and authentication failures.',
    date: '2025-01-03',
  },
  {
    id: '1004',
    content:
      'Advanced Querying and Filtering. This document explains how to make efficient API requests using query parameters, filters, and pagination. Learn how to optimize your calls and retrieve the exact data you need by leveraging various options offered by the API.',
    date: '2025-01-04',
  },
  {
    id: '1005',
    content:
      'Webhooks Integration Guide. This technical guide describes how to set up and manage webhooks for real-time notifications. It includes details on configuring webhook endpoints, verifying signatures, and handling incoming payloads to build responsive applications.',
    date: '2025-01-05',
  },
]);
</script>

<template>
  <main>
    <div v-for="doc in documents" :key="doc.id">
      <a
        href="#"
        class="block mb-2 max-w-lg p-6 bg-white border border-gray-200 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <div class="font-medium text-sm text-gray-500 dark:text-gray-600">
          {{ doc.date }}
        </div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          {{ doc.content }}
        </p>
      </a>
    </div>
  </main>
</template>
