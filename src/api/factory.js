import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
});

export const loginApi = (credentials) => api.post("/login", credentials);
export const fetchContentApi = () => api.get("/content");
