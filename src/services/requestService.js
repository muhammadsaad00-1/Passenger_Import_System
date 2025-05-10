import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export const createRequest = async (requestData) => {
  try {
    const docRef = await addDoc(collection(db, 'requests'), {
      ...requestData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

export const getRequests = async (filters = {}) => {
  try {
    let q = query(collection(db, 'requests'), where('status', '==', 'pending'));
    
    if (filters.originCountry) {
      q = query(q, where('originCountry', '==', filters.originCountry));
    }
    
    if (filters.destinationCountry) {
      q = query(q, where('destinationCountry', '==', filters.destinationCountry));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting requests:', error);
    throw error;
  }
};

export const acceptRequest = async (requestId, travelerId) => {
  try {
    await updateDoc(doc(db, 'requests', requestId), {
      status: 'accepted',
      travelerId,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    throw error;
  }
};