<script setup lang="ts">
import { ref } from 'vue';

// Reactive state
const response = ref(null);

// Methods
function sendMessageToBackground() {
  // Send a message to the background script
  chrome.runtime.sendMessage(
    { action: 'hello', data: 'Hello from HomeView!' },
    (res) => {
      // Handle the response
      console.log('Response received:', res);
      response.value = res;
    }
  );
}
</script>

<template>
  <div>
    <h1>Home</h1>
    <button @click="sendMessageToBackground" class="message-button">
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
