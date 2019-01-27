<template>
  <b-notification type="is-danger" v-if="$route.params.requiresAuth">
    You can't acces this page until you log in.
  </b-notification>
</template>

<script>
export default {
  name: "Auth"
};
</script>
