import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FlightLand, LocalShipping } from '@mui/icons-material';

function CreateRequest() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    originCountry: '',
    destinationCountry: '',
    weight: '',
    size: 'small',
    offerPrice: '',
    urgency: 'standard'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Connect to Firebase to save the request
    console.log('Submitting request:', formData);
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FlightLand color="primary" sx={{ mr: 2 }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            Create New Shipping Request
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Origin Country</InputLabel>
                <Select
                  name="originCountry"
                  value={formData.originCountry}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="USA">United States</MenuItem>
                  <MenuItem value="UK">United Kingdom</MenuItem>
                  <MenuItem value="UAE">United Arab Emirates</MenuItem>
                  <MenuItem value="CA">Canada</MenuItem>
                  <MenuItem value="JP">Japan</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Destination Country</InputLabel>
                <Select
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="PK">Pakistan</MenuItem>
                  <MenuItem value="IN">India</MenuItem>
                  <MenuItem value="BD">Bangladesh</MenuItem>
                  <MenuItem value="LK">Sri Lanka</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="small">Small (up to 5kg)</MenuItem>
                  <MenuItem value="medium">Medium (5-15kg)</MenuItem>
                  <MenuItem value="large">Large (15-30kg)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Urgency</InputLabel>
                <Select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="standard">Standard (1-2 weeks)</MenuItem>
                  <MenuItem value="express">Express (3-7 days)</MenuItem>
                  <MenuItem value="urgent">Urgent (1-3 days)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Offer Price ($)"
                name="offerPrice"
                type="number"
                value={formData.offerPrice}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/dashboard')}
                  sx={{ px: 4 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  sx={{ px: 4 }}
                  startIcon={<LocalShipping />}
                >
                  Submit Request
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateRequest;