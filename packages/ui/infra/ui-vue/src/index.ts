import { createApp as createVueApp } from 'vue';
import App from './app/App.vue';
import router from './router';
import { PrimeVueConfig, DefaultTheme } from './styles/theme';
import './styles/styles.css';

export function createApp() {
  const app = createVueApp(App);
  // const app = createVueApp(rootComponent);
  app.use(router);
  app.use(PrimeVueConfig, {
    theme: DefaultTheme,
  });
  app.mount('#root');
}
