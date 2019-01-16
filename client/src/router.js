import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Playground from "./views/Playground.vue";
import Login from "./views/Login.vue";

Vue.use(Router);

const requiresAuth = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/login");
};

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "playground",
      component: Playground,
      beforeEnter: requiresAuth
    },
    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
});
