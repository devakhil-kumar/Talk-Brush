import { addEventAPI, Create_Room, deleteEventAPI, deleteUserAPI, editProfileAPI, editUserAPI, getactivities, GetAnalyticsScreenData, GetChartData, getCreateCode, getEventAPI, getProfileAPI, getRoomDetailsAPI, getUserActivities, getUsersAPI, leaveRoomAPI, loginAPI, ResetPassword, signupAPI, updateEventAPI, VerifyResetCode } from '../apis/api';

export const signupService = async userData => {
    try {
        const response = await signupAPI(userData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message ||
                error.response.data.error ||
                'Signup failed. Please try again.';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error('Signup failed. Please try again.');
        }
    }
}

export const loginService = async userData => {
    try {
        const response = await loginAPI(userData);
        return response.data;
    } catch (error) {
        console.log(error.response?.data?.message, 'resposenbchdfb')
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error;
        return Promise.reject(errorMessage);
    }
};

export const getUsersService = async (page = 1, filter = null) => {
    try {
        const response = await getUsersAPI(page, filter);
        console.log(response, 'response+++++++++++')
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch users.');
    }
};

export const deleteUserService = async (id) => {
    try {
        const response = await deleteUserAPI(id);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to delete user.');
    }
};

export const getEventService = async (page = 1) => {
    try {
        const response = await getEventAPI(page);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch users.');
    }
};

export const getProfileService = async () => {
    try {
        const response = await getProfileAPI();
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch profile.');
    }
};

export const editProfileService = async (formdata) => {
    try {
        const response = await editProfileAPI(formdata);
        return response.data
    } catch (error) {
        throw new Error(
            error?.response?.data?.message || "Failed to update profile"
        );
    }
}

export const addEventService = async (evendata) => {
    try {
        const response = await addEventAPI(evendata);
        return response.data;
    } catch (error) {
        throw new error(
            error?.response?.data?.message || "Failed to Add the Event"
        )

    }
}

export const updateEventService = async (eventId, evendata) => {
    try {
        const response = await updateEventAPI(eventId, evendata);
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message || "Failed to Update the Event"
        );
    }
};

export const deleteEventService = async (eventId) => {
    try {
        const response = await deleteEventAPI(eventId);
        return response.data
    } catch (error) {
        throw new error(
            error?.response?.data?.message || "Failed to delete the Event"
        )
    }
}

export const editUserService = async (eventId, evendata) => {
    try {
        const response = await editUserAPI(eventId, evendata);
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message || "Failed to Update the Event"
        );
    }
};

export const getActivitieService = async () => {
    try {
        const response = await getactivities();
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch users.');
    }
};

export const GetTalkChartData = async (typeValue) => {
    try {
        const response = await GetChartData(typeValue);
        return response.data
    } catch (error) {
        console.log(error.response, 'error')
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message ||
                error.response.data.error ||
                'Failed while fetching Chart Data. Please try again.';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error('Failde while fetching Chart Data. Please try again.');
        }
    }
}

export const GetAnalyticsData = async (periodValue) => {
    try {
        const response = await GetAnalyticsScreenData(periodValue);
        return response.data
    } catch (error) {
        console.log(error.response, 'error')
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message ||
                error.response.data.error ||
                'Failed while fetching Analytics Data. Please try again.';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error('Failde while fetching Analytics Data. Please try again.');
        }
    }
}

export const getActivitieServiceUser = async () => {
    try {
        const response = await getUserActivities();
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch users.');
    }
};

export const ResetPasswordService = async (email) => {
    try {
        const response = await ResetPassword(email);
        return response.data;
    } catch (error) {
        console.log(error.response, 'error')
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message ||
                error.response.data.error ||
                'Failed while Reset Password. Please try again.';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error('Failde while Reset Password. Please try again.');
        }
    }
}

export const VerifyResetCodeService = async (data) => {
    try {
        const response = await VerifyResetCode(data);
        console.log("Response from  service :", response);
        return response;
    } catch (error) {
        console.log(error.response, 'error')
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message ||
                error.response.data.error ||
                'Failed while Verify Reset Code. Please try again.';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error('Failde while Verify Reset Code. Please try again.');
        }
    }
}

export const CreateRoomTlak = async (RoomId) => {
    try {
        const response = await Create_Room(RoomId)
        return response.data
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error;
        return Promise.reject(errorMessage);
    }
}

export const getCodeGenrate = async () => {
    try {
        const response = await getCreateCode();
        console.log(response, 'response+++++')
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch profile.');
    }
};

export const getRoomDetailsService = async (roomCode) => {
    try {
        const response = await getRoomDetailsAPI(roomCode);
        return response.data;
    } catch (error) {
        console.log(error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch room details.';
        throw new Error(errorMessage);
    }
};

export const leaveRoomService = async (roomCode) => {
    try {
        const response = await leaveRoomAPI(roomCode);
        return response.data;
    } catch (error) {
        console.log(error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to leave room.';
        throw new Error(errorMessage);
    }
};