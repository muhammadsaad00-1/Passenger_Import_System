// src/components/Dashboard.js
import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Container,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  FlightLand,
  LocalShipping,
  ShoppingBasket,
  MonetizationOn,
  CheckCircle,
  Public
} from '@mui/icons-material';

function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
          Global Courier Network
        </Typography>
        <Typography variant="h6" component="h2" color="text.secondary" sx={{ 
          maxWidth: 600,
          mx: 'auto',
          fontWeight: 400
        }}>
          Connect with travelers to bring home what you want, faster and cheaper than traditional shipping
        </Typography>
      </Box>

      {/* Welcome Message */}
      {currentUser && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          p: 2,
          backgroundColor: 'rgba(25, 118, 210, 0.05)',
          borderRadius: 2
        }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            mr: 2,
            width: 48,
            height: 48
          }}>
            {currentUser.email.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Welcome back, {currentUser.email.split('@')[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ready to ship or request something today?
            </Typography>
          </Box>
        </Box>
      )}

      {/* Features Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Earn Money Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.04)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.08)'
            }
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2
              }}>
                <MonetizationOn color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                  Earn Money
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Make extra money while traveling" 
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Get cash rewards for spare luggage space" 
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              </List>
              
              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                sx={{ 
                  mt: 3,
                  py: 1.5,
                  fontWeight: 500,
                  borderRadius: 1
                }}
                href={currentUser ? "/create-request" : "/signup"}
              >
                {currentUser ? "Create Request" : "Join Now"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Fast Delivery Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.04)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.08)'
            }
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2
              }}>
                <LocalShipping color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                  Fast Delivery
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Receive items in days, not weeks" 
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Avoid customs delays and high fees" 
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              </List>
              
              <Box sx={{ 
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                p: 2,
                borderRadius: 1,
                mt: 2,
                mb: 3
              }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "Received my package in 2 days instead of 3 weeks!"
                </Typography>
              </Box>
              
              <Button 
                variant="outlined" 
                fullWidth 
                size="large"
                sx={{ 
                  mt: 1,
                  py: 1.5,
                  fontWeight: 500,
                  borderRadius: 1
                }}
                href="/how-it-works"
              >
                How It Works
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Global Selection Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.04)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.08)'
            }
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2
              }}>
                <Public color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                  Global Selection
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Access products from anywhere" 
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Find items unavailable locally" 
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Popular categories:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Electronics', 'Cosmetics', 'Fashion', 'Specialty Foods', 'Books'].map((item) => (
                    <Box key={item} sx={{
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
              
              <Button 
                variant="outlined" 
                fullWidth 
                size="large"
                sx={{ 
                  mt: 3,
                  py: 1.5,
                  fontWeight: 500,
                  borderRadius: 1
                }}
                href="/browse-items"
              >
                Browse Items
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      {currentUser && (
        <Paper elevation={0} sx={{ 
          p: 4, 
          mt: 4,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 2,
          background: 'linear-gradient(to right, #f9fafc, #ffffff)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FlightLand color="primary" sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Your Shipping Dashboard
            </Typography>
          </Box>
          
          <Box sx={{ 
            backgroundColor: 'rgba(25, 118, 210, 0.05)',
            p: 3,
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <ShoppingBasket sx={{ 
              fontSize: 48,
              color: 'rgba(0, 0, 0, 0.12)',
              mb: 2
            }} />
            <Typography variant="body1" sx={{ mb: 2 }}>
              You don't have any active shipments yet
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="contained" 
                href="/create-request"
                sx={{
                  px: 4,
                  borderRadius: 1,
                  fontWeight: 500
                }}
              >
                Request an Item
              </Button>
              <Button 
                variant="outlined" 
                href="/browse"
                sx={{
                  px: 4,
                  borderRadius: 1,
                  fontWeight: 500
                }}
              >
                Browse Travelers
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default Dashboard;