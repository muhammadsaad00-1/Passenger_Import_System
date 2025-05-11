// src/components/Dashboard.js
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Button,
  Container,
  Paper,
  Avatar,
  alpha,
  useTheme,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  FlightLand,
  ShoppingBasket,
  HelpOutline,
  ExpandMore,
  Add,
  Send
} from '@mui/icons-material';
import backgroundImage from '../assests/images/img1.webp';

function Dashboard() {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [faqOpen, setFaqOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [questionText, setQuestionText] = useState('');

  const faqs = [
    {
      question: "How does this app work?",
      answer: "Our platform connects travelers (passengers) with people who need items shipped (requesters). Requesters post items they want transported, and passengers can accept these requests if they're traveling along the same route."
    },
    {
      question: "How it works for requesters",
      answer: (
        <div>
          <ol>
            <li>Click 'Request an Item'</li>
            <li>Fill in details: item description, origin, destination, size/weight</li>
            <li>Set your offer price</li>
            <li>Wait for travelers to accept your request</li>
            <li>Communicate with the traveler through our Message Hub</li>
            <li>Arrange pickup/delivery details</li>
          </ol>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            Note: You'll only pay when a traveler accepts your request.
          </Typography>
        </div>
      )
    },
    {
      question: "How it works for passengers",
      answer: (
        <div>
          <ol>
            <li>Browse available requests matching your travel route</li>
            <li>Accept requests that fit your luggage capacity</li>
            <li>Communicate with the requester through our Message Hub</li>
            <li>Arrange pickup before your trip</li>
            <li>Deliver the item at your destination</li>
            <li>Get paid after successful delivery</li>
          </ol>
        </div>
      )
    },
    {
      question: "How to view other people's requests",
      answer: "Click on 'Browse Requests' to see all available shipping requests. You can filter by origin, destination, and item size to find requests that match your travel plans."
    },
    {
      question: "How to track my order",
      answer: "Once a request is accepted, both requester and passenger can track the order status through the Message Hub. You'll see updates when the item is picked up, in transit, and delivered."
    },
    {
      question: "About real-time chat",
      answer: "Our Message Hub provides secure communication between requesters and passengers. You can discuss pickup/delivery details, share photos of the item, and get real-time updates on your shipment."
    }
  ];

  const handleFaqClick = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleAskQuestion = () => {
    // Clear the text field
    setQuestionText('');
    // Here you would typically handle the question submission
    console.log("Question submitted:", questionText);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.7)}, ${alpha(theme.palette.primary.main, 0.3)}), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        pt: 4,
        pb: 6,
        position: 'relative'
      }}
    >
      {/* Floating Action Buttons */}
      <Fab
        color="primary"
        aria-label="help"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000
        }}
        onClick={() => setFaqOpen(true)}
      >
        <HelpOutline />
      </Fab>

      

      <Container maxWidth="lg">
        {/* Header Section */}
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

      {/* FAQ Dialog */}
      <Dialog
        open={faqOpen}
        onClose={() => setFaqOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(to bottom, #f5f9ff, #ffffff)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
          color: 'white',
          py: 3,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4
        }}>
          <Box display="flex" alignItems="center">
            <HelpOutline sx={{ mr: 2 }} />
            <Typography variant="h5" fontWeight={600}>
              Frequently Asked Questions
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <List sx={{ width: '100%' }}>
            {faqs.map((faq, index) => (
              <React.Fragment key={index}>
                <Accordion 
                  expanded={activeFaq === index}
                  onChange={() => handleFaqClick(index)}
                  sx={{
                    mb: 1,
                    boxShadow: 'none',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      backgroundColor: activeFaq === index ? alpha(theme.palette.primary.light, 0.1) : 'transparent',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.light, 0.05)
                      }
                    }}
                  >
                    <Typography fontWeight={600}>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                {index < faqs.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          
          {/* Question Input Field */}
          <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask if you have any other questions..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8)
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={handleAskQuestion}
                      disabled={!questionText.trim()}
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2)
                        }
                      }}
                    >
                      <Send />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Dashboard;