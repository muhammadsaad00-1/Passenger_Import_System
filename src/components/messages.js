import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  getDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Container,
  Paper,
  CircularProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [threadData, setThreadData] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Get thread ID from URL params
  const { threadId } = useParams();
  
  // Get current user from Firebase Auth
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;
  const userEmail = currentUser?.email;
  
  // Load thread data and setup real-time message listener
  useEffect(() => {
    if (!threadId || !userId) return;
    
    // First, get the thread document to fetch participant data
    const fetchThreadData = async () => {
      try {
        const threadRef = doc(db, "messages", threadId);
        const threadSnap = await getDoc(threadRef);
        
        if (threadSnap.exists()) {
          const data = threadSnap.data();
          setThreadData(data);
          
          // Determine other user (the one who is not the current user)
          const participantEmails = data.participantEmails || [];
          const participants = data.participants || [];
          
          // Find the other user's email and ID
          const otherUserIndex = participants.findIndex(id => id !== userId);
          const otherUserEmail = participantEmails[otherUserIndex];
          const otherUserId = participants[otherUserIndex];
          
          // Add these to thread data for easy access
          setThreadData(prev => ({
            ...prev,
            otherUserEmail,
            otherUserId
          }));
        } else {
          console.error("Thread not found");
        }
      } catch (error) {
        console.error("Error fetching thread data:", error);
      }
    };
    
    // Fetch thread data
    fetchThreadData();
    
    // Set up real-time listener for messages in this thread
    const messagesRef = collection(db, `messages/${threadId}/messages`);
    const q = query(messagesRef, orderBy('timestampCreatedAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [threadId, userId]);
  
  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !threadData || !threadId) return;
    
    try {
      const messagesRef = collection(db, `messages/${threadId}/messages`);
      await addDoc(messagesRef, {
        senderId: userId,
        senderEmail: userEmail,
        receiverId: threadData.otherUserId,
        receiverEmail: threadData.otherUserEmail,
        message: newMessage,
        timestampCreatedAt: new Date(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  // Format time from Firebase timestamp
  const formatTime = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return '';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper 
        elevation={3}
        sx={{
          maxWidth: '700px',
          margin: 'auto',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Chat Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#1976d2', color: '#fff' }}>
          <Avatar sx={{ mr: 2, bgcolor: '#fff', color: '#1976d2' }}>
            {threadData?.otherUserEmail?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <Typography variant="h6">{threadData?.otherUserEmail || 'Chat'}</Typography>
        </Box>

        <Divider />

        {/* Message List */}
        <List sx={{ height: '500px', overflowY: 'auto', p: 2, bgcolor: '#f5f7fa' }}>
          {messages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="body2" color="text.secondary">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          ) : (
            messages.map((msg) => (
              <ListItem
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: msg.senderId === userId ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                {msg.senderId !== userId && (
                  <Avatar sx={{ mr: 1, width: 32, height: 32, fontSize: '0.875rem' }}>
                    {msg.senderEmail?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 2,
                    bgcolor: msg.senderId === userId ? '#1976d2' : '#fff',
                    color: msg.senderId === userId ? '#fff' : '#000',
                    borderRadius: msg.senderId === userId ? 
                      '15px 15px 0 15px' : 
                      '15px 15px 15px 0',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="body1">
                    {msg.message}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    display="block" 
                    sx={{ 
                      mt: 0.5, 
                      color: msg.senderId === userId ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                      textAlign: 'right'
                    }}
                  >
                    {formatTime(msg.timestampCreatedAt)}
                  </Typography>
                </Box>
                {msg.senderId === userId && (
                  <Avatar sx={{ ml: 1, width: 32, height: 32, fontSize: '0.875rem', bgcolor: '#f50057' }}>
                    {userEmail?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                )}
              </ListItem>
            ))
          )}
        </List>

        <Divider />

        {/* Message Input */}
        <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', p: 2, bgcolor: '#fff' }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            variant="outlined"
            size="medium"
            sx={{ mr: 1 }}
          />
          <IconButton 
            color="primary" 
            type="submit" 
            sx={{ 
              bgcolor: '#1976d2', 
              color: '#fff',
              '&:hover': { bgcolor: '#1565c0' } 
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat;