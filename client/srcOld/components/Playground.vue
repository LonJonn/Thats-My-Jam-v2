<template>
  <div>
    <h1>Playground</h1>
    Sugoi woi woi!!<br><br>
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
    <br>
    <div v-show="searching">Getting Info...</div>
    <h3>files</h3>
    <div v-if="loadingFiles">Loading...</div>
    <div v-else-if="filesList.length === 0">No Downloads...</div>
    <div
      v-else
      v-for="file in filesList"
      :key="file"
    >
      <span>
        <td>{{ file }}</td> -
        <a :href="'http://localhost:8081/files/'+file"> open</a> |
        <a
          href="#"
          @click="downloadFile(file)"
        >download</a> -
        <a
          href="#"
          style="color:#f44336"
          @click="deleteFile(file)"
        >delete</a>
      </span>
    </div>
    <div id="downloadInfo">
      <h3>Download Info.</h3>
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
import FilesService from "../services/FilesService";

export default {
  name: "playground",
  data() {
    return {
      link: "",
      loadingFiles: true,
      filesList: [],
      downloadInfo: { downloading: false },
      searching: false
    };
  },
  async mounted() {
    this.getFiles();
    await this.getDownloadInfo();
    if (this.downloadInfo.downloading) {
      var loadTimer = setInterval(() => {
        this.getDownloadInfo();
        if (!this.downloadInfo.downloading) {
          clearInterval(loadTimer);
          this.$swal({
            title: "Download Finished!",
            type: "success",
            toast: true,
            position: "top-start",
            timer: 4000,
            showConfirmButton: false
          });
          this.getFiles();
        }
      }, 500);
    }
  },
  methods: {
    async getFiles() {
      const response = await FilesService.fetchFiles();
      if (response.status !== 304) this.filesList = response.data;
      this.loadingFiles = false;
    },
    async deleteFile(file) {
      const $this = this;
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74c3c",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      }).then(async function(result) {
        if (result.value) {
          // if confirmed
          await FilesService.deleteFile(file);
          $this.getFiles();
          // $this.$swal({
          //   title: 'Bye Bye!',
          //   text: 'File Deleted!',
          //   type: 'success'
          // })
        }
      });
    },
    async getDownloadInfo() {
      const response = await DownloadService.getDownloadInfo();
      this.downloadInfo = response.data;
    },
    async downloadFile(file, name) {
      let nameFixed;
      if (name) nameFixed = name + "." + file.split(".")[1];
      await DownloadService.save(
        "http://localhost:8081/files/",
        file,
        nameFixed
      );
    },
    async downloadVideo() {
      let link = this.link;
      if (link.includes("youtube")) {
        if (!this.downloadInfo.downloading && !this.searching) {
          this.searching = true;
          let linkCheck = await DownloadService.checkLink({
            link: link
          });
          if (linkCheck.data.validLink) {
            this.searching = false;
            this.$swal({
              title: "Download Starting...",
              type: "success",
              toast: true,
              position: "top-start",
              timer: 3000,
              showConfirmButton: false
            });
            let updateDownloadInfo = setInterval(() => {
              this.getDownloadInfo();
            }, 500);
            DownloadService.downloadVideo({
              link: link
            }).then(response => {
              clearInterval(updateDownloadInfo);
              this.getDownloadInfo();
              this.getFiles();
              this.$swal({
                title: "Download Finished!",
                type: "success",
                toast: true,
                position: "top-start",
                timer: 4000,
                showConfirmButton: false
              });
            });
          } else {
            this.$swal({
              title: "Bwahhh!",
              html: "<b>Invalid Link!</b><br>Video not found...",
              type: "error"
            });
            this.searching = false;
          }
        } else {
          this.$swal({
            title: "Unable to Download!",
            text: "Please wait for other download to finish...",
            type: "error"
          });
        }
      } else {
        this.$swal("Sowwy ;(", "I only work with youtube videos...", "error");
      }
      this.link = "";
    }
  }
};
</script>

<style type="text/css">
.table-wrap {
  width: 60%;
  margin: 0 auto;
  text-align: center;
}
table th,
table tr {
  text-align: left;
}
table thead {
  background: #f2f2f2;
}
table tr td {
  padding: 10px;
}
table tr:nth-child(odd) {
  background: #f2f2f2;
}
table tr:nth-child(1) {
  background: #4d7ef7;
  color: #fff;
}
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
a.add_post_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
input {
  padding: 4px;
  margin-bottom: 5px;
}
</style>
