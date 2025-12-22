import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    annotations: [],
    loading: false,
    error: null,
};

export const fetchAnnotations = createAsyncThunk(
    'reading/fetchAnnotations',
    async (versionId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`http://localhost:5000/api/reading/annotations/${versionId}`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch annotations');
        }
    }
);

export const createAnnotation = createAsyncThunk(
    'reading/createAnnotation',
    async (annotationData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post('http://localhost:5000/api/reading/annotations', annotationData, config);
            return { ...annotationData, id: response.data.id };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create annotation');
        }
    }
);

export const addComment = createAsyncThunk(
    'reading/addComment',
    async (commentData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post('http://localhost:5000/api/reading/comments', commentData, config);
            return { ...commentData, id: response.data.id };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
        }
    }
);

const annotationSlice = createSlice({
    name: 'annotations',
    initialState,
    reducers: {
        clearAnnotations: (state) => {
            state.annotations = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnnotations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAnnotations.fulfilled, (state, action) => {
                state.loading = false;
                state.annotations = action.payload;
            })
            .addCase(fetchAnnotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAnnotation.fulfilled, (state, action) => {
                state.annotations.push(action.payload);
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const ann = state.annotations.find(a => a.id === action.payload.annotationId);
                if (ann) {
                    if (!ann.comments) ann.comments = [];
                    ann.comments.push(action.payload);
                }
            });
    },
});

export const { clearAnnotations } = annotationSlice.actions;
export default annotationSlice.reducer;
