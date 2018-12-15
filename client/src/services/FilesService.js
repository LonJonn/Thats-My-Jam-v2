import Api from "../services/Api";

export default {
  fetchFiles() {
    return Api().get("get_files");
  },
  deleteFile(file) {
    return Api().delete("files/delete_file/" + file);
  }
};
