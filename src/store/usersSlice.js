import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await axios.get('/api/users');
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData) => {
    const response = await axios.post('/api/users', userData);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }) => {
    const response = await axios.put(`/api/users/${id}`, userData);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id) => {
    await axios.delete(`/api/users/${id}`);
    return id;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.data.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter(user => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;