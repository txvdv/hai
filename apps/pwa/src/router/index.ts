import { createRouter, createWebHistory } from 'vue-router';
import {
  // HomePage,
  DashboardPage,
  ComposerPage
} from "@hai/ui-vue-library"
import WorkerView from '../views/WorkerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WorkerView,
    },
    {
      path: '/work',
      name: 'work',
      component: WorkerView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
    },
    {
      path: '/composer',
      name: 'composer',
      component: ComposerPage,
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
