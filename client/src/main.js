import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueSocketIO from "vue-socket.io"
import VueSweetalert2 from "vue-sweetalert2";
// import buefy from 'buefy'

Vue.config.productionTip = false;
Vue.use(new VueSocketIO({
  connection: 'localhost:8081'
}));
Vue.use(VueSweetalert2);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
