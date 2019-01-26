import Api from "../services/Api";

export default {
  logInUser(userObj) {
    return Api().post("auth", userObj);
  },

  registerUser(userObj) {
    return Api().post("users", userObj);
  },

  //authed
  getUserInfo() {
    return Api().get("users/me");
  },

  usernameAvailable(username) {
    return Api().post("users/usernameAvailable", {
      username: username
    });
  }
};
