import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRoomDetailsService, leaveRoomService } from '../../apis/service';

// Async Thunks
export const getRoomDetailsThunk = createAsyncThunk(
  'room/getRoomDetails',
  async (roomCode, { rejectWithValue }) => {
    try {
      const data = await getRoomDetailsService(roomCode);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch room details');
    }
  }
);

export const leaveRoomThunk = createAsyncThunk(
  'room/leaveRoom',
  async (roomCode, { rejectWithValue }) => {
    try {
      const data = await leaveRoomService(roomCode);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to leave room');
    }
  }
);

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    roomDetails: null,
    participants: [],
    loading: false,
    error: null,
    isConnected: false,
    stats: {
      sent: 0,
      received: 0,
      latency: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRoomDetails: (state) => {
      state.roomDetails = null;
      state.participants = [];
      state.isConnected = false;
      state.stats = { sent: 0, received: 0, latency: 0 };
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    updateParticipant: (state, action) => {
      const { sid, updates } = action.payload;
      const index = state.participants.findIndex(p => p.sid === sid);
      if (index !== -1) {
        state.participants[index] = { ...state.participants[index], ...updates };
      }
    },
    addParticipant: (state, action) => {
      const existingIndex = state.participants.findIndex(
        p => p.sid === action.payload.sid
      );
      if (existingIndex === -1) {
        state.participants.push(action.payload);
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(
        p => p.sid !== action.payload
      );
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    incrementSent: (state) => {
      state.stats.sent += 1;
    },
    incrementReceived: (state) => {
      state.stats.received += 1;
    },
    setLatency: (state, action) => {
      state.stats.latency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Room Details
      .addCase(getRoomDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roomDetails = action.payload;

        // Initialize participants from room details
        const participants = [];

        // Add initiator as first participant
        if (action.payload?.initiator_id) {
          participants.push({
            username: action.payload.initiator_name,
            sid: action.payload.initiator_id,
            profile_image: action.payload.initiator_image,
            muted: true,
            hand_raised: false,
            accent: 'american',
            gender: 'male',
            is_initiator: true,
          });
        }

        // Add other members if any
        if (action.payload?.members && action.payload.members.length > 0) {
          action.payload.members.forEach(member => {
            // Don't add initiator again
            if (member.user_id !== action.payload.initiator_id) {
              participants.push({
                username: member.username,
                sid: member.user_id,
                profile_image: member.profile_image,
                muted: true,
                hand_raised: false,
                accent: 'american',
                gender: 'male',
                is_initiator: false,
              });
            }
          });
        }

        state.participants = participants;
      })
      .addCase(getRoomDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Leave Room
      .addCase(leaveRoomThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveRoomThunk.fulfilled, (state) => {
        state.loading = false;
        state.roomDetails = null;
        state.participants = [];
        state.isConnected = false;
        state.stats = { sent: 0, received: 0, latency: 0 };
      })
      .addCase(leaveRoomThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearRoomDetails,
  setParticipants,
  updateParticipant,
  addParticipant,
  removeParticipant,
  setConnectionStatus,
  updateStats,
  incrementSent,
  incrementReceived,
  setLatency,
} = roomSlice.actions;

export default roomSlice.reducer;
