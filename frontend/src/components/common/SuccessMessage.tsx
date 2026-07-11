import React from 'react';
import { Alert, Box } from '@mui/material';

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
  autoCloseDuration?: number;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
  autoCloseDuration = 6000,
}) => {
  React.useEffect(() => {
    if (autoCloseDuration && onClose) {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoCloseDuration, onClose]);

  return (
    <Box mb={2}>
      <Alert
        severity="success"
        onClose={onClose}
        variant="filled"
      >
        {message}
      </Alert>
    </Box>
  );
};
