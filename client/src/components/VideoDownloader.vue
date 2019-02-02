<template>
  <div>
    <p class="subtitle">Video Downloader</p>
    <input placeholder="Enter your link here!" v-model="link" /><br />
    <input placeholder="Title!" v-model="title" /><br />
    <input placeholder="Artist!" v-model="artist" /><br />
    <input placeholder="Album Art!" v-model="alternateAlbumArt" /><br /><br />
    <a @click="downloadVideo" class="button">Download</a>
    <div v-show="searching"><br />Getting Info...</div>
    <div id="downloadInfo">
      <h4>Download Info.</h4>
      <div v-if="!downloadInfo">No active downloads.</div>
      <div v-else>
        <b>Current Download:</b> {{ downloadInfo.filename }} <br />
        <b>Downloaded:</b> {{ downloadInfo.downloaded }} /
        {{ downloadInfo.size }} mb <br />
        <progress max="100" :value="downloadInfo.percentage"></progress>
        {{ downloadInfo.percentage }}%
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import VideosService from "../services/VideosService";

export default {
  name: "VideoDownloader",
  data() {
    return {
      link: "",
      title: "",
      artist: "",
      alternateAlbumArt: "",
      searching: false,
      downloadInfo: null
    };
  },
  sockets: {
    downloadFinished: function() {
      swal({
        title: "Download Finished!",
        type: "success",
        toast: true,
        position: "top-end",
        timer: 4000,
        showConfirmButton: false
      });
      this.downloadInfo = null;
    },

    downloadInfo: function(info) {
      this.downloadInfo = info;
    }
  },

  methods: {
    downloadVideo: async function() {
      this.searching = true;
      try {
        const filtered = this.pick(this, [
          "link",
          "title",
          "artist",
          "alternateAlbumArt"
        ]);
        const response = await VideosService.downloadVideo(filtered);

        swal({
          title: "Download Starting...",
          type: "success",
          toast: true,
          timer: 4000,
          position: "top-end",
          showConfirmButton: false
        });

        this.$socket.emit("startVideoDownload", response.data);
      } catch (error) {
        const errMsg = error.response.data.split("\n");
        swal({
          title: errMsg[0],
          text: errMsg[1],
          type: "error"
        });
      }
      this.searching = false;
      this.link = "";
      this.title = "";
      this.artist = "";
      this.alternateAlbumArt = "";
    },

    pick: function(object, array) {
      let filtered = {};
      array.forEach(item => {
        if (object[item]) filtered[item] = object[item];
      });
      return filtered;
    }
  }
};
</script>
