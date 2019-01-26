<template>
  <div>
    <p class="subtitle">Videos</p>
    <div v-if="loadingVideos">loading...</div>
    <div v-else-if="videosList.length === 0">No videos...</div>
    <div v-else v-for="(video, index) in videosList" :key="index">
      Title: {{ video.title }} <br />
      <img :src="video.albumArt" width="80" /> <br />
      Artist: {{ video.artist }} <br />
      Size: {{ video.size }} Mb <br />
      length: {{ video.lengthString }} <br />
      <br />
      <a :href="'http://www.youtube.com/watch?v=' + video.videoId">Youtube</a> -
      <a :href="rootUrl + video._id + '.mp4'">open video</a> -
      <a :href="rootUrl + video._id + '.jpg'">open img</a> -
      <a style="color:#f44336" @click="deleteVideo(video._id)">delete</a>
      <hr />
    </div>
  </div>
</template>

<script>
import VideosService from "../services/VideosService";
import swal from "sweetalert2";

export default {
  name: "videos",
  data() {
    return {
      rootUrl: "http://localhost:8081/files/",
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
