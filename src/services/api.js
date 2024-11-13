// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Here you can process errors globally
    console.error("API call error:", error.message);
    // You can choose to display a generic message or further customize based on error type
    return Promise.reject(error);
  }
);

export default api;
