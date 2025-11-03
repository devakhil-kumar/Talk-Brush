import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteUserService } from '../../apis/service'

export const deleteUser = createAsyncThunk(
    "userDelete/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            await deleteUserService(userId);
            return userId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userDeleteSlice = createSlice({
    name: "userDelete",
    initialState: {
        loading: false,
        error: null,
        lastDeletedId: null,
    },

    reducers: {
        resetDeleteState: (state) => {
            state.loading = false;
            state.error = null;
            state.lastDeletedId = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.lastDeletedId = action.payload;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetDeleteState } = userDeleteSlice.actions;
export default userDeleteSlice.reducer;
