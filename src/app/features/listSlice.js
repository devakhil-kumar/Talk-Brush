
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { editUserService, getUsersService } from '../../apis/service';
import { deleteUser } from './deleteSlice';

export const fetchUsers = createAsyncThunk(
    'userList/fetchUsers',
    async ({page,filter = null}, { rejectWithValue }) => {
        try {
            const data = await getUsersService(page,filter);
            console.log(data?.user, "cbsdkfvbdfhf")
            return { users: data?.users || [], page };
        } catch (error) {
            console.log(error, 'eroorr')
            return rejectWithValue(error.message);
        }
    }
);

export const editUser = createAsyncThunk(
    'userList/editUser',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await editUserService(userId, userData);
            return { userId, updatedUser: response.data };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const listSlice = createSlice({
    name: 'userList',
    initialState: {
        list: [],
        page: 1,
        loading: false,
        error: null,
        hasMore: true,
        editLoading: false,
        editError: null
    },
    reducers: {
        resetList: state => {
            state.list = [];
            state.page = 1;
            state.hasMore = true;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUsers.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                const newUsers = action.payload.users;
                state.list = [...state.list, ...newUsers];
                state.page = action.payload.page;
                if (newUsers.length < 20) state.hasMore = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.list = state.list.filter((user) => user._id !== action.payload);
            })

            .addCase(editUser.pending, state => {
                state.editLoading = true;
                state.editError = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.editLoading = false;
                const { userId, updatedUser } = action.payload;
                const index = state.list.findIndex(user => user._id === userId);
                if (index !== -1) {
                    state.list[index] = { ...state.list[index], ...updatedUser };
                }
            })
            .addCase(editUser.rejected, (state, action) => {
                state.editLoading = false;
                state.editError = action.payload;
            });
    }
});


export const { resetList } = listSlice.actions;
export default listSlice.reducer;