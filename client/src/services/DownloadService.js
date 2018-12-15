import axios from "axios";
import Api from "../services/Api";

export default {
  save(url, file, name) {
    axios({
      url: url + file,
      method: "GET",
      responseType: "blob"
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name || file);
      document.body.appendChild(link);
      link.click();
    });
  },
  checkLink(params) {
    return Api().post("jammify/check_link", params);
  }
};
