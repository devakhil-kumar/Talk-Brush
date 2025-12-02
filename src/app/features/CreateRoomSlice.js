import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CreateRoomTlak, getCodeGenrate } from '../../apis/service'; 

export const generateCodeAndCreateRoom = createAsyncThunk(
  'room/generateCodeAndCreateRoom',
  async (_, { rejectWithValue }) => {
    try {
      const codeData = await getCodeGenrate();
      console.log('Generated code:_______________', codeData);

      
      
      const roomData = await CreateRoomTlak(codeData);
      console.log('Room created:______________', roomData);
      
      return {
        code: codeData,
        room: roomData
      };
    } catch (error) {
        console.log(error, 'error=++++++')
      return rejectWithValue(error.message || error);
    }
  }
);

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      const data = await CreateRoomTlak(roomId);
      return data;
    } catch (error) {   
      return rejectWithValue(error);
    }
  }
);

// Individual thunk for generating code (if needed separately)
export const generateCode = createAsyncThunk(
  'room/generateCode',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCodeGenrate();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to generate code');
    }
  }
);

const CreateRoomSlice = createSlice({
  name: 'room',
  initialState: {
    room: null,
    code: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRoom: (state) => {
      state.room = null;
      state.code = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Code and Create Room combined cases
      .addCase(generateCodeAndCreateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCodeAndCreateRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.code = action.payload.code;
        state.room = action.payload.room;
      })
      .addCase(generateCodeAndCreateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Room cases (individual)
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.room = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate Code cases (individual)
      .addCase(generateCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCode.fulfilled, (state, action) => {
        state.loading = false;
        state.code = action.payload;
      })
      .addCase(generateCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearRoom } = CreateRoomSlice.actions;
export default CreateRoomSlice.reducer;