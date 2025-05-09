import './styles.css';
import router from './router';
import { createApp } from 'vue';
import App from './app/App.vue';
import './sw-registration';

navigator.serviceWorker.ready.then(() => {
  console.log('Service Worker ready. Initializing app...');
  const app = createApp(App);
  app.use(router);
  app.mount('#root');
});
