import { createRouter, createWebHistory } from 'vue-router'
import * as Realm from "realm-web";

const requireAuth = (to, from, next) => {
  const app = Realm.getApp("application-0-kmolw");
  if(app.currentUser == null) {
    alert("Sign In First");
    next('/');
  } else 
    next();
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/user',
      name: 'UserPage',
      beforeEnter: requireAuth,
      component: () => import('../views/UserPage/UserPage.vue'),
      children: [
        {
          path: 'allusers',
          name: 'AllUsers',
          component: () => import('../views/UserPage/AllUsers.vue')
        },
      ]
    },
    {
      path: '/',
      name: 'SingInPage',
      component: () => import('../views/SignInPage.vue')
    },
    {
      path: '/sign-up',
      name: 'SignUpPage',
      component: () => import('../views/SignUpPage.vue')
    }
  ]
})

export default router
