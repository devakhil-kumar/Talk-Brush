import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEventService } from '../../apis/service';

export const fetchEvents = createAsyncThunk(
    'eventList/fetchEvents',
    async (page = 1, { rejectWithValue }) => {
        console.log('Fetching events for page:', page);
        try {
            const data = await getEventService(page);
            console.log(data, 'API Response');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const eventSlice = createSlice({
    name: 'eventList',
    initialState: {
        list: [],
        todayslist: [],
        page: 1,
        totalPages: 1,
        totalEvents: 0,
        loading: false,
        error: null,
        hasMore: true,
    },
    reducers: {
        resetEventList: state => {
            state.list = [];
            state.todayslist = [];
            state.page = 1;
            state.totalPages = 1;
            state.totalEvents = 0;
            state.hasMore = true;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchEvents.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                
                const newEvents = action.payload?.events || [];
                const todaysEvents = action.payload?.todayEvents || [];
                const currentPage = action.payload?.currentPage || 1;
                
                if (currentPage === 1) {
                    state.list = newEvents;
                    state.todayslist = todaysEvents;
                } else {
                    state.list = [...state.list, ...newEvents];
                    state.todayslist = todaysEvents;
                }
                
                state.page = currentPage;
                state.totalPages = action.payload?.totalPages || 1;
                state.totalEvents = action.payload?.totalEvents || 0;
                state.hasMore = currentPage < (action.payload?.totalPages || 1);
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetEventList } = eventSlice.actions;
export default eventSlice.reducer;