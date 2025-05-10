// src/components/Navbar.js
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  useMediaQuery
} from '@mui/material';
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  FlightLand
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const { toggleTheme, mode } = useThemeContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    return (
        <AppBar 
            position="static"
            elevation={0}
            sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left side - Logo/Brand */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    
                    <Typography 
                        variant="h6" 
                        component={Link} 
                        to="/"
                        sx={{ 
                            textDecoration: 'none',
                            color: 'primary.main',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>
                            <FlightLand color="primary" />
                        </Box>
                        GlobalCourier
                    </Typography>
                </Box>

                {/* Right side - Navigation */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Theme toggle */}
                    <IconButton 
                        onClick={toggleTheme} 
                        color="inherit"
                        sx={{ mr: 1 }}
                    >
                        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    {currentUser ? (
                        <>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                {currentUser.photoURL ? (
                                    <Avatar 
                                        alt={currentUser.displayName} 
                                        src={currentUser.photoURL} 
                                        sx={{ width: 32, height: 32 }}
                                    />
                                ) : (
                                    <AccountCircle />
                                )}
                            </IconButton>
                            
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                                sx={{ mt: 1 }}
                            >
                                <MenuItem onClick={() => {
                                    navigate('/profile');
                                    handleClose();
                                }}>
                                    My Profile
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    navigate('/requests');
                                    handleClose();
                                }}>
                                    My Requests
                                </MenuItem>

                                <Divider />
                                <MenuItem onClick={() => {
                                    navigate('/my-requests');
                                    handleClose();
                                }}>
                                    My Requests
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    navigate('/my-deliveries');
                                    handleClose();
                                }}>
                                    My Deliveries
                                </MenuItem>

                                {/* 🔴 New Messages Menu Item */}
                                <Divider />
                                <MenuItem onClick={() => {
                                    navigate('/message-hub');
                                    handleClose();
                                }}>
                                    Messages
                                </MenuItem>

                                <Divider />
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => navigate('/login')}
                                sx={{ 
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3
                                }}
                            >
                                Login
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={handleSignup}
                                sx={{ 
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );

}

export default Navbar;
