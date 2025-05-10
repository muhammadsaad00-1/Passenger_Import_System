import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, Button,
  Box, Chip, Divider, Paper, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Snackbar, Alert
} from '@mui/material';
import { FlightLand, LocalShipping } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, updateDoc, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // adjust path if needed
import countries from 'i18n-iso-countries';
import LuggageIcon from '@mui/icons-material/Luggage';
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
const countryList = Object.entries(countries.getNames("en")).map(([code, name]) => ({ code, name }));

function BrowseRequests() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({
    originCountry: '',
    destinationCountry: '',
    maxWeight: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, 'items'), where('status', '==', 'open'));
        const querySnapshot = await getDocs(q);
        const data = [];

        querySnapshot.forEach(doc => {
          const request = doc.data();
          if (request.userEmail !== currentUser?.email) {
            data.push({ id: doc.id, ...request });
          }
        });

        setRequests(data);
      } catch (err) {
        console.error('Error fetching requests from Firestore:', err);
        setSnackbar({
          open: true,
          message: 'Error loading shipping requests',
          severity: 'error'
        });
      }
    };

    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createOrFetchConversation = async (acceptorId, acceptorEmail, requestOwner, requestOwnerEmail) => {
    try {
      // Create conversation ID using sorted participant IDs for consistency
      const participantIds = [acceptorId, requestOwner].sort();
      const messageThreadId = participantIds.join('_');
      
      console.log("Creating/fetching conversation with thread ID:", messageThreadId);
      console.log("Participants:", participantIds);
      console.log("Participant emails:", [acceptorEmail, requestOwnerEmail]);
      
      // Check if conversation exists
      const convoRef = doc(db, 'messages', messageThreadId);
      const convoSnap = await getDoc(convoRef);
  
      if (!convoSnap.exists()) {
        console.log("Creating new conversation");
        await setDoc(convoRef, {
          participants: participantIds,
          participantEmails: [acceptorEmail, requestOwnerEmail],
          createdAt: serverTimestamp(),
          // Add explicit fields to help with querying
          acceptorId: acceptorId,
          acceptorEmail: acceptorEmail,
          requestOwner: requestOwner,
          requestOwnerEmail: requestOwnerEmail
        });
      } else {
        console.log("Conversation already exists");
      }
  
      // Add first message
      const messageRef = collection(db, `messages/${messageThreadId}/messages`);
      await addDoc(messageRef, {
        senderId: acceptorId,
        senderEmail: acceptorEmail,
        receiverId: requestOwner,
        receiverEmail: requestOwnerEmail,
        message: 'I have accepted your shipping request. Let\'s discuss the details.',
        timestampCreatedAt: serverTimestamp(),
      });
  
      console.log("Message sent successfully");
      return messageThreadId;
    } catch (error) {
      console.error('Error creating conversation or sending message:', error);
      throw error;
    }
  };

  const handleAcceptRequest = async (requestId, requestOwner, requestOwnerEmail) => {
    try {
      console.log("Accepting request:", requestId);
      console.log("Request owner:", requestOwner, requestOwnerEmail);
      
      const itemRef = doc(db, 'items', requestId); 
      const { uid, email } = currentUser;
  
      console.log("Current user:", uid, email);
      
      // Update the item status
      await updateDoc(itemRef, {
        status: 'accepted',
        acceptorId: uid,
        acceptorEmail: email
      });
      
      console.log("Item status updated to accepted");
  
      // Create or fetch conversation
      const threadId = await createOrFetchConversation(uid, email, requestOwner, requestOwnerEmail);
  
      // Remove from the displayed requests
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));

      // Show success message
      setSnackbar({
        open: true,
        message: 'Request accepted successfully! A conversation has been created.',
        severity: 'success'
      });

      // Optionally navigate to the chat page
      setTimeout(() => {
        navigate('/messages');
      }, 1500);
    } catch (error) {
      console.error('Error updating request status or creating conversation:', error);
      setSnackbar({
        open: true,
        message: 'Error accepting request. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const filteredRequests = requests.filter(req => {
    return (
      (!filters.originCountry || req.originCountry === filters.originCountry) &&
      (!filters.destinationCountry || req.destinationCountry === filters.destinationCountry) &&
      (!filters.maxWeight || req.weight <= parseFloat(filters.maxWeight))
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FlightLand color="primary" sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Available Shipping Requests
        </Typography>
      </Box>

      {/* Filters */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 5, 
          borderRadius: 4, 
          backgroundColor: '#f9f9f9',
          boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '0px solid rgba(0, 0, 0, 0.2)', 
                borderRadius: 2,
                p: 1,
                minWidth: 220, // Set initial width
              }}
            >
              <LuggageIcon color="primary" sx={{ mr: 1 }} />
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Origin Country</InputLabel>
                <Select
                  name="originCountry"
                  label="Origin Country"
                  value={filters.originCountry}
                  onChange={handleFilterChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    All Countries
                  </MenuItem>
                  {countryList.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '0px solid rgba(0, 0, 0, 0.2)', 
                borderRadius: 2,
                p: 1,
                minWidth: 220,
              }}
            >
              <LuggageIcon color="primary" sx={{ mr: 1 }} />
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Destination Country</InputLabel>
                <Select
                  name="destinationCountry"
                  label="Destination Country "
                  value={filters.destinationCountry}
                  onChange={handleFilterChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    All Countries
                  </MenuItem>
                  {countryList.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Max Weight (kg)"
              name="maxWeight"
              type="number"
              value={filters.maxWeight}
              onChange={handleFilterChange}
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Requests List */}
      <Grid container spacing={3}>
        {filteredRequests.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No shipping requests match your filters.
              </Typography>
            </Paper>
          </Grid>
        )}
        
        {filteredRequests.map((request) => (
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
                    onClick={() => handleAcceptRequest(request.id, request.userId, request.userEmail)}
                  >
                    Accept Delivery
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Success/Error Notification */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default BrowseRequests;