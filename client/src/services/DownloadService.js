import axios from "axios";
import Api from "../services/Api";

export default {
  //remove when merging
  save(baseUrl, file, name) {
    axios({
      url: baseUrl + file,
      method: "GET",
      responseType: "blob"
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = name || file;
      link.click();
    });
  },

  checkLink(link) {
    return Api().post("videos/check", { link: link });
  }
};
