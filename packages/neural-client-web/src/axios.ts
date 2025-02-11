import axios from 'axios';
import { ElMessage } from 'element-plus'


const instance = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// http request 拦截器
instance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// http response 拦截器
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const { message, status } = error.toJSON();
    if (status !== 417 && status !== 418) {
      ElMessage(message);
    }
  }
);

export default instance;
