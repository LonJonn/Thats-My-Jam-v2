import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIO from "vue-socket.io";
import Buefy from "buefy";
import VueProgressBar from "vue-progressbar";

import "buefy/dist/buefy.css"; //remove for custom styling

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(
  new VueSocketIO({
    connection: "localhost:8081"
  })
);
Vue.use(VueProgressBar, {
  color: "#7957d5",
  failedColor: "rgb(244, 67, 54)",
  height: "2px"
});

const main = async function() {
  const JWToken = localStorage.getItem("JWToken");
  if (JWToken)
    try {
      await store.dispatch("logIn", JWToken);
    } catch (error) {
      localStorage.removeItem("JWToken");
    }

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
};

main();
