import './styles.css';
import router from './router';
import { createApp } from 'vue';
import App from './App.vue';
import { PrimeVueConfig, DefaultTheme } from '@hai/ui-library';
import { UiCore } from '@hai/ui-core';
import './sw-registration';

navigator.serviceWorker.ready.then(() => {
  console.log('Service Worker ready. Initializing app...');
  const core = new UiCore();
  const app = createApp(App);
  app.use(router);
  app.use(PrimeVueConfig, {
    theme: DefaultTheme,
  });
  app.provide('core', core);
  app.mount('#root');
});
