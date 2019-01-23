<template>
  <div>
    <section class="section">
      <div class="container">
        <div v-if="$route.params.requiresAuth">You need to log in</div>
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
import AuthService from "../services/AuthService";

export default {
  name: "login",
  data() {
    return {
      username: "",
      password: ""
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
    }
  }
};
</script>
