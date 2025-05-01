// src/models/User.js
export class User {
    constructor(id, email, password, name, phone, address) {
      if (new.target === User) {
        throw new Error("Cannot instantiate abstract class User");
      }
      this.id = id;
      this.email = email;
      this.password = password;
      this.name = name;
      this.phone = phone;
      this.address = address;
    }
  
    login() {
      throw new Error("Method 'login()' must be implemented.");
    }
  
    updateProfile() {
      throw new Error("Method 'updateProfile()' must be implemented.");
    }
  }
  
  export class Customer extends User {
    constructor(id, email, password, name, phone, address, preferredRequests = []) {
      super(id, email, password, name, phone, address);
      this.preferredRequests = preferredRequests;
      this.shippingHistory = [];
    }
  
    createShipment() {
      // Implementation for creating a shipment
    }
  
    manageCommunication() {
      // Implementation for managing communication
    }
  }
  
  export class Passenger extends User {
    constructor(id, email, password, name, phone, address, availableSpace, travelPlans = []) {
      super(id, email, password, name, phone, address);
      this.availableSpace = availableSpace;
      this.travelPlans = travelPlans;
    }
  
    bidOnShipment() {
      // Implementation for bidding on shipments
    }
  
    confirmDelivery() {
      // Implementation for confirming delivery
    }
  }