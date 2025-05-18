// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://booksphere-mern.onrender.com/admin",  // your backend server
  withCredentials: true,
});

export default axiosInstance;
