import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, Box,
  Chip, Divider, Paper, Tabs, Tab, Button,
  CircularProgress, Stepper, Step, StepLabel, Select, MenuItem
} from '@mui/material';
import { 
  LocalShipping, CheckCircle, HourglassEmpty, 
  FlightTakeoff, Flight, LocalAirport, 
  DirectionsCar, Home, AssignmentTurnedIn 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { styled } from '@mui/material/styles';

const statusSteps = [
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

function MyDeliveries() {
  const { currentUser } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        if (!currentUser) return;
        
        setLoading(true);
        const deliveriesRef = collection(db, 'items');
        const q = query(deliveriesRef, where('acceptorId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const deliveriesData = [];
        querySnapshot.forEach((doc) => {
          deliveriesData.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          });
        });
        
        setDeliveries(deliveriesData);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [currentUser]);

  const filteredDeliveries = deliveries.filter(delivery => {
    if (tabValue === 0) return !['completed', 'cancelled'].includes(delivery.status);
    if (tabValue === 1) return delivery.status === 'completed';
    return true;
  });

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      setUpdatingStatus(deliveryId);
      const deliveryRef = doc(db, 'items', deliveryId);
      
      await updateDoc(deliveryRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...(newStatus === 'delivered' && { deliveredAt: serverTimestamp() }),
        ...(newStatus === 'completed' && { completedAt: serverTimestamp() })
      });

      setDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery.id === deliveryId 
            ? { 
                ...delivery, 
                status: newStatus,
                updatedAt: new Date(),
                ...(newStatus === 'delivered' && { deliveredAt: new Date() }),
                ...(newStatus === 'completed' && { completedAt: new Date() })
              } 
            : delivery
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getActiveStep = (status) => {
    return statusSteps.findIndex(step => step.value === status) + 1;
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
        <LocalShipping color="primary" sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          My Accepted Deliveries
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
        {filteredDeliveries.length > 0 ? (
          filteredDeliveries.map((delivery) => (
            <Grid item xs={12} key={delivery.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {delivery.itemName}
                    </Typography>
                    <Chip 
                      label={delivery.status.replace(/-/g, ' ')} 
                      color={
                        delivery.status === 'completed' ? 'success' : 
                        delivery.status === 'cancelled' ? 'error' : 'primary'
                      } 
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  
                  <Stepper 
                    activeStep={getActiveStep(delivery.status)} 
                    alternativeLabel 
                    sx={{ mb: 3 }}
                  >
                    {statusSteps.map((step) => (
                      <Step key={step.value}>
                        <StepLabel 
                          StepIconComponent={CustomStepIcon}
                          StepIconProps={{
                            active: step.value === delivery.status,
                            completed: statusSteps.findIndex(s => s.value === delivery.status) > 
                                        statusSteps.findIndex(s => s.value === step.value)
                          }}
                        >
                          <Typography variant="caption" sx={{ 
                            fontWeight: step.value === delivery.status ? 600 : 400,
                            color: step.value === delivery.status ? 'primary.main' : 'text.secondary'
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
                        {delivery.originCountry}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        To
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {delivery.destinationCountry}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Earnings
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ${delivery.offerPrice}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {delivery.updatedAt?.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Requester Details:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Email: {delivery.userEmail}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Description: {delivery.description}
                  </Typography>
                  
                  {!['completed', 'cancelled'].includes(delivery.status) && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      backgroundColor: '#f5f5f5',
                      p: 2,
                      borderRadius: 2
                    }}>
                      <Select
                        value={delivery.status}
                        onChange={(e) => updateDeliveryStatus(delivery.id, e.target.value)}
                        disabled={updatingStatus === delivery.id}
                        sx={{ minWidth: 200 }}
                        size="small"
                      >
                        {statusSteps.map(step => (
                          <MenuItem 
                            key={step.value} 
                            value={step.value}
                            disabled={getActiveStep(delivery.status) > statusSteps.findIndex(s => s.value === step.value)}
                          >
                            {step.label}
                          </MenuItem>
                        ))}
                      </Select>
                      
                      {delivery.status === 'delivered' && (
                        <Button 
                          variant="contained"
                          onClick={() => updateDeliveryStatus(delivery.id, 'completed')}
                          disabled={updatingStatus === delivery.id}
                          endIcon={<AssignmentTurnedIn />}
                          size="small"
                          sx={{ ml: 2 }}
                        >
                          {updatingStatus === delivery.id ? 'Completing...' : 'Complete Order'}
                        </Button>
                      )}
                    </Box>
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
                  ? "You don't have any active deliveries."
                  : "You don't have any completed deliveries."}
              </Typography>
              {tabValue === 0 && (
                <Button 
                  variant="contained" 
                  href="/browse-requests"
                  startIcon={<LocalAirport />}
                  sx={{ borderRadius: 2 }}
                >
                  Browse Available Requests
                </Button>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default MyDeliveries;