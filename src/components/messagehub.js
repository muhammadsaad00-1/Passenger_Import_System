import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Avatar,
  Divider,
  Typography,
  Box,
  Container,
  CircularProgress
} from '@mui/material';
import { ChatBubble } from '@mui/icons-material';

const MessageHub = () => {
  const [chatThreads, setChatThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  // Effect to check authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email);
      } else {
        // User is not signed in, redirect to login
        navigate('/login');
      }
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, [navigate]);

  // Effect to fetch threads once we have the user info
  useEffect(() => {
    const fetchThreads = async () => {
      if (!userId) return;
      
    
        console.log("Fetching threads for user:", userId, userEmail);
        setLoading(true);
        
        console.log("Starting query with userId:", userId);
        
        // Find threads where user is a participant
        const participantQuery = query(
          collection(db, 'messages'),
          where('participants', 'array-contains', userId)
        );
        
        const threadsSnapshot = await getDocs(participantQuery);
        console.log("Threads where user is participant:", threadsSnapshot.size);
        
        const threads = [];
        
        // Process each thread document
        for (const threadDoc of threadsSnapshot.docs) {
          const threadId = threadDoc.id;
          const threadData = threadDoc.data();
          
          // Find the other participant
          const otherUserIndex = threadData.participants.findIndex(id => id !== userId);
          const otherUserId = otherUserIndex !== -1 ? threadData.participants[otherUserIndex] : null;
          
          // Get the other user's email
          let otherUserEmail = 'Unknown User';
          if (threadData.participantEmails && Array.isArray(threadData.participantEmails) && otherUserIndex !== -1) {
            otherUserEmail = threadData.participantEmails[otherUserIndex];
          }
          
          // Get the latest message
          const messagesRef = collection(db, `messages/${threadId}/messages`);
          const messagesQuery = query(messagesRef, orderBy('timestampCreatedAt', 'desc'), limit(1));
          const messagesSnapshot = await getDocs(messagesQuery);
          
          let lastMessage = null;
          let lastMessageTime;
          if (threadData.createdAt) {
            if (typeof threadData.createdAt.toDate === 'function') {
              lastMessageTime = threadData.createdAt.toDate();
            } else {
              lastMessageTime = new Date(threadData.createdAt);
            }
          } else {
            lastMessageTime = new Date();
          
          if (!messagesSnapshot.empty) {
            const messageDoc = messagesSnapshot.docs[0];
            const messageData = messageDoc.data();
            lastMessage = messageData.message;
            
            if (messageData.timestampCreatedAt) {
              if (typeof messageData.timestampCreatedAt.toDate === 'function') {
                lastMessageTime = messageData.timestampCreatedAt.toDate();
              } else {
                lastMessageTime = new Date(messageData.timestampCreatedAt);
              }
            }
          }
          
          threads.push({
            threadId,
            otherUserId,
            otherUserEmail,
            lastMessage,
            lastMessageTime,
            lastUpdated: lastMessageTime
          });
        }
        
        // If user doesn't show up in participants array, check legacy fields
        const acceptorQuery = query(
          collection(db, 'messages'),
          where('acceptorId', '==', userId)
        );
        
        const requestOwnerQuery = query(
          collection(db, 'messages'),
          where('requestOwner', '==', userId)
        );
        
        const acceptorThreads = await getDocs(acceptorQuery);
        const requestOwnerThreads = await getDocs(requestOwnerQuery);
        
        // Process acceptor threads
        for (const threadDoc of acceptorThreads.docs) {
          // Skip if we already found this thread via participants array
          if (threads.some(t => t.threadId === threadDoc.id)) continue;
          
          const threadId = threadDoc.id;
          const threadData = threadDoc.data();
          
          const otherUserId = threadData.requestOwner;
          const otherUserEmail = threadData.requestOwnerEmail || 'Unknown User';
          
          // Get latest message
          const messagesRef = collection(db, `messages/${threadId}/messages`);
          const messagesQuery = query(messagesRef, orderBy('timestampCreatedAt', 'desc'), limit(1));
          const messagesSnapshot = await getDocs(messagesQuery);
          
          let lastMessage = null;
          let lastMessageTime;
          if (threadData.createdAt) {
            if (typeof threadData.createdAt.toDate === 'function') {
              lastMessageTime = threadData.createdAt.toDate();
            } else {
              lastMessageTime = new Date(threadData.createdAt);
            }
          } else {
            lastMessageTime = new Date();
          }
          
          if (!messagesSnapshot.empty) {
            const messageDoc = messagesSnapshot.docs[0];
            const messageData = messageDoc.data();
            lastMessage = messageData.message;
            
            if (messageData.timestampCreatedAt) {
              if (typeof messageData.timestampCreatedAt.toDate === 'function') {
                lastMessageTime = messageData.timestampCreatedAt.toDate();
              } else {
                lastMessageTime = new Date(messageData.timestampCreatedAt);
              }
            }
          }
          
          threads.push({
            threadId,
            otherUserId,
            otherUserEmail,
            lastMessage,
            lastMessageTime,
            lastUpdated: lastMessageTime
          });
        }
        
        // Process request owner threads
        for (const threadDoc of requestOwnerThreads.docs) {
          // Skip if we already found this thread
          if (threads.some(t => t.threadId === threadDoc.id)) continue;
          
          const threadId = threadDoc.id;
          const threadData = threadDoc.data();
          
          const otherUserId = threadData.acceptorId;
          const otherUserEmail = threadData.acceptorEmail || 'Unknown User';
          
          // Get latest message
          const messagesRef = collection(db, `messages/${threadId}/messages`);
          const messagesQuery = query(messagesRef, orderBy('timestampCreatedAt', 'desc'), limit(1));
          const messagesSnapshot = await getDocs(messagesQuery);
          
          let lastMessage = null;
          let lastMessageTime = threadData.createdAt ? 
            (threadData.createdAt.toDate ? threadData.createdAt.toDate() : threadData.createdAt) : 
            new Date();
          
          if (!messagesSnapshot.empty) {
            const messageDoc = messagesSnapshot.docs[0];
            const messageData = messageDoc.data();
            lastMessage = messageData.message;
            
            if (messageData.timestampCreatedAt) {
              lastMessageTime = messageData.timestampCreatedAt.toDate ? 
                messageData.timestampCreatedAt.toDate() : 
                messageData.timestampCreatedAt;
            }
          }
          
          threads.push({
            threadId,
            otherUserId,
            otherUserEmail,
            lastMessage,
            lastMessageTime,
            lastUpdated: lastMessageTime
          });
        }
        
        // Sort threads by most recent first
        threads.sort((a, b) => {
          // Handle cases where dates might not be valid
          const dateA = a.lastUpdated instanceof Date && !isNaN(a.lastUpdated) ? a.lastUpdated : new Date(0);
          const dateB = b.lastUpdated instanceof Date && !isNaN(b.lastUpdated) ? b.lastUpdated : new Date(0);
          return dateB - dateA;
        });
        
        console.log("Final threads to display:", threads);
        setChatThreads(threads);
        setLoading(false);

      } 

    };

    if (userId) {
      fetchThreads();
    }
  }, [userId]);

  // Navigate to the 1-on-1 Chat Screen
  const openChat = (threadId, otherUserId, otherUserEmail) => {
    navigate(`/chat/${threadId}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ maxWidth: '600px', margin: 'auto', mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ChatBubble color="primary" sx={{ mr: 2, fontSize: 40 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Message Hub
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : chatThreads.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            No conversations found. Accept a shipping request to start a conversation.
          </Typography>
        ) : (
          <List>
            {chatThreads.map((thread) => (
              <ListItem 
                key={thread.threadId} 
                disablePadding 
                sx={{ 
                  mb: 1, 
                  bgcolor: '#f5f5f5', 
                  borderRadius: 1,
                  '&:hover': { bgcolor: '#e8e8e8' }
                }}
              >
                <ListItemButton onClick={() => openChat(thread.threadId, thread.otherUserId, thread.otherUserEmail)}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {thread.otherUserEmail && thread.otherUserEmail[0] ? thread.otherUserEmail[0].toUpperCase() : '?'}
                  </Avatar>
                  <ListItemText
                    primary={thread.otherUserEmail}
                    secondary={thread.lastMessage ? 
                      (thread.lastMessage.length > 30 ? 
                        `${thread.lastMessage.substring(0, 30)}...` : 
                        thread.lastMessage) : 
                      "Click to view conversation"}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default MessageHub;