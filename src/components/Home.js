// src/components/Home.js
import { useAuth } from "../contexts/AuthContext";
import { Button, Container, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Passenger Import System
      </Typography>
      {currentUser && (
        <>
          <Typography variant="body1" gutterBottom>
            Welcome, {currentUser.email}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </>
      )}
    </Container>
  );
}

export default Home;