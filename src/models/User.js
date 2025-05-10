// src/models/User.js
import { auth, db } from "../firebase";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  arrayUnion,
  serverTimestamp,
  addDoc
} from "firebase/firestore";

export class User {
  constructor(id, email, name, phone, address) {
    if (new.target === User) {
      throw new Error("Cannot instantiate abstract class User");
    }
    this.id = id;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.address = address;
  }

  async updateProfile(profileData) {
    try {
      const userDocRef = doc(db, "users", this.id);
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  static async getCurrentUser() {
    if (!auth.currentUser) return null;
    
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Return a User instance with both customer and passenger capabilities
        return new User(
          auth.currentUser.uid,
          userData.email,
          userData.name,
          userData.phone,
          userData.address,
          userData.requests || [],
          userData.availableSpace || 0,
          userData.travelPlans || [],
          userData.deliveries || []
        );
      }
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Common methods for all users
  async createShipment(shipmentData) {
    try {
      // Add to items collection
      const itemsCollection = collection(db, "items");
      const itemData = {
        userId: this.id,
        userEmail: this.email,
        userName: this.name,
        ...shipmentData,
        status: "open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Add the item to Firestore items collection
      const newItemRef = await addDoc(itemsCollection, itemData);
      
      // Update user's requests array
      const userDocRef = doc(db, "users", this.id);
      await updateDoc(userDocRef, {
        requests: arrayUnion({
          itemId: newItemRef.id,
          itemName: shipmentData.itemName,
          createdAt: serverTimestamp(),
          status: "open"
        })
      });
      
      return newItemRef.id;
    } catch (error) {
      console.error("Error creating shipment:", error);
      throw error;
    }
  }

  async getShipments() {
    try {
      const itemsCollection = collection(db, "items");
      const q = query(itemsCollection, where("userId", "==", this.id));
      const querySnapshot = await getDocs(q);
      
      const shipments = [];
      querySnapshot.forEach((doc) => {
        shipments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return shipments;
    } catch (error) {
      console.error("Error getting shipments:", error);
      throw error;
    }
  }

  // Passenger methods
  async updateTravelPlan(travelPlanData) {
    try {
      const userDocRef = doc(db, "users", this.id);
      await updateDoc(userDocRef, {
        travelPlans: arrayUnion({
          ...travelPlanData,
          createdAt: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error updating travel plan:", error);
      throw error;
    }
  }

  async getAvailableShipments() {
    try {
      // Get open shipments that haven't been assigned yet
      const itemsCollection = collection(db, "items");
      const q = query(itemsCollection, where("status", "==", "open"));
      const querySnapshot = await getDocs(q);
      
      const shipments = [];
      querySnapshot.forEach((doc) => {
        shipments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return shipments;
    } catch (error) {
      console.error("Error getting available shipments:", error);
      throw error;
    }
  }

  async bidOnShipment(itemId, bidData) {
    try {
      const itemDocRef = doc(db, "items", itemId);
      const itemDoc = await getDoc(itemDocRef);
      
      if (!itemDoc.exists()) {
        throw new Error("Shipment not found");
      }
      
      if (itemDoc.data().status !== "open") {
        throw new Error("Shipment is not available for bidding");
      }
      
      // Create a bid
      const bidsCollection = collection(db, "bids");
      await addDoc(bidsCollection, {
        itemId,
        passengerId: this.id,
        passengerName: this.name,
        passengerEmail: this.email,
        ...bidData,
        status: "pending",
        createdAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Error bidding on shipment:", error);
      throw error;
    }
  }

  async getMyDeliveries() {
    try {
      const itemsCollection = collection(db, "items");
      const q = query(itemsCollection, where("assignedTo", "==", this.id));
      const querySnapshot = await getDocs(q);
      
      const deliveries = [];
      querySnapshot.forEach((doc) => {
        deliveries.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return deliveries;
    } catch (error) {
      console.error("Error getting deliveries:", error);
      throw error;
    }
  }

  // Deliverer methods
  async acceptShipment(itemId) {
    try {
      const itemDocRef = doc(db, "items", itemId);
      
      await updateDoc(itemDocRef, {
        status: "assigned",
        assignedTo: this.id,
        assignedToEmail: this.email,
        assignedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Update user's deliveries array
      const userDocRef = doc(db, "users", this.id);
      await updateDoc(userDocRef, {
        deliveries: arrayUnion({
          itemId: itemId,
          assignedAt: serverTimestamp(),
          status: "assigned"
        })
      });
      
      return true;
    } catch (error) {
      console.error("Error accepting shipment:", error);
      throw error;
    }
  }
}
