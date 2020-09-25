import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    name: 'restaurants',
    component: () => import('../views/Restaurants'),
  },
  {
    path: '/restaurant/:id',
    name: 'restaurantDetails',
    component: () => import('../views/RestaurantDetails'),
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/Users'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
