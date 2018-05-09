<template>
  <div>
    <input type="text" name="file" id="file" placeholder="file.txt" v-model='file'>
    <br>
    <input type="text" name="name" id="name" placeholder="name to save as" v-model='name'>
    <br>
    <a @click='downloadFile(file, name)' href="#">Download</a>
    <br><br>
    <div v-if="!loadingFiles" v-for="file in filesList" :key="file">
      <span>
        <td>{{ file }}</td>
        <a :href="'http://localhost:8081/files/'+file"> open</a>
      </span>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import PostsService from '@/services/PostsService'
import DownloadService from '@/services/DownloadService'
import FilesService from '@/services/FilesService'
import { setInterval } from 'timers';

export default {
  name: 'posts',
  data () {
    return {
      posts: [],
      file: '',
      loadingFiles: true,
      name: '',
      filesList: []
    }
  },
  mounted () {
    this.getPosts()
    this.getFiles()
    // setInterval(() => {
    //   this.getFiles()
    // }, 5000)
  },
  methods: {
    async getPosts () {
      const response = await PostsService.fetchPosts()  // wait for response from api to get all posts
      this.posts = response.data.posts  // set array to response array
    },
    async getFiles () {
      const response = await FilesService.fetchFiles()
      if (response.status !== 304) this.filesList = response.data
      this.loadingFiles = false
    },
    async downloadFile (file, name) {
      let nameFixed
      if (name) nameFixed = name + '.' + file.split('.')[1]
      await DownloadService.save('http://localhost:8081/files/', file, nameFixed)
    },
    async deletePost (id) {
      const $this = this
      $this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then(function (result) {
        if (result.value) { // if confirmed
          PostsService.deletePost(id) // delete post with id from get() for specific post
          $this.$router.go({ path: '/' }) // navigate back to home page (uses go because it is already on home page)
        }
      })
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
a.add_post_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
</style>
