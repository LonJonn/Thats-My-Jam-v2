<template>
  <div>
    <u>
      <h3>files</h3>
    </u>
    <div v-if="loadingFiles">Loading...</div>
    <div v-else-if="filesList.length === 0">No Downloads...</div>
    <div v-else v-for="(file, index) in filesList" :key="index">
      <span>
        <td>{{ file }}</td>-
        <a :href="'http://localhost:8081/files/'+file">open</a> |
        <a href="#" @click="downloadFile(file)">download</a> -
        <a href="#" style="color:#f44336" @click="deleteFile(file)">delete</a>
      </span>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import DownloadService from "../services/DownloadService";
import FilesService from "../services/FilesService";

export default {
  name: "Files",
  data() {
    return {
      loadingFiles: true,
      filesList: []
    };
  },
  mounted() {
    this.getFiles();
  },
  sockets: {
    downloadFinished: function() {
      this.getFiles();
    }
  },
  methods: {
    async getFiles() {
      const response = await FilesService.fetchFiles();
      this.filesList = response.data;
      this.loadingFiles = false;
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

    deleteFile(file) {
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
          await FilesService.deleteFile(file);
          swal({
            title: "File Deleted!",
            type: "success",
            toast: true,
            position: "top-start",
            timer: 4000,
            showConfirmButton: false
          });
          this.getFiles();
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>