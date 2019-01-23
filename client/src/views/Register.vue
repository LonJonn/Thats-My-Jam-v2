<template>
  <div>
    <section class="section">
      <div class="container">
        <Auth />
        <Errors v-bind:errors="errors" />
        <p class="subtitle">Register</p>
        <input
          placeholder="username"
          @input="debouncedGetAvailable"
          v-model="username"
          type="text"
        />
        <br />
        <input placeholder="email" v-model="email" type="text" /> <br />
        <input placeholder="password" v-model="password" type="text" /> <br />
        <input v-model="isAdmin" type="checkbox" /> <br />
        <button @click="registerUser">register</button> <br />
        Available? {{ usernameAvailble }}
      </div>
    </section>
  </div>
</template>

<script>
import Errors from "../components/layouts/Errors.vue";
import AuthService from "../services/AuthService";
import _ from "lodash";

export default {
  name: "register",
  components: {
    Errors
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      isAdmin: false,
      usernameAvailble: null,
      errors: []
    };
  },
  methods: {
    registerUser: async function() {
      try {
        await AuthService.registerUser({
          username: this.username,
          email: this.email,
          password: this.password,
          isAdmin: this.isAdmin
        });
        this.errors = [];
      } catch (error) {
        this.errors = error.response.data;
      }
    },
    getAvailable: async function() {
      this.usernameAvailble = "getting...";
      if (this.username.length <= 2) {
        return (this.usernameAvailble = null);
      }
      const response = await AuthService.usernameAvailable(this.username);
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
