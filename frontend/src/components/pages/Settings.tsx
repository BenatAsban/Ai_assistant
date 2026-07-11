import React from 'react';
import { Box, Paper, Typography, Switch, FormControlLabel, Button } from '@mui/material';

export const Settings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    enableNotifications: true,
    enableAutoSave: true,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Settings
      </Typography>

      <Paper elevation={2} sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6" mb={3}>
          Preferences
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableNotifications}
                onChange={() => handleToggle('enableNotifications')}
              />
            }
            label="Enable Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableAutoSave}
                onChange={() => handleToggle('enableAutoSave')}
              />
            }
            label="Enable Auto-Save"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
            }
            label="Dark Mode"
          />
        </Box>

        <Box mt={4}>
          <Button variant="contained" color="primary">
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
