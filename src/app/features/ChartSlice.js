import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetTalkChartData } from '../../apis/service';

export const GetTalkBrushChart = createAsyncThunk(
    'talkBrush/chartData',
    async (typeValue, { rejectWithValue }) => {
        try {
            const response = await GetTalkChartData(typeValue);
            console.log("Chart Data :", response);
            // console.log("Chart Data :", response.statistics);

            return response;
        } catch (error) {
            console.log(error.message, 'error from slice.')
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    chartData: [],
    loading: false,
    error: null,
};

const GetTalkBrushChartData = createSlice({
    name: 'chartData',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(GetTalkBrushChart.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(GetTalkBrushChart.fulfilled, (state, action) => {
            state.loading = false;
            state.chartData = action.payload;
        });
        builder.addCase(GetTalkBrushChart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export default GetTalkBrushChartData.reducer;

