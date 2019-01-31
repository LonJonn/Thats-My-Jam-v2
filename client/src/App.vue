<template>
  <div id="app">
    <div class="container">
      <h1 class="title">Playground</h1>
      <h2 class="subtitle">Sugoi Woi Woi</h2>
      <Navbar />
    </div>
    <router-view />
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import Navbar from "./components/layouts/Navbar.vue";

export default {
  name: "app",
  components: {
    Navbar
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  }
};
</script>

<style lang="scss">
.swal2-confirm-custom > .swal2-actions {
  .swal2-confirm {
    background-color: #ff5252;
  }

  .swal2-cancel {
    background-color: #3085d6;
  }
}

@import "~bulma/sass/utilities/_all";

//custom styling

@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
