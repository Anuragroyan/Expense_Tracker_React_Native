import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  logoutUser,
  getToken,
  getStoredUser,
} from '../../services/authService';

// REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await registerUser(
        name,
        email,
        password,
      );

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Registration failed',
      );
    }
  },
);

// LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser(email, password);

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Login failed',
      );
    }
  },
);

// CHECK AUTH
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken();

      if (!token) {
        return rejectWithValue('No token');
      }

      const user = await getStoredUser();

      if (user) {
        return user;
      }

      const currentUser = await getMe();

      return currentUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Authentication failed',
      );
    }
  },
);

// GET CURRENT USER
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getMe();

      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to get user',
      );
    }
  },
);

// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const data = await updateProfile(name, email);

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to update profile',
      );
    }
  },
);

// LOGOUT
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Logout failed',
      );
    }
  },
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    clearAuthError: state => {
      state.error = null;
    },

    clearAuth: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },

  extraReducers: builder => {
    // REGISTER
    builder
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // LOGIN
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CHECK AUTH
    builder
      .addCase(checkAuth.pending, state => {
        state.loading = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(checkAuth.rejected, state => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.isAuthenticated = false;
      });

    // GET ME
    builder
      .addCase(fetchMe.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE PROFILE
    builder
      .addCase(updateUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })

      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // LOGOUT
    builder
      .addCase(logout.pending, state => {
        state.loading = true;
      })

      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      .addCase(logout.rejected, state => {
        // Local token is removed by authService
        // even if backend logout fails.
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  clearAuthError,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;