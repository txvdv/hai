import './styles.css';
import router from './router';
import { createApp } from 'vue';
import App from './app/App.vue';
import {PrimeVueConfig, DefaultTheme} from "@hai/ui-vue-library"
import './sw-registration'

const app = createApp(App);
app.use(router);
app.use(PrimeVueConfig, {
  theme: DefaultTheme
});
app.mount('#root');
