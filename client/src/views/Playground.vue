<template>
  <div>
    <section class="section">
      <div class="container">
        <Files/>
        <br>
        <VideoDownloader/>
        <br>
        <Users/>
      </div>
    </section>
  </div>
</template>

<script>
import Files from "@/components/Files.vue";
import VideoDownloader from "@/components/VideoDownloader.vue";
import Users from "@/components/Users.vue";

export default {
  name: "playground",
  components: {
    Files,
    VideoDownloader,
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
