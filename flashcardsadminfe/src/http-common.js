import axios from "axios";
import configs from "./configs"

export default axios.create({
  baseURL: configs.flashcardsadminbe,
  headers: {
    "Content-type": "application/json"
  }
});
