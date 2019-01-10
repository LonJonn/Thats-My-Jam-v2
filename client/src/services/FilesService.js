import Api from "../services/Api";

export default {
  fetchFiles() {
    return Api().get("files");
  },
  deleteFile(file) {
    return Api().delete("files/" + file);
  }
};
