import React from 'react';
import { Box, Paper, Typography, Button, CircularProgress, Grid, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractionById, deleteInteraction } from '../../redux/slices/interactionSlice';
import { RootState, AppDispatch } from '../../redux/store';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const InteractionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentInteraction, loading, error } = useSelector(
    (state: RootState) => state.interaction
  );

  React.useEffect(() => {
    if (id) {
      dispatch(fetchInteractionById(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      if (id) {
        await dispatch(deleteInteraction(parseInt(id)));
        navigate('/history');
      }
    }
  };

  if (loading) return <CircularProgress />;

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/history')}>Back to History</Button>
      </Box>
    );
  }

  if (!currentInteraction) {
    return (
      <Box>
        <Typography>Interaction not found</Typography>
        <Button onClick={() => navigate('/history')}>Back to History</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/history')}>
          Back
        </Button>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Interaction Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography color="textSecondary" variant="caption">
                  HCP Name
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentInteraction.hcp?.name || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography color="textSecondary" variant="caption">
                  Interaction Type
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentInteraction.interaction_type}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography color="textSecondary" variant="caption">
                  Date
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentInteraction.date}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography color="textSecondary" variant="caption">
                  Time
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentInteraction.time}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography color="textSecondary" variant="caption">
                  Sentiment
                </Typography>
                <Box mt={0.5}>
                  <Chip
                    label={currentInteraction.sentiment}
                    color={currentInteraction.sentiment === 'Positive' ? 'success' : currentInteraction.sentiment === 'Negative' ? 'error' : 'default'}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography color="textSecondary" variant="caption">
                  Topics Discussed
                </Typography>
                <Typography variant="body2" mt={0.5}>
                  {currentInteraction.topics_discussed || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography color="textSecondary" variant="caption">
                  Outcomes
                </Typography>
                <Typography variant="body2" mt={0.5}>
                  {currentInteraction.outcomes || 'N/A'}
                </Typography>
              </Grid>

              {currentInteraction.follow_ups && currentInteraction.follow_ups.length > 0 && (
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="caption">
                    Follow-up Actions
                  </Typography>
                  <Box mt={1}>
                    {currentInteraction.follow_ups.map((followUp) => (
                      <Chip
                        key={followUp.id}
                        label={followUp.action_description}
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/interaction/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
