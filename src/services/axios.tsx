// src/services/api.js
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'https://api.apecglobal.net/api/v1'
console.log('🔧 Axios baseURL:', baseURL)

const apiAxiosInstance = axios.create({
  baseURL: baseURL
});


apiAxiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("cmsToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiAxiosInstance;

//https://apec-global-backend.vercel.app
//https://apec-global-backend.onrender.com
//http://192.168.1.71:5000/api/v1 máy a Long
