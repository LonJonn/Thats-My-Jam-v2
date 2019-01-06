import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueSocketIO from "vue-socket.io"
import store from "./store"
import Buefy from "buefy"
import VueProgressBar from 'vue-progressbar'

import 'buefy/dist/buefy.css'

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(new VueSocketIO({
  connection: "localhost:8081"
}));
Vue.use(VueProgressBar, {
  color: '#7957d5',
  failedColor: 'rgb(244, 67, 54)',
  height: '2px'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
