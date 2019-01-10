import Api from "../services/Api";

export default {
  async logInUser(user) {
    return Api().post("auth", {
      username: user.username,
      password: user.password
    });
  },

  getUserInfo(token) {
    return Api().get("users/me", {
      headers: {
        "x-auth-token": token
      }
    })
  },

  registerUser(user) {
    return Api().post("users", {
      username: user.username,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin
    })
  },

  usernameAvailable(username) {
    return Api().post("users/usernameAvailable", {
      username: username
    })
  }
};
