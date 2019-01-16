import Vue from "vue";
import Vuex from "vuex";
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
      state.user = null;
    }
  },
  actions: {
    async fetchUser({ commit }, JWToken) {
      const response = await AuthService.getUserInfo(JWToken);
      response.data.JWToken = JWToken;
      commit("logInUser", response.data);
    }
  }
});
