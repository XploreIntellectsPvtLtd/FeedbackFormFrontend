import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:5000',
});

export default axiosInstance;