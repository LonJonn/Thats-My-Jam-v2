import Api from '@/services/Api'

export default {
  fetchPosts () {
    return Api().get('posts') // return result from server
  },

  addPost (params) {
    return Api().post('add_post', params) // return result from server
  },

  updatePost (params) {
    return Api().put('posts/' + params.id, params)  // return result from server
  },

  getPost (params) {
    return Api().get('post/' + params.id) // return result from server
  },

  deletePost (id) {
    return Api().delete('posts/' + id)  // return result from server
  }
}
