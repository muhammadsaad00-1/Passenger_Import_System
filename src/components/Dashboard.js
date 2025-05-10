// src/components/Dashboard.js
import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Button,
  Container,
  Paper,
  Avatar,
  alpha,
  useTheme
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  FlightLand,
  ShoppingBasket
} from '@mui/icons-material';
import backgroundImage from '../assests/images/img1.webp'; // Import the image

function Dashboard() {
  const { currentUser } = useAuth();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.7)}, ${alpha(theme.palette.primary.main, 0.3)}), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        pt: 4,
        pb: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section with Glassmorphism Effect */}
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            mb: 6,
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Global Courier Network
          </Typography>
          <Typography 
            variant="h6" 
            component="h2" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400
            }}
          >
            Connect with travelers to bring home what you want, faster and cheaper than traditional shipping
          </Typography>
        </Paper>

        {/* Welcome Card */}
        {currentUser && (
          <Card
            sx={{
              mb: 4,
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  mr: 2,
                  width: 48,
                  height: 48,
                  fontSize: '1.25rem'
                }}
              >
                {currentUser.email.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Welcome back, {currentUser.email.split('@')[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready to ship or request something today?
                </Typography>
              </Box>
            </Box>
          </Card>
        )}

        {/* Main Action Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FlightLand color="primary" sx={{ mr: 2, fontSize: '2rem' }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Your Shipping Dashboard
            </Typography>
          </Box>
          
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(25, 118, 210, 0.05)'
            }}
          >
            <ShoppingBasket
              sx={{
                fontSize: 72,
                color: alpha(theme.palette.primary.main, 0.2),
                mb: 2
              }}
            />
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
              You don't have any active shipments yet
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
              <Button
                variant="contained"
                href="/create-request"
                size="large"
                sx={{
                  px: 5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)'
                }}
              >
                Request an Item
              </Button>
              <Button
                variant="outlined"
                href="/browse-requests"
                size="large"
                sx={{
                  px: 5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderWidth: '2px',
                  '&:hover': { borderWidth: '2px' }
                }}
              >
                Browse Requests
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard;