// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { 
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign up function
  async function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Login function
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  async function logout() {
    await signOut(auth);
    navigate('/login');
  }

  // Reset password
  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update email
  async function updateUserEmail(email) {
    return updateEmail(currentUser, email);
  }

  // Update password
  async function updateUserPassword(password) {
    return updatePassword(currentUser, password);
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}