<template>
  <div>
    <p class="subtitle">Video Downloader</p>
    <input
      type="text"
      name="link"
      id="link"
      placeholder="Enter your link here!"
      v-model="link"
    />
    <br />
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
import DownloadService from "../services/DownloadService";

export default {
  name: "videoDownloader",
  data() {
    return {
      link: "",
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
      const linkFound = (await DownloadService.checkLink(this.link)).data;
      this.searching = false;
      if (linkFound) {
        swal({
          title: "Download Starting...",
          type: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false
        });
        this.$socket.emit("startVideoDownload", this.link);
      } else {
        swal({
          title: "Bwahhh!",
          html: "<b>Invalid Link!</b><br>Video not found...",
          type: "error"
        });
      }
      this.link = "";
    }
  }
};
</script>
