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

const requireAdminAuth = (to, from, next) => {
  const app = Realm.getApp("application-0-kmolw");

  app.currentUser.callFunction("isAdmin")
  .then((data) => {
    if (data === true) {
      next();
    } else {
      alert("Not Authorised");
      next('/user');
    }
  })
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
          path: 'userhome',
          name: 'UserHome',
          component: () => import('../views/UserPage/UserHome.vue')
        }, {
          path: '',
          name: 'AllUsers',
          component: () => import('../views/UserPage/AllUsers.vue')
        }, {
          path: 'adduser',
          name: 'AddUser',
          beforeEnter: requireAdminAuth,
          component: () => import('../views/UserPage/AddUser.vue')
        },
      ]
    },
    {
      path: '/',
      name: 'SingInPage',
      component: () => import('../views/SignInPage.vue')
    }
  ]
})

export default router
