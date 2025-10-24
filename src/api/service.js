import { loginAPI, signupAPI } from "./api"

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
        console.log(response.data, 'response+++++++')
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Login failed. Please check your credentials.');
    }
};