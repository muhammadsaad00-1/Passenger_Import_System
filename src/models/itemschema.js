// Sample item document structure for Firestore

// When creating a new shipping request item, use this structure
export const createNewItemDocument = (userId, userEmail, formData) => {
    return {
      userId,
      userEmail,
      itemName: formData.itemName,
      description: formData.description,
      originCountry: formData.originCountry,
      destinationCountry: formData.destinationCountry,
      weight: parseFloat(formData.weight) || 0,
      size: formData.size,
      offerPrice: parseFloat(formData.offerPrice) || 0,
      urgency: formData.urgency,
      status: 'open', // 'open', 'assigned', 'in-transit', 'delivered', 'cancelled'
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedTo: null, // uid of user who will deliver the item
      assignedAt: null,
      deliveryStartedAt: null,
      deliveredAt: null,
      trackingInfo: {
        currentLocation: null,
        lastUpdated: null,
        estimatedDelivery: null
      },
      ratings: {
        delivererRating: null, // Rating given to the deliverer
        requesterRating: null  // Rating given to the requester
      }
    };
  };
  
  // Status update helper function for items
  export const updateItemStatus = (status) => {
    return {
      status,
      updatedAt: new Date()
    };
  };
  
  // Assignment helper function
  export const assignItemToDeliverer = (delivererUid, delivererEmail) => {
    return {
      assignedTo: delivererUid,
      assignedToEmail: delivererEmail,
      assignedAt: new Date(),
      status: 'assigned',
      updatedAt: new Date()
    };
  };