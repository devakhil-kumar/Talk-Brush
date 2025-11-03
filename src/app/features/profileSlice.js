import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { editProfileService, getProfileService } from '../../apis/service';

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getProfileService();
            return data?.user || {};
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const data = await editProfileService(formData);
            console.log(formData, 'data==================')
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        user: null,
        loading: false,
        error: null,
        updateLoading: false,
        updateError: null,
        updateSuccess: null
    },
    reducers: {
        resetUpdateState: state => {
            state.updateLoading = false;
            state.updateError = null;
            state.updateSuccess = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchProfile.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateProfile.pending, state => {
                state.updateLoading = true;
                state.updateError = null;
                state.updateSuccess = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.user = action.payload.user;
                state.updateSuccess = action.payload.message;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
                state.updateSuccess = false;
            });
    }
});

export const { resetUpdateState } = profileSlice.actions;
export default profileSlice.reducer;
