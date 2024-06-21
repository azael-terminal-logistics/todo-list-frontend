import { configureStore } from '@reduxjs/toolkit';

import { alertReducer } from './alert.slice';
import { authReducer } from './auth.slice';
import { taskReducer } from './tasks.slice';

export * from './alert.slice';
export * from './auth.slice';
export * from './tasks.slice';

export const store = configureStore({
    reducer: {
        alert: alertReducer,
        auth: authReducer,
        tasks: taskReducer
    },
});