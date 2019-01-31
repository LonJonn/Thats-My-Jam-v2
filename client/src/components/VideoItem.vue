<template>
  <div>
    Title: {{ videoObj.title }} <br />
    <img :src="videoObj.albumArt" width="80" /> <br />
    Artist: {{ videoObj.artist }} <br />
    Size: {{ videoObj.size }} Mb <br />
    length: {{ getRuntime(videoObj.length) }} <br />
    <br />
    <a :href="'http://youtube.com/watch?v=' + videoObj.videoId">Youtube</a> -
    <a :href="rootUrl + videoObj._id + '.mp4'">open video</a> -
    <a :href="rootUrl + videoObj._id + '.jpg'">open img</a> -
    <a class="has-text-danger" @click="deleteVideo(videoObj._id)">delete</a> |
    <a class="has-text-info" @click="redownload(videoObj)"> redownload </a>
    <hr />
  </div>
</template>

<script>
import VideosService from "../services/VideosService";
import swal from "sweetalert2";
import moment from "moment";
import momentDurFor from "moment-duration-format";
momentDurFor(moment);

export default {
  name: "VideoItem",
  props: {
    videoObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rootUrl: "http://localhost:8081/files/"
    };
  },
  methods: {
    getRuntime: function(length) {
      return moment
        .duration(length, "s")
        .format("h [hour] m [min] s [second]", { trim: "both small" });
    },

    deleteVideo: async function(videoId) {
      let result = await swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        customClass: "swal2-confirm-custom"
      });

      if (!result.value) return;

      let errMsg;
      try {
        await VideosService.deleteVideo(videoId);
      } catch (error) {
        errMsg = error.response.data.split("\n");
      }

      if (!errMsg) {
        swal({
          title: "Video Deleted!",
          type: "success",
          toast: true,
          position: "top-end",
          timer: 4000,
          showConfirmButton: false
        });
        return this.$emit("refreshList");
      }

      if (errMsg[1] == "Files missing on server.") {
        result = await swal({
          title: "Files missing on server.",
          text: "Do you want to remove the video anyways?",
          type: "error",
          showCancelButton: true,
          confirmButtonText: "Do it!",
          customClass: "swal2-confirm-custom"
        });

        if (!result.value) return;

        await VideosService.deleteVideoForced(videoId);
        return this.$emit("refreshList");
      }

      swal({
        title: errMsg[0],
        text: errMsg[1],
        type: "error"
      });
    },

    redownload: function(metadata) {
      swal({
        title: "Download Starting...",
        type: "success",
        toast: true,
        timer: 4000,
        position: "top-end",
        showConfirmButton: false
      });
      this.$socket.emit("startVideoDownload", metadata);
    }
  }
};
</script>
