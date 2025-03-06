import './styles.css';
import router from './router';
import { createApp } from 'vue';
import App from './app/App.vue';
import {PrimeVueConfig, DefaultTheme} from "@hai/ui-vue-library"

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        import.meta.env.MODE === 'production' ? '/service-worker.js' : '/service-worker.js?service-worker'
      );
      console.log('Service Worker registered successfully with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

const app = createApp(App);
app.use(router);
app.use(PrimeVueConfig, {
  theme: DefaultTheme
});
app.mount('#root');
