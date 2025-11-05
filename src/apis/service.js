import { addEventAPI, deleteEventAPI, deleteUserAPI, editProfileAPI, editUserAPI, getEventAPI, getProfileAPI, getUsersAPI, loginAPI, signupAPI, updateEventAPI } from '../apis/api';

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

export const getUsersService = async (page = 1) => {
    try {
        const response = await getUsersAPI(page);
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
        console.log(response, 'response+++++')
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
        console.log(response.data, 'response------')
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