import React from 'react';
import {
  Paper,
  Box,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, addUserMessage, clearChat } from '../../redux/slices/chatSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ChatPanelProps {
  onDataExtracted?: (data: any) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onDataExtracted }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading, lastResponse } = useSelector((state: RootState) => state.chat);
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    dispatch(addUserMessage(inputValue));
    setInputValue('');

    try {
      await dispatch(sendChatMessage(inputValue)).unwrap();
      if (lastResponse) {
        onDataExtracted?.(lastResponse.extracted_data);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleClearChat = () => {
    dispatch(clearChat());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">AI Assistant</Typography>
        <IconButton size="small" onClick={handleClearChat} title="Clear chat">
          <ClearIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="textSecondary">
              Start typing to log an HCP interaction using natural language.
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: '85%',
                  backgroundColor: message.role === 'user' ? '#1976d2' : '#f5f5f5',
                  color: message.role === 'user' ? 'white' : 'black',
                }}
              >
                <Typography variant="body2">{message.content}</Typography>
                {message.extracted_data && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {message.extracted_data.sentiment && (
                      <Chip
                        label={`Sentiment: ${message.extracted_data.sentiment}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}
              </Paper>
            </Box>
          ))
        )}
        {loading && <LoadingSpinner message="AI is thinking..." />}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          minRows={1}
          placeholder="Type your interaction notes here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          size="small"
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={loading || !inputValue.trim()}
          color="primary"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};
