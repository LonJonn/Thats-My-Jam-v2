import Api from "../services/Api";

export default {
  async logInUser(userObj) {
    return Api().post("auth", userObj);
  },
  
    registerUser(userObj) {
      return Api().post("users", userObj)
    },

  getUserInfo(JWToken) {
    return Api().get("users/me", {
      headers: {
        "x-auth-token": JWToken
      }
    })
  },

  usernameAvailable(username) {
    return Api().post("users/usernameAvailable", {
      username: username
    })
  }
};
