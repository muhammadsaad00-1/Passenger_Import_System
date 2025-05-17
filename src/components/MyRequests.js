import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, Box,
  Chip, Divider, Paper, Tabs, Tab, Button,
  CircularProgress, Stepper, Step, StepLabel, Alert
} from '@mui/material';
import { 
  FlightLand, LocalShipping, CheckCircle, HourglassEmpty, 
  FlightTakeoff, Flight, LocalAirport, 
  DirectionsCar, Home, AssignmentTurnedIn 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { styled } from '@mui/material/styles';

const statusSteps = [
  { label: 'Pending', value: 'pending', icon: <HourglassEmpty /> },
  { label: 'Accepted', value: 'accepted', icon: <CheckCircle /> },
  { label: 'Picked Up', value: 'picked-up', icon: <DirectionsCar /> },
  { label: 'At Origin Airport', value: 'at-origin-airport', icon: <LocalAirport /> },
  { label: 'In Flight', value: 'in-flight', icon: <Flight /> },
  { label: 'At Destination Airport', value: 'at-destination-airport', icon: <LocalAirport /> },
  { label: 'Out for Delivery', value: 'out-for-delivery', icon: <DirectionsCar /> },
  { label: 'Delivered', value: 'delivered', icon: <Home /> },
  { label: 'Completed', value: 'completed', icon: <AssignmentTurnedIn /> },
];

const GlowStepIcon = styled('div')(({ theme, active, completed }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: completed 
    ? theme.palette.success.main 
    : active 
      ? theme.palette.primary.main 
      : theme.palette.grey[300],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: completed || active ? '#fff' : theme.palette.text.secondary,
  boxShadow: active ? `0 0 10px ${theme.palette.primary.main}` : 'none',
  animation: active ? '$pulse 1.5s infinite' : 'none',
  '& svg': {
    fontSize: 16,
  },
  '@keyframes pulse': {
    '0%': {
      boxShadow: `0 0 0 0 rgba(25, 118, 210, 0.7)`,
    },
    '70%': {
      boxShadow: `0 0 0 10px rgba(25, 118, 210, 0)`,
    },
    '100%': {
      boxShadow: `0 0 0 0 rgba(25, 118, 210, 0)`,
    },
  },
}));

function MyRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [completingOrder, setCompletingOrder] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const itemsCollection = collection(db, 'items');
        const q = query(itemsCollection, where('userEmail', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        
        const requestsData = [];
        querySnapshot.forEach((doc) => {
          requestsData.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            deliveredAt: doc.data().deliveredAt?.toDate(),
            completedAt: doc.data().completedAt?.toDate()
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
    if (tabValue === 0) return !['completed', 'cancelled'].includes(request.status);
    if (tabValue === 1) return request.status === 'completed';
    return true;
  });

  const getActiveStep = (status) => {
    return statusSteps.findIndex(step => step.value === status) + 1;
  };

  const handleCompleteOrder = async (requestId) => {
    try {
      setCompletingOrder(requestId);
      const requestRef = doc(db, 'items', requestId);
      
      await updateDoc(requestRef, {
        status: 'completed',
        completedAt: serverTimestamp()
      });

      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: 'completed', completedAt: new Date() } 
            : request
        )
      );
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete order. Please try again.');
    } finally {
      setCompletingOrder(null);
    }
  };

  const CustomStepIcon = (props) => {
    const { active, completed, icon } = props;
    return (
      <GlowStepIcon active={active} completed={completed}>
        {icon}
      </GlowStepIcon>
    );
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

      <Paper elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Active" icon={<HourglassEmpty />} iconPosition="start" />
          <Tab label="Completed" icon={<CheckCircle />} iconPosition="start" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Grid item xs={12} key={request.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {request.itemName}
                    </Typography>
                    <Chip 
                      label={request.status.replace(/-/g, ' ')} 
                      color={
                        request.status === 'completed' ? 'success' : 
                        request.status === 'cancelled' ? 'error' : 'primary'
                      } 
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  
                  <Stepper 
                    activeStep={getActiveStep(request.status)} 
                    alternativeLabel 
                    sx={{ mb: 3 }}
                  >
                    {statusSteps.map((step) => (
                      <Step key={step.value}>
                        <StepLabel 
                          StepIconComponent={CustomStepIcon}
                          StepIconProps={{
                            active: step.value === request.status,
                            completed: statusSteps.findIndex(s => s.value === request.status) > 
                                        statusSteps.findIndex(s => s.value === step.value)
                          }}
                        >
                          <Typography variant="caption" sx={{ 
                            fontWeight: step.value === request.status ? 600 : 400,
                            color: step.value === request.status ? 'primary.main' : 'text.secondary'
                          }}>
                            {step.label}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        From
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {request.originCountry}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        To
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {request.destinationCountry}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Offer Price
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ${request.offerPrice}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {request.updatedAt?.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Traveler Details:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Email: {request.acceptorEmail || 'Not assigned yet'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Description: {request.description}
                  </Typography>
                  
                  {request.status === 'delivered' && (
                    <Alert 
                      severity="success" 
                      action={
                        <Button 
                          color="inherit" 
                          size="small"
                          onClick={() => handleCompleteOrder(request.id)}
                          disabled={completingOrder === request.id}
                          variant="outlined"
                          sx={{ ml: 2 }}
                        >
                          {completingOrder === request.id ? 'Completing...' : 'Confirm Delivery'}
                        </Button>
                      }
                      sx={{ mb: 2, borderRadius: 2 }}
                    >
                      Your item has been delivered! Please confirm to release payment.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {tabValue === 0 
                  ? "You don't have any active requests."
                  : "You don't have any completed requests."}
              </Typography>
              {tabValue === 0 && (
                <Button 
                  variant="contained" 
                  href="/create-request"
                  startIcon={<LocalShipping />}
                  sx={{ borderRadius: 2 }}
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