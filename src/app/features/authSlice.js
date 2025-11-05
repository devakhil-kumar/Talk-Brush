import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginService, signupService } from "../../apis/service";
import { clearUserData, getUserData, saveUserData } from "../../units/asyncStorageManager";

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await signupService(userData);
      // saveUserData(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginService(userData);
      const userType = response?.user?.type;
      if (userType === "2" || userType === "3") {
        saveUserData(response);
        return response;
      }
      return rejectWithValue("Invalid credentials");
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)


export const loadInitialState = createAsyncThunk(
  'auth/loadInitialState',
  async () => {
    try {
      const storedData = await getUserData();
      const { user, userRole, token } = storedData || {};
      return {
        user: user || null,
        userRole: userRole || null,
        token: token || null,
        isLoggedIn: !!token,
      };
    } catch (error) {
      console.error('Error in loadInitialState:', error);
      throw error;
    }
  }
);

const initialState = {
  isLoggedIn: false,
  user: null,
  userRole: null,
  loading: false,
  mainloading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      clearUserData();
      state.isLoggedIn = false;
      state.user = null;
      state.userRole = null;
      console.log('User logged out successfully.');
    },
    resetAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.userRole = action.payload.user.type;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loadInitialState.pending, (state) => {
        state.mainloading = true;
      })
      .addCase(loadInitialState.fulfilled, (state, action) => {
        state.mainloading = false;
        state.isLoggedIn = action.payload.isLoggedIn;
        state.user = action.payload.user;
        state.userRole = action.payload.userRole;
        state.token = action.payload.token;
      })
      .addCase(loadInitialState.rejected, (state) => {
        state.mainloading = false;
        state.isLoggedIn = false;
      });
  },
});

export const { logout, resetAuthError } = authSlice.actions;
export default authSlice.reducer;
