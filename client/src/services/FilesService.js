import Api from '@/services/Api'

export default {
  fetchFiles () {
    return new Promise(resolve => {
      resolve(Api().get('get_files')) // return result from server
    })
  },
  deleteFile (file) {
    return new Promise(resolve => {
      resolve(Api().delete('delete_file/' + file))
    })
  }
}
