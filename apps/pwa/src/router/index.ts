import { createRouter, createWebHistory } from 'vue-router';
import {
  HomePage,
  DashboardPage,
  // ComposerPage
} from '@hai/ui-library';
// import DocumentsView from '../views/DocumentsView.vue';
import DocumentsViewWithModel from '../views/DocumentsViewWithModel.vue';
import DocumentEditor from '../views/document-composer/DocumentEditor.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
    },
    {
      path: '/composer',
      name: 'composer',
      component: DocumentsViewWithModel,
    },
    {
      path: '/docs/:id',
      name: 'document-composer',
      component: DocumentEditor,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
});

export default router;
