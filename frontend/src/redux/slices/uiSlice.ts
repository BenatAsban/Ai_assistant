import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  loading: boolean;
  error: string | null;
  success: string | null;
  chatPanelOpen: boolean;
  dialogOpen: boolean;
  dialogType: 'create' | 'edit' | 'view' | null;
}

const initialState: UIState = {
  loading: false,
  error: null,
  success: null,
  chatPanelOpen: true,
  dialogOpen: false,
  dialogType: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    toggleChatPanel: (state) => {
      state.chatPanelOpen = !state.chatPanelOpen;
    },
    setChatPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.chatPanelOpen = action.payload;
    },
    openDialog: (state, action: PayloadAction<'create' | 'edit' | 'view'>) => {
      state.dialogOpen = true;
      state.dialogType = action.payload;
    },
    closeDialog: (state) => {
      state.dialogOpen = false;
      state.dialogType = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  clearMessages,
  toggleChatPanel,
  setChatPanelOpen,
  openDialog,
  closeDialog,
} = uiSlice.actions;

export default uiSlice.reducer;
