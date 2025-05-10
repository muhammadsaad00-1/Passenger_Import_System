import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Box,
  Chip,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Search, FlightLand, LocalShipping } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function BrowseRequests() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({
    originCountry: '',
    destinationCountry: '',
    maxWeight: ''
  });

  // TODO: Replace with actual data fetching from Firebase
  useEffect(() => {
    // Mock data
    const mockRequests = [
      {
        id: '1',
        itemName: 'iPhone 14 Pro',
        description: 'New iPhone in original packaging',
        originCountry: 'USA',
        destinationCountry: 'PK',
        weight: 0.5,
        size: 'small',
        urgency: 'standard',
        offerPrice: 50,
        requesterId: 'user1',
        createdAt: new Date()
      },
      {
        id: '2',
        itemName: 'Designer Handbag',
        description: 'Louis Vuitton Neverfull MM',
        originCountry: 'UK',
        destinationCountry: 'PK',
        weight: 1.2,
        size: 'small',
        urgency: 'express',
        offerPrice: 80,
        requesterId: 'user2',
        createdAt: new Date()
      }
    ];
    setRequests(mockRequests);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAcceptRequest = (requestId) => {
    // TODO: Connect to Firebase to update request status
    console.log('Accepting request:', requestId);
    navigate('/my-deliveries');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FlightLand color="primary" sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Available Shipping Requests
        </Typography>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Origin Country</InputLabel>
              <Select
                name="originCountry"
                value={filters.originCountry}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Countries</MenuItem>
                <MenuItem value="USA">United States</MenuItem>
                <MenuItem value="UK">United Kingdom</MenuItem>
                <MenuItem value="UAE">United Arab Emirates</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Destination Country</InputLabel>
              <Select
                name="destinationCountry"
                value={filters.destinationCountry}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Countries</MenuItem>
                <MenuItem value="PK">Pakistan</MenuItem>
                <MenuItem value="IN">India</MenuItem>
                <MenuItem value="BD">Bangladesh</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Max Weight (kg)"
              name="maxWeight"
              type="number"
              value={filters.maxWeight}
              onChange={handleFilterChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Requests List */}
      <Grid container spacing={3}>
        {requests.map((request) => (
          <Grid item xs={12} key={request.id}>
            <Card sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {request.itemName}
                  </Typography>
                  <Chip 
                    label={`$${request.offerPrice}`} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {request.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      From
                    </Typography>
                    <Typography variant="body2">
                      {request.originCountry}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      To
                    </Typography>
                    <Typography variant="body2">
                      {request.destinationCountry}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Weight
                    </Typography>
                    <Typography variant="body2">
                      {request.weight} kg
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body2">
                      {request.size}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<LocalShipping />}
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accept Delivery
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default BrowseRequests;