<template>
  <div>
    <p class="subtitle">Files</p>
    <div v-if="loadingFiles">loading...</div>
    <div v-else-if="!filesList">No Downloads...</div>
    <div v-else v-for="(file, index) in filesList" :key="index">
      {{ file }} - <a :href="'http://localhost:8081/files/' + file">open</a> |
      <a @click="downloadFile(file)">download</a> -
      <a style="color:#f44336" @click="deleteFile(file)">delete</a>
    </div>
  </div>
</template>

<script>
import DownloadService from "../services/DownloadService";
import FilesService from "../services/FilesService";
import swal from "sweetalert2";

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
    getFiles: async function() {
      const response = await FilesService.fetchFiles();
      this.filesList = response.data;
      this.loadingFiles = false;
    },

    downloadFile: function(file, name) {
      let nameFixed;
      if (name) nameFixed = name + "." + file.split(".")[1];
      DownloadService.save("http://localhost:8081/files/", file, nameFixed);
    },

    deleteFile: function(file) {
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
