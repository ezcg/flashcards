import axios from "axios";
import configs from "../configs";

const API_AUTH_URL = configs.apiAuthUrl;

const login = (profileObj) => {
  return axios
    .post(API_AUTH_URL + "signin", profileObj)
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

let obj = {
  login,
  logout,
  getCurrentUser
}

export default obj
