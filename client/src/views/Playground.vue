<template>
  <div>
    <section class="section">
      <div class="container">
        <VideoDownloader />
        <br />
        <Videos />
      </div>
    </section>
  </div>
</template>

<script>
import VideoDownloader from "@/components/VideoDownloader.vue";
import Videos from "@/components/Videos.vue";

export default {
  name: "playground",
  components: {
    VideoDownloader,
    Videos
  },
  created() {
    this.$Progress.start();
  },
  mounted() {
    this.$Progress.finish();
  }
};
</script>
