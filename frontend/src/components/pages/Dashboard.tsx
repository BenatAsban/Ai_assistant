import React from 'react';
import { Box, Grid, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export const Dashboard: React.FC = () => {
  const { interactions, total } = useSelector((state: RootState) => state.interaction);

  const stats = [
    { label: 'Total Interactions', value: total, color: '#1976d2' },
    { label: 'This Month', value: 0, color: '#388e3c' },
    { label: 'Pending Follow-ups', value: 0, color: '#f57c00' },
    { label: 'Positive Sentiment', value: 0, color: '#7b1fa2' },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                backgroundColor: stat.color,
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" opacity={0.8}>
                {stat.label}
              </Typography>
              <Typography variant="h4" fontWeight="bold" mt={1}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Interactions */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Recent Interactions
        </Typography>
        {interactions.length === 0 ? (
          <Typography color="textSecondary">
            No interactions logged yet. Start by logging your first interaction!
          </Typography>
        ) : (
          <Box>
            {interactions.slice(0, 5).map((interaction) => (
              <Box
                key={interaction.id}
                sx={{
                  p: 2,
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {interaction.hcp?.name || 'Unknown HCP'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {interaction.interaction_type} • {interaction.date}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor:
                        interaction.sentiment === 'Positive'
                          ? '#e8f5e9'
                          : interaction.sentiment === 'Negative'
                          ? '#ffebee'
                          : '#f5f5f5',
                      color:
                        interaction.sentiment === 'Positive'
                          ? '#2e7d32'
                          : interaction.sentiment === 'Negative'
                          ? '#c62828'
                          : '#616161',
                    }}
                  >
                    {interaction.sentiment}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};
