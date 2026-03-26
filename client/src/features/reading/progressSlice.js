import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    lastPage: 1,
    recentActivity: [],
    loading: false,
    error: null,
};

export const fetchProgress = createAsyncThunk(
    'reading/fetchProgress',
    async (projectId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`http://localhost:5000/api/reading/progress/${projectId}`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress');
        }
    }
);

export const fetchRecentActivity = createAsyncThunk(
    'reading/fetchRecent',
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/reading/progress/recent', config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent activity');
        }
    }
);

export const saveProgress = createAsyncThunk(
    'reading/saveProgress',
    async (progressData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post('http://localhost:5000/api/reading/progress', progressData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to save progress');
        }
    }
);

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        setLocalProgress: (state, action) => {
            state.lastPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProgress.fulfilled, (state, action) => {
                state.lastPage = action.payload.last_page || 1;
            })
            .addCase(fetchRecentActivity.fulfilled, (state, action) => {
                state.recentActivity = action.payload;
            })
            .addCase(fetchProgress.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { setLocalProgress } = progressSlice.actions;
export default progressSlice.reducer;
