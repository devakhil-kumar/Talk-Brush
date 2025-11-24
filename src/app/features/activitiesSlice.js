import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getActivitieService, getActivitieServiceUser } from "../../apis/service";

export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getActivitieService();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchUserActivities = createAsyncThunk(
  "activities/fetchUserActivities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getActivitieServiceUser();
      console.log(response, 'response++++++++++++++++++++++++++++')
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const activitiesSlice = createSlice({
  name: "activities",
  initialState: {
    loading: false,
    error: null,
    activities: [],
    notifications: [],
    count: {
      total: 0,
      notifications: 0,
      activities: 0,
    },

    userloading: false,
    success: false,
    count: 0,
    data: [],
    user: null,
    error: null,

  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchActivities.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.count;                  // store count
        state.notifications = action.payload.data.notifications;
        state.activities = action.payload.data.activities;    // store list
      })

      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load data"
      })

       .addCase(fetchUserActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.count = action.payload.count;
        state.data = action.payload.data; 
        // state.user = action.payload.user; // user info
      })
      .addCase(fetchUserActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default activitiesSlice.reducer;
