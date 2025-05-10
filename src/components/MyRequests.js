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
  Button,
  CircularProgress
} from '@mui/material';
import { FlightLand, LocalShipping, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function MyRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const itemsCollection = collection(db, 'items');
        const q = query(itemsCollection, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const requestsData = [];
        querySnapshot.forEach((doc) => {
          requestsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser]);

  const filteredRequests = requests.filter(request => {
    if (tabValue === 0) return request.status === 'open';
    if (tabValue === 1) return request.status === 'assigned' || request.status === 'in-transit';
    return true;
  });

  const getStatusLabel = (status) => {
    switch(status) {
      case 'open':
        return 'Pending';
      case 'assigned':
        return 'Accepted';
      case 'in-transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open':
        return 'default';
      case 'assigned':
        return 'primary';
      case 'in-transit':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

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
          <Tab label="Active" icon={<CheckCircle />} iconPosition="start" />
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
                      label={getStatusLabel(request.status)} 
                      color={getStatusColor(request.status)} 
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
                        Weight
                      </Typography>
                      <Typography variant="body2">
                        {request.weight} kg
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {request.description && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Description:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {request.description}
                      </Typography>
                    </>
                  )}
                  
                  {(request.status === 'assigned' || request.status === 'in-transit') && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Traveler Details:
                      </Typography>
                      <Typography variant="body2">
                        Name: {request.assignedToName || 'Not specified'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Contact: {request.assignedToEmail || 'Not specified'}
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
                  : "You don't have any active requests."}
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