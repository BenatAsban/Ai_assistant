import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { HCP } from '../../types';
import api from '../../services/api';

interface HCPState {
  hcps: HCP[];
  searchResults: HCP[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: HCPState = {
  hcps: [],
  searchResults: [],
  loading: false,
  error: null,
  searchQuery: '',
};

export const searchHCPs = createAsyncThunk(
  'hcp/search',
  async (query: string) => {
    const response = await api.get<{ results: HCP[] }>('/hcp/search', {
      params: { query, limit: 20 },
    });
    return response.data.results;
  }
);

const hcpSlice = createSlice({
  name: 'hcp',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchHCPs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchHCPs.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchHCPs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search HCPs';
      });
  },
});

export const { setSearchQuery, clearSearchResults } = hcpSlice.actions;
export default hcpSlice.reducer;
