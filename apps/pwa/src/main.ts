import './styles.css';
import router from './router';
import { createApp } from 'vue';
import App from './app/App.vue';
import {PrimeVueConfig, AuraTheme} from "@hai/vue-components"

const app = createApp(App);
app.use(router);
app.use(PrimeVueConfig, {
  theme: AuraTheme
});
app.mount('#root');
