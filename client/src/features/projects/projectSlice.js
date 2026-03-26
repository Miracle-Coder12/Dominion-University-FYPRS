import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    projects: [],
    currentProject: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 9,
        totalPages: 1
    },
    searchParams: {
        search: '',
        department: '',
        sort: 'desc'
    },
    loading: false,
    error: null,
};

// Async Thunks
export const fetchProjects = createAsyncThunk(
    'projects/fetchAll',
    async (params = {}, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: params // { search, department, page, limit, sort }
            };
            const response = await axios.get('http://localhost:5000/api/projects', config);
            return response.data; // { projects, pagination }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/create',
    async (formData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.post('http://localhost:5000/api/projects', formData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create project');
        }
    }
);

export const fetchProjectDetails = createAsyncThunk(
    'projects/fetchDetails',
    async (id, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch project details');
        }
    }
);

export const uploadNewVersion = createAsyncThunk(
    'projects/uploadVersion',
    async (formData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            // The formData here is expected to be { id, formData: actualFormData } based on component usage?
            // In ProjectDetails.jsx: dispatch(uploadNewVersion({ id, formData }));
            // So payload is { id, formData }
            const { id, formData: data } = formData;

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.post(`http://localhost:5000/api/projects/${id}/versions`, data, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload version');
        }
    }
);

export const extractMetadata = createAsyncThunk(
    'projects/extractMetadata',
    async (formData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.post('http://localhost:5000/api/projects/extract-metadata', formData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to extract metadata');
        }
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.projects;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Project
            .addCase(createProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProject.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Details
            .addCase(fetchProjectDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProjectDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Upload New Version
            .addCase(uploadNewVersion.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadNewVersion.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(uploadNewVersion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Extract Metadata
            .addCase(extractMetadata.pending, (state) => {
                state.loading = true;
            })
            .addCase(extractMetadata.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(extractMetadata.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
