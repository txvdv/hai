import './styles.css';
import router from './router';
import { createApp } from 'vue';
import App from './app/App.vue';
import {PrimeVueConfig, DefaultTheme} from "@hai/ui-vue-library"
import './sw-registration'
import { DocumentService } from './service/document-service';

export interface ClientCore {
  documentService: DocumentService
}

const core:ClientCore = {
  documentService: new DocumentService()
}

const app = createApp(App);
app.use(router);
app.use(PrimeVueConfig, {
  theme: DefaultTheme
});
app.provide('core', core);
app.mount('#root');
