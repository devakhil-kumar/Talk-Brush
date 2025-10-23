import axios from 'axios';
import { API_ROUTES } from './constant';

const BASE_URL ="https://talkbrushbackend.onrender.com/api/"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signupAPI = userData => {
    return axiosInstance.post(API_ROUTES.SIGNUP, userData)
}

export const loginAPI = userData => {
    return axiosInstance.post(API_ROUTES.LOGIN, userData)
}