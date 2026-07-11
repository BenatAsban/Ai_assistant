import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, ChatResponse } from '../../types';
import api from '../../services/api';

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  lastResponse: ChatResponse | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  lastResponse: null,
};

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string) => {
    const response = await api.post<ChatResponse>('/chat', { message });
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      const message: ChatMessage = {
        id: `${Date.now()}`,
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(message);
    },
    addAssistantMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
      state.lastResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.lastResponse = action.payload;
        const assistantMessage: ChatMessage = {
          id: `${Date.now()}`,
          role: 'assistant',
          content: action.payload.response,
          timestamp: new Date().toISOString(),
          extracted_data: action.payload.extracted_data,
        };
        state.messages.push(assistantMessage);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const { addUserMessage, addAssistantMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
