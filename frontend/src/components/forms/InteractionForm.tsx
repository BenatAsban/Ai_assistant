import React from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useDispatch, useSelector } from 'react-redux';
import { createInteraction, updateInteraction } from '../../redux/slices/interactionSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { InteractionFormData } from '../../types';
import { setSuccess, setError } from '../../redux/slices/uiSlice';

interface InteractionFormProps {
  initialData?: Partial<InteractionFormData>;
  onSuccess?: () => void;
  isEditing?: boolean;
  interactionId?: number;
}

const interactionTypes: Array<'Call' | 'Meeting' | 'Email' | 'In-Person' | 'Virtual'> = [
  'Call',
  'Meeting',
  'Email',
  'In-Person',
  'Virtual',
];

const sentiments: Array<'Positive' | 'Neutral' | 'Negative'> = ['Positive', 'Neutral', 'Negative'];

export const InteractionForm: React.FC<InteractionFormProps> = ({
  initialData,
  onSuccess,
  isEditing = false,
  interactionId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.interaction);
  const [formData, setFormData] = React.useState<InteractionFormData>({
    interaction_type: initialData?.interaction_type || 'Meeting',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    time: initialData?.time || '09:00',
    sentiment: initialData?.sentiment || 'Neutral',
    hcp_name: initialData?.hcp_name || '',
    attendees: initialData?.attendees || '',
    topics_discussed: initialData?.topics_discussed || '',
    materials_shared: initialData?.materials_shared || '',
    samples_distributed: initialData?.samples_distributed || '',
    outcomes: initialData?.outcomes || '',
  });

  const handleChange = (field: keyof InteractionFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      interaction_type: 'Meeting',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      sentiment: 'Neutral',
      hcp_name: '',
      attendees: '',
      topics_discussed: '',
      materials_shared: '',
      samples_distributed: '',
      outcomes: '',
    });
  };

  const handleAutoSummarize = () => {
    // This will be called by the AI chat panel
    console.log('Auto-summarize triggered');
  };

  const handleSave = async () => {
    if (!formData.hcp_name?.trim()) {
      dispatch(setError('HCP Name is required'));
      return;
    }

    if (!formData.date) {
      dispatch(setError('Date is required'));
      return;
    }

    try {
      const dataToSave = {
        hcp_name: formData.hcp_name,
        interaction_type: formData.interaction_type,
        date: formData.date,
        time: formData.time,
        attendees: formData.attendees,
        topics_discussed: formData.topics_discussed,
        materials_shared: formData.materials_shared,
        samples_distributed: formData.samples_distributed,
        sentiment: formData.sentiment,
        outcomes: formData.outcomes,
      };

      if (isEditing && interactionId) {
        await dispatch(updateInteraction({ id: interactionId, data: dataToSave })).unwrap();
        dispatch(setSuccess('Interaction updated successfully'));
      } else {
        await dispatch(createInteraction(dataToSave)).unwrap();
        dispatch(setSuccess('Interaction saved successfully'));
        handleClear();
      }

      onSuccess?.();
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to save interaction'));
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" mb={3}>
        {isEditing ? 'Edit Interaction' : 'Log New Interaction'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="HCP Name"
            fullWidth
            value={formData.hcp_name}
            onChange={(e) => handleChange('hcp_name', e.target.value)}
            placeholder="Enter HCP name"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Interaction Type</InputLabel>
            <Select
              value={formData.interaction_type}
              label="Interaction Type"
              onChange={(e) => handleChange('interaction_type', e.target.value)}
            >
              {interactionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Time"
            type="time"
            fullWidth
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Attendees"
            fullWidth
            multiline
            rows={2}
            value={formData.attendees}
            onChange={(e) => handleChange('attendees', e.target.value)}
            placeholder="People involved in the interaction"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Topics Discussed"
            fullWidth
            multiline
            rows={3}
            value={formData.topics_discussed}
            onChange={(e) => handleChange('topics_discussed', e.target.value)}
            placeholder="Main discussion points"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Materials Shared"
            fullWidth
            multiline
            rows={2}
            value={formData.materials_shared}
            onChange={(e) => handleChange('materials_shared', e.target.value)}
            placeholder="Documents, links, resources shared"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Samples Distributed"
            fullWidth
            multiline
            rows={2}
            value={formData.samples_distributed}
            onChange={(e) => handleChange('samples_distributed', e.target.value)}
            placeholder="Product samples or materials provided"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Sentiment</InputLabel>
            <Select
              value={formData.sentiment}
              label="Sentiment"
              onChange={(e) => handleChange('sentiment', e.target.value)}
            >
              {sentiments.map((sentiment) => (
                <MenuItem key={sentiment} value={sentiment}>
                  {sentiment}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Outcomes"
            fullWidth
            multiline
            rows={3}
            value={formData.outcomes}
            onChange={(e) => handleChange('outcomes', e.target.value)}
            placeholder="Results and agreements from the interaction"
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
            <Button
              variant="outlined"
              startIcon={<AutoFixHighIcon />}
              onClick={handleAutoSummarize}
              disabled={loading}
            >
              AI Summarize
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
