import React from 'react';
import { Box, Grid } from '@mui/material';
import { InteractionForm } from '../forms/InteractionForm';
import { ChatPanel } from '../ai-chat/ChatPanel';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { SuccessMessage } from '../common/SuccessMessage';
import { setSuccess, clearMessages } from '../../redux/slices/uiSlice';

export const LogInteraction: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { success, error } = useSelector((state: RootState) => state.ui);
  const [formData, setFormData] = React.useState<any>(null);

  const handleDataExtracted = (data: any) => {
    if (data) {
      setFormData(data);
    }
  };

  return (
    <Box>
      {success && (
        <SuccessMessage
          message={success}
          onClose={() => dispatch(clearMessages())}
        />
      )}

      <Grid container spacing={3}>
        {/* Form */}
        <Grid item xs={12} md={6}>
          <InteractionForm initialData={formData} />
        </Grid>

        {/* Chat Panel */}
        <Grid item xs={12} md={6}>
          <ChatPanel onDataExtracted={handleDataExtracted} />
        </Grid>
      </Grid>
    </Box>
  );
};
