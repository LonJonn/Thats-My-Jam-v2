<template>
  <div>
    <section class="section">
      <div class="container">
        <div v-if="$route.params.requiresAuth">You need to log in</div>
        <Users />
      </div>
    </section>
  </div>
</template>

<script>
import Users from "@/components/Users.vue";

export default {
  name: "login",
  components: {
    Users
  },
  created() {
    this.$Progress.start();
  },
  mounted() {
    this.$Progress.finish();
  }
};
</script>
