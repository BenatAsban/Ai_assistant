import React from 'react';
import { Box, Typography, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions, setPage } from '../../redux/slices/interactionSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const InteractionHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { interactions, loading, error, page, total, limit } = useSelector(
    (state: RootState) => state.interaction
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(fetchInteractions({ page, limit }));
  }, [dispatch, page, limit]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
  };

  const handleView = (id: number) => {
    navigate(`/interaction/${id}`);
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Interaction History
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>HCP Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary" py={3}>
                    No interactions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              interactions.map((interaction) => (
                <TableRow key={interaction.id}>
                  <TableCell>{interaction.hcp?.name || 'N/A'}</TableCell>
                  <TableCell>{interaction.interaction_type}</TableCell>
                  <TableCell>{interaction.date}</TableCell>
                  <TableCell>{interaction.time}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
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
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleView(interaction.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
