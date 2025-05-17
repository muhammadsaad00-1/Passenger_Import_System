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
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function MyDeliveries() {
  const { currentUser } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

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
    if (tabValue === 0) return delivery.status === 'accepted' || delivery.status === 'pending';
    if (tabValue === 1) return delivery.status === 'completed' || delivery.status === 'delivered';
    return true;
  });

  const handleMarkAsDelivered = async (deliveryId) => {
    try {
      setLoading(true);
      const deliveryRef = doc(db, 'items', deliveryId);
      
      await updateDoc(deliveryRef, {
        status: 'completed',
        updatedAt: serverTimestamp()
      });

      // Update local state to reflect the change
      setDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery.id === deliveryId 
            ? { ...delivery, status: 'completed', updatedAt: new Date() } 
            : delivery
        )
      );
    } catch (error) {
      console.error('Error marking as delivered:', error);
      alert('Failed to update delivery status. Please try again.');
    } finally {
      setLoading(false);
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
        <LocalShipping color="primary" sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          My Accepted Deliveries
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Active" icon={<HourglassEmpty />} iconPosition="start" />
          <Tab label="Completed" icon={<CheckCircle />} iconPosition="start" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {filteredDeliveries.length > 0 ? (
          filteredDeliveries.map((delivery) => (
            <Grid item xs={12} key={delivery.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {delivery.itemName}
                    </Typography>
                    <Chip 
                      label={delivery.status === 'accepted' || delivery.status === 'pending' ? 'Active' : 'Completed'} 
                      color={delivery.status === 'accepted' || delivery.status === 'pending' ? 'primary' : 'default'} 
                    />
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        From
                      </Typography>
                      <Typography variant="body2">
                        {delivery.originCountry}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        To
                      </Typography>
                      <Typography variant="body2">
                        {delivery.destinationCountry}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Earnings
                      </Typography>
                      <Typography variant="body2">
                        ${delivery.offerPrice}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="body2">
                        {delivery.status}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Requester Details:
                  </Typography>
                  <Typography variant="body2">
                    Email: {delivery.userEmail}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Description: {delivery.description}
                  </Typography>
                  
                  {(delivery.status === 'accepted' || delivery.status === 'pending') && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="contained"
                        onClick={() => handleMarkAsDelivered(delivery.id)}
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Mark as Delivered'}
                      </Button>
                    </Box>
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
                  ? "You don't have any active deliveries."
                  : "You don't have any completed deliveries."}
              </Typography>
              {tabValue === 0 && (
                <Button 
                  variant="contained" 
                  href="/browse-requests"
                  startIcon={<FlightLand />}
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