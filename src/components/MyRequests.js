import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
  Button  // Added this import
} from '@mui/material';
import { FlightLand, LocalShipping, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function MyRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  // TODO: Replace with actual data fetching from Firebase
  useEffect(() => {
    // Mock data
    const mockRequests = [
      {
        id: '1',
        itemName: 'iPhone 14 Pro',
        status: 'pending',
        originCountry: 'USA',
        destinationCountry: 'PK',
        offerPrice: 50,
        createdAt: new Date()
      },
      {
        id: '2',
        itemName: 'Designer Handbag',
        status: 'accepted',
        originCountry: 'UK',
        destinationCountry: 'PK',
        offerPrice: 80,
        travelerName: 'John Doe',
        travelerContact: 'john@example.com',
        createdAt: new Date()
      }
    ];
    setRequests(mockRequests);
  }, []);

  const filteredRequests = requests.filter(request => {
    if (tabValue === 0) return request.status === 'pending';
    if (tabValue === 1) return request.status === 'accepted';
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FlightLand color="primary" sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          My Shipping Requests
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Pending" icon={<HourglassEmpty />} iconPosition="start" />
          <Tab label="Accepted" icon={<CheckCircle />} iconPosition="start" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Grid item xs={12} key={request.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {request.itemName}
                    </Typography>
                    <Chip 
                      label={request.status === 'pending' ? 'Pending' : 'Accepted'} 
                      color={request.status === 'pending' ? 'default' : 'primary'} 
                    />
                  </Box>
                  
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
                        Offer Price
                      </Typography>
                      <Typography variant="body2">
                        ${request.offerPrice}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="body2">
                        {request.status}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {request.status === 'accepted' && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Traveler Details:
                      </Typography>
                      <Typography variant="body2">
                        Name: {request.travelerName}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Contact: {request.travelerContact}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {tabValue === 0 
                  ? "You don't have any pending requests."
                  : "You don't have any accepted requests."}
              </Typography>
              {tabValue === 0 && (
                <Button 
                  variant="contained" 
                  href="/create-request"
                  startIcon={<LocalShipping />}
                >
                  Create New Request
                </Button>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default MyRequests;