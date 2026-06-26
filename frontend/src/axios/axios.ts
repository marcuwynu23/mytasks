import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api" || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      err.message = "Network error. Please check your connection.";
    }
    return Promise.reject(err);
  }
);

export default instance;
