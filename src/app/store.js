import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../app/features/authSlice';
import messageReducer from '../app/features/messageSlice';
import userlistReducer from '../app/features/listSlice';
import userdeleteReducer from '../app/features/deleteSlice';
import eventlistReducer from '../app/features/eventSlice';
import profileReducer from '../app/features/profileSlice';
import activitesReducer from '../app/features/activitiesSlice';
import chartReducer from '../app/features/ChartSlice';
import analyticsReducer from '../app/features/AnalyticsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer ,
        message: messageReducer ,
        userlist: userlistReducer,
        userdelete: userdeleteReducer,
        eventlist: eventlistReducer,
        profile:profileReducer,
        activites:activitesReducer,
        chartData:chartReducer,
        analyticsData:analyticsReducer
    }
})

export default store;