import Vue from "vue";
import Vuex from "vuex";
import Router from "./router";
import axios from "axios";
import AuthService from "./services/AuthService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null
  },
  getters: {
    isAuthed: state => !!state.user
  },
  mutations: {
    logInUser(state, userObj) {
      state.user = userObj;
    },
    logOutUser(state) {
      delete axios.defaults.headers.common["x-auth-token"];
      localStorage.removeItem("User");
      state.user = null;
      Router.push("/login");
    }
  },
  actions: {
    async fetchUser({ commit }) {
      const response = await AuthService.getUserInfo();
      response.data.JWToken = axios.defaults.headers.common["x-auth-token"];
      localStorage.setItem("User", JSON.stringify(response.data));
      commit("logInUser", response.data);
    }
  }
});
