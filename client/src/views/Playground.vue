<template>
  <div>
    <section class="section">
      <div class="container">
        <Files/>
        <br>
        <VideoDownloader/>
      </div>
    </section>
  </div>
</template>

<script>
import Files from "@/components/Files.vue";
import VideoDownloader from "@/components/VideoDownloader.vue";

export default {
  name: "playground",
  components: {
    Files,
    VideoDownloader
  },
  created() {
    this.$Progress.start();
  },
  mounted() {
    this.$Progress.finish();
  }
};
</script>
