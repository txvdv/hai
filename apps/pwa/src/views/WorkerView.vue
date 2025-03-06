<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
// import MyWorker from '../worker?worker'
import { DocumentService } from '../service/document-service';

const pong = ref(null)
// const worker = new MyWorker()

async function runWorker() {
  // worker.postMessage('ping')
  const docs = await DocumentService.getDocuments()
  console.log(docs);
}
async function resetMessage() {
  // worker.postMessage('clear')
}
async function messageFromWorker(msg: any) {
  pong.value = msg.data.msg
}

onBeforeMount(() => {
  // worker.addEventListener('message', messageFromWorker)
})

</script>

<template>
  <br>
  <router-view />
  <br>
  <br>
  <button @click="runWorker">
    Get documents
  </button>
  <button v-if="false" @click="resetMessage">
    Reset message
  </button>
  <br>
  <br>
  <template v-if="pong">
    Response from web worker: <span> Message: {{ pong }} </span>
  </template>
</template>

<style>
@media (min-width: 768px) {
  .home {
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 1rem;
  }
}
</style>