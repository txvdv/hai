import { createApp as createVueApp } from 'vue';
import './styles.css';
import router from './router';
import App from './app/App.vue';

export function createApp() {
  const app = createVueApp(App);
  // const app = createVueApp(rootComponent);
  app.use(router);
  app.mount('#root');
}
