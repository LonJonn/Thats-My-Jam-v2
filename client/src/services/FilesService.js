import Api from '@/services/Api'

export default {
  fetchFiles () {
    return Api().get('get_files')
  },
  deleteFile (file) {
    return Api().delete('delete_file/' + file)
  }
}
