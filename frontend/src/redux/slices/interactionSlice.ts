import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Interaction, PaginatedResponse } from '../../types';
import api from '../../services/api';

interface InteractionState {
  interactions: Interaction[];
  currentInteraction: Interaction | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: InteractionState = {
  interactions: [],
  currentInteraction: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,
};

export const fetchInteractions = createAsyncThunk(
  'interaction/fetchInteractions',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await api.get<PaginatedResponse<Interaction>>('/interaction', {
      params: { page, limit },
    });
    return response.data;
  }
);

export const fetchInteractionById = createAsyncThunk(
  'interaction/fetchInteractionById',
  async (id: number) => {
    const response = await api.get<Interaction>(`/interaction/${id}`);
    return response.data;
  }
);

export const createInteraction = createAsyncThunk(
  'interaction/createInteraction',
  async (data: Partial<Interaction>) => {
    const response = await api.post<Interaction>('/interaction', data);
    return response.data;
  }
);

export const updateInteraction = createAsyncThunk(
  'interaction/updateInteraction',
  async ({ id, data }: { id: number; data: Partial<Interaction> }) => {
    const response = await api.put<Interaction>(`/interaction/${id}`, data);
    return response.data;
  }
);

export const deleteInteraction = createAsyncThunk(
  'interaction/deleteInteraction',
  async (id: number) => {
    await api.delete(`/interaction/${id}`);
    return id;
  }
);

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    clearCurrentInteraction: (state) => {
      state.currentInteraction = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = action.payload.items || [];
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch interactions';
      })
      .addCase(fetchInteractionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInteraction = action.payload;
      })
      .addCase(fetchInteractionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch interaction';
      })
      .addCase(createInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions.push(action.payload);
        state.total += 1;
      })
      .addCase(createInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create interaction';
      })
      .addCase(updateInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInteraction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.interactions.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.interactions[index] = action.payload;
        }
        if (state.currentInteraction?.id === action.payload.id) {
          state.currentInteraction = action.payload;
        }
      })
      .addCase(updateInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update interaction';
      })
      .addCase(deleteInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = state.interactions.filter((i) => i.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete interaction';
      });
  },
});

export const { clearCurrentInteraction, setPage } = interactionSlice.actions;
export default interactionSlice.reducer;
