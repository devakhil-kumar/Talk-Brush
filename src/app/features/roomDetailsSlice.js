import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRoomInfoAPI, joinRoomAPI } from '../../apis/api';

// Thunk to get room information details
export const getRoomInfoDetailsThunk = createAsyncThunk(
    'roomDetails/getRoomInfo',
    async (roomCode, { rejectWithValue }) => {
        try {
            const response = await getRoomInfoAPI(roomCode);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to get room information'
            );
        }
    }
);

// Thunk to join a room
export const joinRoomThunk = createAsyncThunk(
    'roomDetails/joinRoom',
    async (roomCode, { rejectWithValue }) => {
        try {
            const response = await joinRoomAPI(roomCode);
            console.log(response.data, 'response-------------')
            return response.data;
        } catch (error) {
            console.log(error, 'error-------------')
            return rejectWithValue(
                error.response?.data?.message || 'Failed to join room'
            );
        }
    }
);

const roomDetailsSlice = createSlice({
    name: 'roomDetails',
    initialState: {
        roomInfo: null,
        joinedRoom: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearRoomDetails: (state) => {
            state.roomInfo = null;
            state.joinedRoom = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get room info cases
            .addCase(getRoomInfoDetailsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRoomInfoDetailsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.roomInfo = action.payload;
            })
            .addCase(getRoomInfoDetailsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Join room cases
            .addCase(joinRoomThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(joinRoomThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.joinedRoom = action.payload;
            })
            .addCase(joinRoomThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearRoomDetails } = roomDetailsSlice.actions;
export default roomDetailsSlice.reducer;
