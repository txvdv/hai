import './styles.css';
import router from './router';
import { createApp } from 'vue';
import App from './app/App.vue';
import { PrimeVueConfig, DefaultTheme } from '@hai/ui-library';
import './sw-registration';

import { AppService } from './service/app-service';
import { DocumentService } from './service/document-service';

export interface ClientCore {
  appService: AppService;
  documentService: DocumentService;
}

navigator.serviceWorker.ready.then(() => {
  console.log('Service Worker ready. Initializing app...');

  const core: ClientCore = {
    appService: new AppService(),
    documentService: new DocumentService(),
  };

  const app = createApp(App);
  app.use(router);
  app.use(PrimeVueConfig, {
    theme: DefaultTheme,
  });
  app.provide('core', core);
  app.mount('#root');
});
