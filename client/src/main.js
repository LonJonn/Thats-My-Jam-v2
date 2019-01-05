import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueSocketIO from "vue-socket.io"
import store from "./store"
// import buefy from "buefy"

Vue.config.productionTip = false;
Vue.use(new VueSocketIO({
  connection: "localhost:8081"
}));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
