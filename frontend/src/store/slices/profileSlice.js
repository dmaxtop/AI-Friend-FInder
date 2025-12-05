// src/store/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for profile management
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    currentProfile: null,
    isLoading: false,
    error: null,
    interests: [],
    personalityScores: {
      openness: 5,
      conscientiousness: 5,
      extraversion: 5,
      agreeableness: 5,
      neuroticism: 5
    }
  },
  reducers: {
    clearProfile: (state) => {
      state.currentProfile = null;
      state.interests = [];
    },
    updateInterests: (state, action) => {
      state.interests = action.payload;
    },
    updatePersonalityScores: (state, action) => {
      state.personalityScores = { ...state.personalityScores, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload.profile;
        state.interests = action.payload.profile?.interests || [];
        state.personalityScores = action.payload.profile?.personality || state.personalityScores;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload.profile;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProfile, updateInterests, updatePersonalityScores, clearError } = profileSlice.actions;
export default profileSlice.reducer;
