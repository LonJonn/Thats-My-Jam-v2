<template>
  <div>
    <section class="section">
      <div class="container"><Users /></div>
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
