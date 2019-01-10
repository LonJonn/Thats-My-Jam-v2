import Vue from 'vue'
import Vuex from 'vuex'
import AuthService from './services/AuthService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    logInUser(state, user) {
      state.user = user
    },
    logOutUser(state) {
      state.user = null;
    }
  },
  actions: {
    async fetchUser({ commit }, JWToken) {
      const response = await AuthService.getUserInfo(JWToken);
      response.data.JWToken = JWToken
      commit("logInUser", response.data)
    }
  }
})
