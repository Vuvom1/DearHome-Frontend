import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApiRequest } from '../../api/ApiRequests';

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'Auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApiRequest.login(credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Login failed' });
    }
  }
);

export const googleLogin = createAsyncThunk(
  'Auth/googleLogin',
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await authApiRequest.googleLogin(accessToken);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Google login failed' });
    }
  }
);

export const registerUser = createAsyncThunk(
  'Auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApiRequest.register(userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Registration failed' });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'Auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      var token = localStorage.getItem('token');
      if (token) {
      const response = await authApiRequest.logoutUser(token);
      return response.data;
      }
      
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Logout failed' });
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      
      // Google Login cases
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Google login failed';
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Logout failed';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
