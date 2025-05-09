<script setup lang="ts">
import { ref } from 'vue';

// Reactive state
const response = ref(null);

// Methods
function sendMessage() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        // Send a message to the service worker
        if (registration.active) {
          registration.active.postMessage({
            action: 'hello',
            data: 'Hello from HomeView!',
          });

          // Set up a listener for the response (optional)
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('Response received:', event.data);
            response.value = event.data;
          });
        }
      })
      .catch((err) => {
        console.error('ServiceWorker not ready:', err);
      });
  } else {
    console.error('ServiceWorker is not supported in this browser.');
  }
}
</script>

<template>
  <div>
    <h1>Home</h1>
    <button @click="sendMessage" class="message-button">
      Send Message to Background
    </button>
    <div v-if="response" class="response-container">
      <h3>Response from Background:</h3>
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<style>
.message-button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 20px 0;
  cursor: pointer;
  border-radius: 4px;
}

.response-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #ddd;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
