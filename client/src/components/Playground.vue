<template>
  <div>
    <h1>Playground</h1>
    this is my playground!!<br><br>
    <input type="text" name="link" id="link" placeholder="Enter your link here!" v-model='link'>
    <br>
    <a @click='downloadVideo' href="#" class="button">Download</a>
    <br>
    <h3>files</h3>
    <div v-if="!loadingFiles" v-for="file in filesList" :key="file">
      <span>
        <td>{{ file }}</td> - 
        <a :href="'http://localhost:8081/files/'+file"> open</a> |
        <a href="#" @click="downloadFile(file)">download</a> - 
        <a href="#" @click="deleteFile(file)">delete</a>
      </span>
    </div>
    <div v-else>Loading...</div>
    <div id="downloadInfo">
      <h2>Download Info.</h2>
      <div v-if="!downloadInfo.downloading">No active downloads.</div>
      <div v-else>
        <b>Current Download:</b> {{ downloadInfo.filename }} <br>
        <b>Percentage:</b> {{ downloadInfo.percentage }}% <br>
        <b>Downloaded:</b> {{ downloadInfo.downloaded }} mb <br>
        <b>Full Size:</b> {{ downloadInfo.size }} mb <br><br>
        <progress max="100" :value=downloadInfo.percentage></progress>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadService from '@/services/DownloadService'
import FilesService from '@/services/FilesService'

export default {
  name: 'playground',
  data () {
    return {
      link: '',
      loadingFiles: true,
      filesList: [],
      downloadInfo: {downloading: false}
    }
  },
  async mounted () {
    this.getFiles()
    await this.getDownloadInfo()
    if (this.downloadInfo.downloading) {
      var loadTimer = setInterval(() => {
        this.getDownloadInfo()
        if (!this.downloadInfo.downloading) {
          clearInterval(loadTimer)
          this.$swal('Great!', 'Download Complete!', 'success')
          this.getFiles()
        }
      }, 250)
    }
  },
  methods: {
    async getFiles () {
      const response = await FilesService.fetchFiles()
      if (response.status !== 304) this.filesList = response.data
      this.loadingFiles = false
    },
    async deleteFile (file) {
      const $this = this
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then(async function (result) {
        if (result.value) { // if confirmed
          await FilesService.deleteFile(file)
          $this.getFiles()
          $this.$swal({
            title: 'Bye Bye?',
            text: 'File Deleted!',
            type: 'success',
            timer: 3000
          })
        }
      })
    },
    async getDownloadInfo () {
      const response = await DownloadService.getDownloadInfo()
      this.downloadInfo = response.data
    },
    async downloadFile (file, name) {
      let nameFixed
      if (name) nameFixed = name + '.' + file.split('.')[1]
      await DownloadService.save('http://localhost:8081/files/', file, nameFixed)
    },
    async downloadVideo () {
      if (!this.downloadInfo.downloading) {
        let updateDownloadInfo = setInterval(() => {
          this.getDownloadInfo()
        }, 250)
        DownloadService.downloadVideo({
          link: this.link
        }).then(response => {
          clearInterval(updateDownloadInfo)
          this.getDownloadInfo()
          this.getFiles()
          if (response.data.invalidLink) {
            this.$swal('Bwahhh!', 'Link not found!', 'error')
          } else {
            this.$swal('Great!', 'Download Complete!', 'success')
          }
        })
      } else {
        this.$swal({
          title: 'Unable to Download!',
          text: 'Please wait for other download to finish...',
          type: 'error'
        })
      }
    }
  }
}
</script>
<style type="text/css">
.table-wrap {
  width: 60%;
  margin: 0 auto;
  text-align: center;
}
table th, table tr {
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
