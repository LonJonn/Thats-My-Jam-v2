import Vue from "vue";
import Router from "vue-router";
import Playground from "./views/Playground.vue";
import Posts from "./views/Posts.vue";
import AddPost from "./views/AddPost.vue";
import EditPost from "./views/EditPost.vue";

Vue.use(Router);

export default new Router({
  // mode: "history",
  routes: [
    {
      path: "/",
      name: "playground",
      component: Playground
    },
    {
      path: "/posts",
      name: "posts",
      component: Posts
    },
    {
      path: "/posts/add",
      name: "addPost",
      component: AddPost
    },
    {
      path: "/posts/:id/edit",
      name: "editPost",
      component: EditPost
    },
  ]
});
