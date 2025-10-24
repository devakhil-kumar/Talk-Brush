import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../app/features/authSlice';
import messageReducer from '../app/features/messageSlice';

const store = configureStore({
    reducer: {
        auth: authReducer ,
        message: messageReducer ,
    }
})

export default store;