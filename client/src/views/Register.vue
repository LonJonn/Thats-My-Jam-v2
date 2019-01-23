<template>
  <div>
    <section class="section">
      <div class="container">
        <p class="subtitle">Register</p>
        <input
          placeholder="username"
          @input="debouncedGetAvailable"
          v-model="regUser"
          type="text"
        />
        <br />
        <input placeholder="email" v-model="regEmail" type="text" /> <br />
        <input placeholder="password" v-model="regPass" type="text" /> <br />
        <input v-model="regIsAdmin" type="checkbox" /> <br />
        <button @click="registerUser">register</button> <br />
        Available? {{ usernameAvailble }}
      </div>
    </section>
  </div>
</template>

<script>
import AuthService from "../services/AuthService";
import _ from "lodash";

export default {
  name: "register",
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
  methods: {
    logInUser: async function() {
      try {
        const response = await AuthService.logInUser({
          username: this.username,
          password: this.password
        });
        await this.$store.dispatch("logIn", response.data);

        const redirect = this.$route.params.redirect;
        if (redirect) this.$router.push(redirect.path);
      } catch (error) {
        console.error(error.response.data);
      }
    },
    logOutUser: function() {
      this.$store.dispatch("logOut");
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
        return (this.usernameAvailble = null);
      }
      const response = await AuthService.usernameAvailable(this.regUser);
      this.usernameAvailble = response.data;
    }
  },
  created() {
    this.$Progress.start();
    this.debouncedGetAvailable = _.debounce(this.getAvailable, 500);
  },
  mounted() {
    this.$Progress.finish();
  }
};
</script>
