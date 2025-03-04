import './styles.css';
import router from './router';
import { createApp } from 'vue';
import App from './app/App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.mount('#root');
