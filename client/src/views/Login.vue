<template>
  <div>
    <section class="section">
      <div class="container">
        <Auth />
        <b-notification
          type="is-danger"
          v-for="error in errors"
          v-bind:key="error"
        >
          {{ error }}
        </b-notification>
        <p class="subtitle">Login</p>
        <input placeholder="username" v-model="username" type="text" /> <br />
        <input placeholder="password" v-model="password" type="text" /> <br />
        <div v-if="!$store.getters.isAuthed">
          <button @click="logInUser">Log in</button>
        </div>
        <div v-else><button @click="logOutUser">Log Out</button></div>
      </div>
    </section>
  </div>
</template>

<script>
import Auth from "../components/layouts/Auth.vue";
import AuthService from "../services/AuthService";

export default {
  name: "login",
  components: {
    Auth
  },
  data() {
    return {
      username: "",
      password: "",
      errors: []
    };
  },
  created() {
    this.$Progress.start();
  },
  mounted() {
    this.$Progress.finish();
  },
  methods: {
    logInUser: async function() {
      let response;

      try {
        response = await AuthService.logInUser({
          username: this.username,
          password: this.password
        });
      } catch (error) {
        return (this.errors = error.response.data);
      }

      await this.$store.dispatch("logIn", response.data);
      this.errors = [];

      const redirect = this.$route.params.redirect;
      if (redirect) this.$router.push(redirect.path);
    },
    logOutUser: function() {
      this.$store.dispatch("logOut");
    }
  }
};
</script>
