<template>
  <div>
    <h1>Playground</h1>
    this is my playground!!<br><br>
    <input type="text" name="file" id="file" placeholder="file.txt" v-model='file'>
    <br>
    <input type="text" name="name" id="name" placeholder="name to save as" v-model='name'>
    <br>
    <a @click='downloadFile(file, name)' href="#" class="button">Download</a>
    <br>
    <h3>files</h3>
    <div v-if="!loadingFiles" v-for="file in filesList" :key="file">
      <span>
        <td>{{ file }}</td> - 
        <a :href="'http://localhost:8081/files/'+file"> open</a> |
        <a href="#" @click="downloadFile(file)">download</a>
      </span>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import DownloadService from '@/services/DownloadService'
import FilesService from '@/services/FilesService'

export default {
  name: 'playground',
  data () {
    return {
      file: '',
      loadingFiles: true,
      name: '',
      filesList: []
    }
  },
  mounted () {
    this.getFiles()
    // setInterval(() => {
    //   this.getFiles()
    // }, 5000)
  },
  methods: {
    async getFiles () {
      const response = await FilesService.fetchFiles()
      if (response.status !== 304) this.filesList = response.data
      this.loadingFiles = false
    },
    async downloadFile (file, name) {
      let nameFixed
      if (name) nameFixed = name + '.' + file.split('.')[1]
      await DownloadService.save('http://localhost:8081/files/', file, nameFixed)
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
