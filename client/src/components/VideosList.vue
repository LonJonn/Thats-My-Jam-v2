<template>
  <div>
    <p class="subtitle">Videos</p>
    <div v-if="loadingVideos">loading...</div>
    <div v-else-if="videosList.length === 0">No videos...</div>
    <VideoItem
      v-else
      v-for="(video, index) in videosList"
      :key="index"
      v-bind:videoObj="video"
      v-on:refreshList="getVideos()"
    />
  </div>
</template>

<script>
import VideosService from "../services/VideosService";
import VideoItem from "../components/VideoItem";

export default {
  name: "VideosList",
  components: {
    VideoItem
  },
  data() {
    return {
      loadingVideos: true,
      videosList: []
    };
  },
  mounted() {
    this.getVideos();
  },
  sockets: {
    downloadFinished: function() {
      this.getVideos();
    }
  },
  methods: {
    getVideos: async function() {
      this.loadingVideos = true;
      const response = await VideosService.getUserVideos();
      this.videosList = response.data;
      this.loadingVideos = false;
    }
  }
};
</script>
