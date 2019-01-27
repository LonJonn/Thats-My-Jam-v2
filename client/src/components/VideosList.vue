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
      v-on:delete="deleteVideo($event)"
    />
  </div>
</template>

<script>
import VideosService from "../services/VideosService";
import VideoItem from "../components/VideoItem";
import swal from "sweetalert2";

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
    },

    deleteVideo: function(videoId) {
      swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74c3c",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      }).then(async result => {
        if (result.value) {
          await VideosService.deleteVideo(videoId);
          swal({
            title: "File Deleted!",
            type: "success",
            toast: true,
            position: "top-end",
            timer: 4000,
            showConfirmButton: false
          });
          this.getVideos();
        }
      });
    }
  }
};
</script>
