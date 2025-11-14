// src/services/api.js
import axios from 'axios';

const apiAxiosInstance= axios.create({
  baseURL: 'https://apec-global-backend.vercel.app/api/v1', 
  
});

export default apiAxiosInstance;

//https://apec-global-backend.vercel.app/
//https://apec-global-backend.onrender.com
//http://192.168.1.71:5000/api/v1 máy a Long