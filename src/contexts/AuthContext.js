// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { 
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data from Firestore
  async function fetchUserData(uid) {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        return userDoc.data();
      } else {
        console.log("No user document found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign up function with Firestore user document creation
  async function signup(email, password, name = "") {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        createdAt: serverTimestamp(),
        phone: "",
        address: "",
        requests: [],
        travelPlans: [],
        deliveries: [],
        availableSpace: 0,
        profileCompleted: false
      });
      
      return userCredential;
    } catch (error) {
      throw error;
    }
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
    try {
      await updateEmail(currentUser, email);
      
      // Update email in Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        email: email,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update password
  async function updateUserPassword(password) {
    return updatePassword(currentUser, password);
  }

  // Update user profile
  async function updateUserProfile(profileData) {
    if (!currentUser) throw new Error("No authenticated user");
    
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
        profileCompleted: true
      });
      
      // Refresh user data
      await fetchUserData(currentUser.uid);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    updateUserProfile,
    fetchUserData
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