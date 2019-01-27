<template>
  <div>
    <section class="section">
      <div class="container">
        <VideoDownloader />
        <br />
        <VideosList />
      </div>
    </section>
  </div>
</template>

<script>
import VideoDownloader from "@/components/VideoDownloader.vue";
import VideosList from "@/components/VideosList.vue";

export default {
  name: "playground",
  components: {
    VideoDownloader,
    VideosList
  },
  created() {
    this.$Progress.start();
  },
  mounted() {
    this.$Progress.finish();
  }
};
</script>
