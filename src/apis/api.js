import axios from 'axios';
import { API_ROUTES } from './constant';
import { getUserData } from '../units/asyncStorageManager';

const BASE_URL = "https://talkbrush.com/api/"


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


export const getUsersAPI = (page = 1, filters = null) => {
  if (!filters) {
    return axiosInstance.get(
      `${API_ROUTES.USER_LIST}&page=${page}&limit=20`
    );
  }
  const {
    sortBy = filters.sortBy,
    sortOrder = filters.sortOrder,
  } = filters;

  return axiosInstance.get(
    `${API_ROUTES.USER_LIST}&page=${page}&limit=20&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
};



export const deleteUserAPI = (id) => {
  return axiosInstance.delete(`${API_ROUTES.USER_DELETE}`, {
    data: { ids: [id] }
  });
};

export const editUserAPI = (eventId, eventdata) => {
  return axiosInstance.put(`${API_ROUTES.USER_EDIT}${eventId}`, eventdata)
}

export const getEventAPI = (page = 1) => {
  return axiosInstance.get(`${API_ROUTES.EVENT_LIST}&page=${page}&limit=20`);
};

export const getProfileAPI = () => {
  return axiosInstance.get(`${API_ROUTES.PROFILE}`)
}

export const editProfileAPI = (formdata) => {
  return axiosInstance.put(`${API_ROUTES.EDIT_PROFILE}`, formdata)
}

export const addEventAPI = (eventdata) => {
  return axiosInstance.post(`${API_ROUTES.ADD_EVENT}`, eventdata)
}

export const updateEventAPI = (eventId, eventdata) => {
  return axiosInstance.put(`${API_ROUTES.UPDATE_EVENT}${eventId}`, eventdata);
};

export const deleteEventAPI = (eventId) => {
  return axiosInstance.delete(`${API_ROUTES.DELETE_EVENT}${eventId}`);
}

export const getactivities = () => {
  return axiosInstance.get(`${API_ROUTES.ACTIVITIESADMIN}`);
};

export const GetChartData = (typeValue) => {
  return axiosInstance.get(API_ROUTES.DASHBORADAPI, {
    params: {
      type: typeValue
    }
  })
}

export const GetAnalyticsScreenData = (periodValue) => {
    return axiosInstance.get(API_ROUTES.ANALYTICSDATA, {
  params: {
    period: periodValue  
  }
});
};

export const getUserActivities = () => {
  return axiosInstance.get(`${API_ROUTES.ACTIVITIESUSER}`);
};

export const ResetPassword = (email) => {
  console.log("Email :", email);
  return axiosInstance.post(API_ROUTES.RESETPASSWORD, {
    email: email
  });
}
 
export const VerifyResetCode = (data) => {
  console.log("Data :", data);
  return axiosInstance.post(API_ROUTES.RESETCODE, {
    "email": data?.email,
    "code": data?.code,
    "newPassword": data?.newPassword
  });
}


export const Create_Room = (RoomId) => {
  return axiosInstance.post(API_ROUTES.CREATE_ROOM, RoomId)
}

export const getCreateCode = () => {
  return axiosInstance.get('https://talkbrush.com/accent/create_room')
}

export const getRoomDetailsAPI = (roomCode) => {
  return axiosInstance.get(`${API_ROUTES.GET_ROOM_DETAILS}${roomCode}/info`)
}

export const leaveRoomAPI = (roomCode) => {
  return axiosInstance.post(API_ROUTES.LEAVE_ROOM, { room_code: roomCode })
}
