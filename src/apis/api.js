import axios from 'axios';
import { API_ROUTES } from './constant';
import { getUserData } from '../units/asyncStorageManager';

const BASE_URL = "http://5.161.122.193:8000/api/"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { token } = await getUserData();  

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Token fetch error:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export const signupAPI = userData => {
  return axiosInstance.post(API_ROUTES.SIGNUP, userData)
}

export const loginAPI = userData => {
  return axiosInstance.post(API_ROUTES.LOGIN, userData)
}

export const getUsersAPI = (page = 1) => {
  return axiosInstance.get(`${API_ROUTES.USER_LIST}&page=${page}&limit=20`);
};

export const deleteUserAPI = (id) => {
  return axiosInstance.delete(`${API_ROUTES.USER_DELETE}`, {
    data: { ids: [id] }
  });
};

export const getEventAPI = (page = 1) => {
  return axiosInstance.get(`${API_ROUTES.EVENT_LIST}&page=${page}&limit=20`);
};

export const getProfileAPI = () => {
  return axiosInstance.get(`${API_ROUTES.PROFILE}`)
}

export const editProfileAPI = (formdata) => {
  return axiosInstance.put(`${API_ROUTES.EDIT_PROFILE}`, formdata)
}