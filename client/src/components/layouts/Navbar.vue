<template>
  <div>
    user: {{ this.$store.state.user }} <br />
    <router-link to="/">Playground</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link>
  </div>
</template>

<script>
export default {
  name: "Navbar"
};
</script>
