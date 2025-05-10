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
  FormControl,
  Snackbar,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FlightLand, LocalShipping } from '@mui/icons-material';
import { collection, addDoc, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function CreateRequest() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
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
    
    if (!currentUser) {
      setError('You must be logged in to create a request');
      setOpenSnackbar(true);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create a new item document in the items collection
      const itemData = {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Convert number fields from strings to numbers
        weight: parseFloat(formData.weight),
        offerPrice: parseFloat(formData.offerPrice)
      };
      
      // Add document to items collection
      const itemRef = await addDoc(collection(db, "items"), itemData);
      
      // Add the item reference to the user's requests array
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        requests: arrayUnion({
          itemId: itemRef.id,
          itemName: formData.itemName,
          createdAt: new Date().toISOString(),
          status: 'open'
        })
      });
      
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error("Error creating request:", err);
      setError("Failed to create request: " + err.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
                disabled={loading}
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
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loading}>
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
              <FormControl fullWidth disabled={loading}>
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
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={loading}>
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
              <FormControl fullWidth disabled={loading}>
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
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/dashboard')}
                  sx={{ px: 4 }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  sx={{ px: 4 }}
                  startIcon={<LocalShipping />}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || "Request created successfully!"}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CreateRequest;