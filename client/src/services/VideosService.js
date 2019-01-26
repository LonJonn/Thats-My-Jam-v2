import Api from "../services/Api";

export default {
  getUserVideos() {
    return Api().get("users/getVideos");
  },

  getAllVideos() {
    return Api().get("videos");
  },

  getOneVideo(videoId) {
    return Api().get("videos/" + videoId);
  },

  downloadVideo(params) {
    return Api().post("videos", params);
  },

  updateVideo(videoId, params) {
    return Api().put("videos/" + videoId, params);
  },

  deleteVideo(videoId) {
    return Api().delete("videos/" + videoId);
  }
};
