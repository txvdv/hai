import { createRouter, createWebHistory } from 'vue-router';
import { HomePage } from '@hai/ui-library';
import AppLayout from '../layout/AppLayout.vue';
import DashboardContainer from '../views/dashboard/DashboardContainer.vue';
import ComposerContainer from '../views/document-composer/ComposerContainer.vue';

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
          component: DashboardContainer,
        },
        {
          path: '/compose/:id',
          name: 'composer',
          component: ComposerContainer,
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/about/AboutContainer.vue'),
        },
      ],
    },
  ],
});

export default router;
