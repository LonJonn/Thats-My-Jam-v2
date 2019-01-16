<template>
  <div>
    <p class="subtitle">Users</p>
    user: {{ this.$store.state.user }} <br />
    <input v-model="username" type="text" /> <br />
    <input v-model="password" type="text" /> <br />
    <div v-if="!$store.state.user">
      <button @click="logInUser">Log in</button>
    </div>
    <div v-else><button @click="logOutUser">Log Out</button></div>
    <br />
    <br />
    <input @input="debouncedGetAvailable" v-model="regUser" type="text" />
    <br />
    <input v-model="regEmail" type="text" /> <br />
    <input v-model="regPass" type="text" /> <br />
    <input v-model="regIsAdmin" type="checkbox" /> <br />
    <button @click="registerUser">register</button> <br />
    Available? {{ usernameAvailble }}
  </div>
</template>

<script>
import AuthService from "../services/AuthService";
import _ from "lodash";

export default {
  name: "Users",
  data() {
    return {
      username: "",
      password: "",
      regUser: "",
      regEmail: "",
      regPass: "",
      regIsAdmin: false,
      usernameAvailble: null
    };
  },
  created: function() {
    this.debouncedGetAvailable = _.debounce(this.getAvailable, 500);
  },
  methods: {
    logInUser: async function() {
      try {
        const response = await AuthService.logInUser({
          username: this.username,
          password: this.password
        });
        this.$store.dispatch("fetchUser", response.data);
      } catch (error) {
        console.error(error.response.data);
      }
    },
    logOutUser: function() {
      this.$store.commit("logOutUser");
    },
    registerUser: async function() {
      try {
        const response = await AuthService.registerUser({
          username: this.regUser,
          email: this.regEmail,
          password: this.regPass,
          isAdmin: this.regIsAdmin
        });
        console.log(response);
      } catch (error) {
        console.error(error.response.data);
      }
    },
    getAvailable: async function() {
      this.usernameAvailble = "getting...";
      if (this.regUser.length <= 2) {
        this.usernameAvailble = null;
        return;
      }
      const response = await AuthService.usernameAvailable(this.regUser);
      this.usernameAvailble = response.data;
    }
  }
};
</script>
