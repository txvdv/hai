import { createRouter, createMemoryHistory} from 'vue-router';
import {
  ComposerPage,
  DashboardPage,
  HomePage
} from '../src';

/**
 * Note: these routes actually do not work
 */
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage
    },
    {
      path: '/composer/:id',
      name: 'composer-new',
      component: ComposerPage
    },
    {
      path: '/composer',
      name: 'composer',
      component: ComposerPage
    },
  ]
})

export default router
