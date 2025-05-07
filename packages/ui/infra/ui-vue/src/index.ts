import { createApp as createVueApp } from 'vue';
import App from './app/App.vue';
import router from './router';
import './styles.css';
import { PrimeVueConfig, DefaultTheme } from './theme';

export function createApp() {
  const app = createVueApp(App);
  // const app = createVueApp(rootComponent);
  app.use(router);
  app.use(PrimeVueConfig, {
    theme: DefaultTheme,
  });
  app.mount('#root');
}
