import { createRouter, createWebHistory } from 'vue-router';
import { HomePage } from '@hai/ui-library';
import AppLayout from '../layout/AppLayout.vue';
import DashboardPage from '../views/dashboard/DashboardPage.vue';
import DocumentEditor from '../views/document-composer/DocumentEditor.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
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
          path: '/compose/:id',
          name: 'composer',
          component: DocumentEditor,
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/about/AboutView.vue'),
    },
  ],
});

export default router;
