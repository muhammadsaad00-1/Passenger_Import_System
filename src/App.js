// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider } from './contexts/ThemeContext';
import { useThemeContext } from './contexts/ThemeContext'; // Import the hook
import CssBaseline from '@mui/material/CssBaseline';
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';
import CreateRequest from './components/CreateRequest';
import BrowseRequests from './components/BrowseRequest';
import MyRequests from './components/MyRequests';
import MyDeliveries from './components/MyDeliveries';
import Profile from "./components/Profile";
function AppWrapper() {
  const { theme } = useThemeContext(); // Get theme from context
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
          <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
  <Route path="/create-request" element={<PrivateRoute><CreateRequest /></PrivateRoute>} />
  <Route path="/browse-requests" element={<PrivateRoute><BrowseRequests /></PrivateRoute>} />
  <Route path="/my-requests" element={<PrivateRoute><MyRequests /></PrivateRoute>} />
  <Route path="/my-deliveries" element={<PrivateRoute><MyDeliveries /></PrivateRoute>} />

          </Routes>
        </Box>
      </Box>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppWrapper />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;