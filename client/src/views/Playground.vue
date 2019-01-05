<template>
  <div>
    <h1>Playground</h1>Sugoi woi woi!!
    <br>
    <br>
    <Files/>
    <VideoDownloader/>
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
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
a {
  color: #4d7ef7;
  text-decoration: none;
}

a.button {
  display: block;
  color: #f2f2f2;
  background-color: #4d7ef7;
  border-radius: 3px;
  width: 90px;
  margin: 10px auto 0;
  padding: 5px 0;
}

input {
  padding: 4px;
  margin-bottom: 5px;
}
</style>
