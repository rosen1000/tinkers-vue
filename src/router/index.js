import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Builder from '../views/Builder.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/builder', component: Builder },
  { path: '/builder/:id', component: Builder },
  { path: '/register', component: () => import('../views/AccountRegister.vue') },
  { path: '/login', component: () => import('../views/AccountLogin.vue') },
  { path: '/account', component: () => import('../views/Account.vue') },
  { path: '/gallery', component: () => import('../views/Gallery.vue') },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
