
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsersService } from '../../apis/service';
import { deleteUser } from './deleteSlice';

export const fetchUsers = createAsyncThunk(
    'userList/fetchUsers',
    async (page, { rejectWithValue }) => {
        try {
            const data = await getUsersService(page);
            return { users: data?.users || [], page };
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
        hasMore: true
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
        });
    }
});


export const { resetList } = listSlice.actions;
export default listSlice.reducer;