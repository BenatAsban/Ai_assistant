import { configureStore } from '@reduxjs/toolkit';
import interactionReducer from './slices/interactionSlice';
import uiReducer from './slices/uiSlice';
import chatReducer from './slices/chatSlice';
import hcpReducer from './slices/hcpSlice';

export const store = configureStore({
  reducer: {
    interaction: interactionReducer,
    ui: uiReducer,
    chat: chatReducer,
    hcp: hcpReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
