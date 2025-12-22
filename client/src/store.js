import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import projectReducer from './features/projects/projectSlice';
import progressReducer from './features/reading/progressSlice';
import annotationReducer from './features/reading/annotationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        projects: projectReducer,
        progress: progressReducer,
        annotations: annotationReducer,
    },
});
