import Api from "../services/Api";

export default {
  downloadVideo(params) {
    return Api().post("videos", params);
  }
};
