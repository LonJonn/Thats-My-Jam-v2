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
    setUser(state, userObj) {
      state.user = userObj;
    },
    clearUser(state) {
      state.user = null;
    }
  },

  actions: {
    async logIn({ commit }, JWToken) {
      axios.defaults.headers.common["x-auth-token"] = JWToken;
      localStorage.setItem("JWToken", JWToken);
      const response = await AuthService.getUserInfo();
      commit("setUser", response.data);
    },
    logOut({ commit }) {
      delete axios.defaults.headers.common["x-auth-token"];
      localStorage.removeItem("JWToken");
      commit("clearUser");
      Router.push("/login");
    }
  }
});
