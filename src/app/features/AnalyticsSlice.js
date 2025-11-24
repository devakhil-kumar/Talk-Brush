import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetAnalyticsData } from '../../apis/service';

export const GetAnalyticsScreenData = createAsyncThunk(
    'talkBrush/analyticsData',
    async (periodValue, { rejectWithValue }) => {
        try {
            console.log('Fetching analytics for period:', periodValue);
            const response = await GetAnalyticsData(periodValue);
            console.log("Analytics Data from API:", response);
            return response;
        } catch (error) {
            console.log('Error from slice:', error.message);
            return rejectWithValue(error.message || 'Failed to fetch analytics data');
        }
    }
);

const initialState = {
    analyticsData: {
        data: [],
        activeUsers: 0,
        inactiveUsers: 0,
        totalUsers: 0
    },
    loading: false,
    error: null,
};

const GetAnalyticsChartData = createSlice({
    name: 'analyticsData',
    initialState,
    reducers: {
        resetAnalyticsData: (state) => {
            state.analyticsData = initialState.analyticsData;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetAnalyticsScreenData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetAnalyticsScreenData.fulfilled, (state, action) => {
                state.loading = false;
                state.analyticsData = action.payload || initialState.analyticsData;
                state.error = null;
            })
            .addCase(GetAnalyticsScreenData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            });
    }
});

export const { resetAnalyticsData } = GetAnalyticsChartData.actions;
export default GetAnalyticsChartData.reducer;