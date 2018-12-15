import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    logInUser(state, response) {
      state.user = response.user;
      state.user.JWTtoken = response.JWTtoken;
    },
    logOutUser(state) {
      state.user = {};
    }
  },
  actions: {
    async fetchUser({ commit }, token) {
      const response = await axios.get("http://localhost:8081/api/users/me", {
        headers: {
          "x-auth-token": token
        }
      });
      commit("logInUser", {
        user: response.data,
        token: token
      })
    }
  }
})
