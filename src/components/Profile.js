// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Avatar,
  Snackbar,
  Divider,
  Alert,
  IconButton,
  Fade,
  Zoom
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../models/User';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import img2 from '../assests/images/img2.jpeg';
function Profile() {
  const { currentUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      
      try {
        const user = await User.getCurrentUser();
        if (user) {
          setProfileData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      });
      setSuccess('Profile updated successfully!');
      setOpenSnackbar(true);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile: ' + error.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !editMode) {
    return (
        <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${img2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
        }}
      >
      
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    );
  }

  return (
    <Box
    sx={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${img2})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
    }}
  >
  
      <Container maxWidth="sm">
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Paper 
            elevation={8} 
            sx={{ 
              p: 4, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: 4 
            }}>
              <Box
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                sx={{ position: 'relative', mb: 2 }}
              >
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    fontSize: 40,
                    transition: 'all 0.3s',
                    transform: hover ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                {!editMode && (
                  <Fade in={hover}>
                    <IconButton
                      color="primary"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark'
                        }
                      }}
                      onClick={() => setEditMode(true)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Fade>
                )}
              </Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                My Profile
              </Typography>
            </Box>

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      variant="outlined"
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={profileData.email}
                      disabled
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      disabled={loading}
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      gap: 2,
                      mt: 2
                    }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => setEditMode(false)}
                        disabled={loading}
                        sx={{ px: 4 }}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                        sx={{ px: 4 }}
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      >
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, mb: 2, fontWeight: 500 }}>
                    {profileData.name || 'Not specified'}
                  </Typography>
                  <Divider sx={{ borderColor: 'primary.light' }} />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, mb: 2, fontWeight: 500 }}>
                    {profileData.email}
                  </Typography>
                  <Divider sx={{ borderColor: 'primary.light' }} />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, mb: 2, fontWeight: 500 }}>
                    {profileData.phone || 'Not specified'}
                  </Typography>
                  <Divider sx={{ borderColor: 'primary.light' }} />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    mt: 1, 
                    mb: 2, 
                    whiteSpace: 'pre-line',
                    fontWeight: 500
                  }}>
                    {profileData.address || 'Not specified'}
                  </Typography>
                  <Divider sx={{ borderColor: 'primary.light' }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button 
                    variant="contained" 
                    onClick={() => setEditMode(true)}
                    disabled={loading}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      borderRadius: 50,
                      boxShadow: 3,
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s'
                    }}
                    startIcon={<EditIcon />}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Zoom>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={error ? 'error' : 'success'}
            sx={{ width: '100%' }}
            elevation={6}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Profile;