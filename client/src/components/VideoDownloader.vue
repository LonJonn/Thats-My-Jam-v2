<template>
  <div>
    <u>
      <h3>video downloader</h3>
    </u>
    <input
      type="text"
      name="link"
      id="link"
      placeholder="Enter your link here!"
      v-model='link'
    >
    <br>
    <a
      @click='downloadVideo'
      href="#"
      class="button"
    >Download</a>
    <div v-show="searching"><br>Getting Info...</div>
    <div id="downloadInfo">
      <h4>Download Info.</h4>
      <div v-if="!downloadInfo.downloading">No active downloads.</div>
      <div v-else>
        <b>Current Download:</b> {{ downloadInfo.filename }} <br>
        <b>Downloaded:</b> {{ downloadInfo.downloaded }} / {{ downloadInfo.size }} mb<br>
        <progress
          max="100"
          :value=downloadInfo.percentage
        ></progress> {{ downloadInfo.percentage }}%
      </div>
    </div>
  </div>
</template>

<script>
import DownloadService from "../services/DownloadService";

export default {
  name: "VideoDownloader",
  data() {
    return {
      link: "",
      searching: false,
      downloadInfo: {
        downloading: false
      }
    };
  },
  sockets: {
    downloadFinished: function() {
      this.$swal({
        title: "Download Finished!",
        type: "success",
        toast: true,
        position: "top-start",
        timer: 4000,
        showConfirmButton: false
      });
      this.downloadInfo = {
        downloading: false
      };
    },
    downloadInfo: function(info) {
      this.downloadInfo = info;
    }
  },
  methods: {
    checkLink: async function() {
      this.searching = true;
      const linkCheckResult = await DownloadService.checkLink({
        link: this.link
      });
      this.searching = false;
      if (linkCheckResult.data) {
        this.$swal({
          title: "Download Starting...",
          type: "success",
          toast: true,
          position: "top-start",
          timer: 3000,
          showConfirmButton: false
        });
        return true;
      } else {
        this.$swal({
          title: "Bwahhh!",
          html: "<b>Invalid Link!</b><br>Video not found...",
          type: "error"
        });
        this.link = "";
        return false;
      }
    },
    downloadVideo: async function() {
      if (await this.checkLink()) {
        this.$socket.emit("startVideoDownload", this.link);
        this.link = "";
      }
    }
  }
};
</script>