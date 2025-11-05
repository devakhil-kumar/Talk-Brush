import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addEventService, deleteEventService, getEventService, updateEventService } from '../../apis/service';

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

export const addEvent = createAsyncThunk(
    'eventList/addEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const res = await addEventService(eventData);
            return res;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to Add Event");
        }
    }
);

export const updateEvent = createAsyncThunk(
    'eventList/updateEvent',
    async ({ eventId, eventData }, { rejectWithValue }) => {
        try {
            const res = await updateEventService(eventId, eventData);
            console.log(res, 'res++++++++')
            return { eventId, ...res };
        } catch (error) {
            return rejectWithValue(error.message || "Failed to Update Event");
        }
    }
);

export const deleteEvent = createAsyncThunk(
    'eventList/deleteEvent',
    async (eventId, { rejectWithValue }) => {
        try {
            await deleteEventService(eventId);
            return eventId
        } catch (error) {
            return rejectWithValue(error?.message || "Failed to Delete Event");
        }
    }
)

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
        addLoading: false,
        addSuccess: false,
        addError: null,
        updateLoading: false,
        updateSuccess: false,
        updateError: null,
        deleteLoading: false,
        deleteError: null,
        lastdeleteEvent: null
    },
    reducers: {
        resetEventList: state => {
            state.list = [];
            state.todayslist = [];
            state.page = 1;
            state.totalPages = 1;
            state.totalEvents = 0;
            state.hasMore = true;
        },
        resetAddEventState: state => {
            state.addLoading = false;
            state.addError = null;
            state.addSuccess = false;
        },
        resetUpdateEventState: state => {
            state.updateLoading = false;
            state.updateError = null;
            state.updateSuccess = false;
        },
        resetDeleteEventState: state => {
            state.deleteLoading = false;
            state.deleteError = null;
            state.lastdeleteEvent = null;
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
            })

            .addCase(addEvent.pending, state => {
                state.addLoading = true;
                state.addError = null;
                state.addSuccess = false;
            })
            .addCase(addEvent.fulfilled, (state, action) => {
                state.addLoading = false;
                state.addSuccess = true;

                const newEvent = action.payload?.newEvent;
                if (newEvent) {
                    state.list.unshift(newEvent);
                }
            })
            .addCase(addEvent.rejected, (state, action) => {
                state.addLoading = false;
                state.addSuccess = false;
                state.addError = action.payload;
            })

            .addCase(updateEvent.pending, state => {
                state.updateLoading = true;
                state.updateError = null;
                state.updateSuccess = false;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.updateSuccess = true;

                const updatedEvent = action.payload?.updatedEvent;
                const eventId = action.payload?.eventId;

                if (updatedEvent && eventId) {
                    const listIndex = state.list.findIndex(event => event._id === eventId);
                    if (listIndex !== -1) {
                        state.list[listIndex] = updatedEvent;
                    }
                    const todayIndex = state.todayslist.findIndex(event => event._id === eventId);
                    if (todayIndex !== -1) {
                        state.todayslist[todayIndex] = updatedEvent;
                    }
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateSuccess = false;
                state.updateError = action.payload;
            })

            .addCase(deleteEvent.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.lastdeleteEvent = action.payload;

                state.list = state.list.filter(event => event._id !== action.payload);
                state.todayslist = state.todayslist.filter(event => event._id !== action.payload);
                state.totalEvents = Math.max(0, state.totalEvents - 1);

            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload;
            })

    }
});

export const { resetEventList, resetAddEventState, resetUpdateEventState, resetDeleteEventState } = eventSlice.actions;
export default eventSlice.reducer;