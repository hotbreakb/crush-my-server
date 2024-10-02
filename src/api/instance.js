import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://crash-my-server.site/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
