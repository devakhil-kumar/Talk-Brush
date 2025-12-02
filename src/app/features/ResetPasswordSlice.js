import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ResetPasswordService,VerifyResetCodeService } from '../../apis/service';

export const ResetPassword = createAsyncThunk(
    'talkBrush/ResetPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await ResetPasswordService(email);
            console.log("Response from slice  :", response);
            return response;
        } catch (error) {
            console.log(error.message, 'error from slice.')

            return rejectWithValue(error.message);
        }
    }
);

export const VerifyResetCode = createAsyncThunk(
    'talkBrush/verifyResetCode',
    async (data, { rejectWithValue }) => {
        try {
            const response = await VerifyResetCodeService(data);
            console.log("Response from slice  :", response);
            return response.data;
        } catch (error) {
            console.log(error.message, 'error from slice.')

            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    resetPassword: {},
    resetCode: {},
    loading:false,
    error: null,
};

const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(ResetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ResetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.resetPassword = action.payload;
            })
            .addCase(ResetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(VerifyResetCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(VerifyResetCode.fulfilled, (state, action) => {
                state.loading = false;
                state.resetCode = action.payload;
            })
            .addCase(VerifyResetCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default resetPasswordSlice.reducer;

