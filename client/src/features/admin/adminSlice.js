import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    users: [],
    stats: null,
    logs: [],
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/admin/users', config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const fetchStats = createAsyncThunk(
    'admin/fetchStats',
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/admin/stats', config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

export const updateUserStatus = createAsyncThunk(
    'admin/updateUserStatus',
    async (userData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.patch('http://localhost:5000/api/admin/users/status', userData, config);
            return { ...userData, message: response.data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.loading = true; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u.id === action.payload.userId);
                if (index !== -1) {
                    state.users[index].status = action.payload.status;
                }
            });
    },
});

export default adminSlice.reducer;
