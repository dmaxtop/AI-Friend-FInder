// src/store/slices/matchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for AI matching
export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/matches/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch matches');
    }
  }
);

export const calculateCompatibility = createAsyncThunk(
  'matches/calculateCompatibility',
  async ({ userId1, userId2 }, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/compatibility', { userId1, userId2 });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate compatibility');
    }
  }
);

const matchSlice = createSlice({
  name: 'matches',
  initialState: {
    matches: [],
    currentMatch: null,
    compatibilityScore: null,
    isLoading: false,
    error: null,
    filters: {
      ageRange: [18, 65],
      maxDistance: 50,
      minCompatibility: 60
    }
  },
  reducers: {
    setCurrentMatch: (state, action) => {
      state.currentMatch = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearMatches: (state) => {
      state.matches = [];
      state.currentMatch = null;
      state.compatibilityScore = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload.matches;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(calculateCompatibility.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(calculateCompatibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.compatibilityScore = action.payload.data.compatibilityScore;
      })
      .addCase(calculateCompatibility.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentMatch, updateFilters, clearMatches, clearError } = matchSlice.actions;
export default matchSlice.reducer;

