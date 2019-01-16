<template>
  <div id="app">
    <div class="container">
      <h1 class="title">Playground</h1>
      <h2 class="subtitle">Sugoi Woi Woi</h2>
    </div>
    <router-link to="/">Playground</router-link> |
    <router-link to="/login">Login</router-link>
    <router-view />
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
export default {
  name: "app",
  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  }
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

// Set your brand colors
$purple: #8a4d76;
$pink: #fa7c91;
$brown: #757763;
$beige-light: #d0d1cd;
$beige-lighter: #eff0eb;

// Update Bulma's global variables
$grey-dark: $brown;
$grey-light: $beige-light;
$primary: $purple;
$link: $pink;

// Update some of Bulma's component variables
$body-background-color: $beige-lighter;
$control-border-width: 2px;

$colors: (
  "white": (
    $white,
    $black
  ),
  "black": (
    $black,
    $white
  ),
  "light": (
    $light,
    $light-invert
  ),
  "dark": (
    $dark,
    $dark-invert
  ),
  "primary": (
    $primary,
    $primary-invert
  ),
  "info": (
    $info,
    $info-invert
  ),
  "success": (
    $success,
    $success-invert
  ),
  "warning": (
    $warning,
    $warning-invert
  ),
  "danger": (
    $danger,
    $danger-invert
  )
);

@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
