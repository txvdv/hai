<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="sendMessageToBackground" class="message-button">Send Message to Background</button>
    <div v-if="response" class="response-container">
      <h3>Response from Background:</h3>
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Reactive state
const response = ref(null);

// Methods
function sendMessageToBackground() {
  // Send a message to the background script
  chrome.runtime.sendMessage(
    { action: 'hello', data: 'Hello from AboutView!' },
    (res) => {
      // Handle the response
      console.log('Response received:', res);
      response.value = res;
    }
  );
}
</script>

<style>
@media (min-width: 768px) {
  .about {
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 1rem;
  }
}

.message-button {
  background-color: #4CAF50;
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
