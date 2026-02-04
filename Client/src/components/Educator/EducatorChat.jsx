import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Avatar, TextField, IconButton,
  Divider, CircularProgress, Button // Added Button import
} from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import EmailIcon from '@mui/icons-material/Email';
import EducatorChatSideBar from './Common/EducatorChatSideBar';

const formatMessageDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const messageDate = new Date(dateString);
  messageDate.setHours(0, 0, 0, 0);

  const diffTime = today - messageDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = messageDate.getDate();
  const month = monthNames[messageDate.getMonth()];

  if (diffDays === 0) {
    return `Today, ${month} ${day}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${month} ${day}`;
  } else {
    return `${month} ${day}`;
  }
};

const EducatorChat = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Initialize therapistDetails from localStorage, but expect it to be fetched if not found
  const [educatorDetails, setEducatorDetails] = useState(() => {
    const cachedData = localStorage.getItem("educatorDetails");
    return cachedData ? JSON.parse(cachedData) : null;
  });

  const [participantDetails, setParticipantDetails] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false); // Controls chat content loading
  const [initialLoading, setInitialLoading] = useState(true); // Controls overall initial loading (therapist details)
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState(null);

  // Extract these from location.state once, as they are part of the current chat context
  const userType = location.state?.userType;
  const studentIdFromState = location.state?.studentId;


  const fetchParticipantDetails = async (participantId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if token is missing
        return;
      }

      let endpoint = '';

      if (userType === 'parent') {
        endpoint = `${import.meta.env.VITE_SERVER_URL}/ldss/parent/getparent/${participantId}`;
        setStudentName(location.state?.studentName || '');
      } else if (userType === 'theraphist') {
        endpoint = `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${participantId}`;
        setStudentName(location.state?.studentName || ''); // Student name might be null for educator chats
      } else {
        return; // Invalid userType or missing
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setParticipantDetails(userType === 'parent' ? response.data.parent : response.data.theraphist);
      }
    } catch (error) {
      console.error('Error fetching participant details:', error);
      setError('Failed to load participant details.');
      setLoading(false); // Stop loading if participant details fail
    }
  };

  const getOrCreateConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return null;
      }

      const decoded = jwtDecode(token);
      const educatorId = decoded.id;

      // Crucial check: If it's a parent chat, studentId is required by backend.
      // If it's missing from state, we cannot proceed.
      if (userType === 'parent' && !studentIdFromState) {
        setError('Cannot start conversation: A specific student is required for parent chats. This parent might not have an associated student for you to chat about.');
        return null;
      }

      // First try to find existing conversation
      const existingConvs = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ldss/conversations/user/${educatorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const existingConv = existingConvs.data.find(conv =>
        conv.participants.includes(id) &&
        conv.participants.includes(educatorId) &&
        // For parent conversations, also ensure student matches
        (userType !== 'parent' || String(conv.student) === String(studentIdFromState))
      );

      if (existingConv) {
        setConversationId(existingConv._id);
        setMessages(existingConv.messages || []);
        return existingConv._id;
      }

      const requestData = {
        participants: [educatorId, id],
        participantModels: ['educator', userType]
      };

      // Only add student if it's a parent conversation AND studentId is available
      if (userType === 'parent' && studentIdFromState) {
        requestData.student = studentIdFromState;
      }

      const newConv = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ldss/conversations`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversationId(newConv.data._id);
      return newConv.data._id;
    } catch (error) {
      console.error('Error handling conversation:', error);
      setError(error.response?.data?.message || 'Failed to create conversation. Please try again.');
      return null;
    }
  };

  const fetchMessages = async (convId) => { // Accept conversation ID as argument
    if (!convId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ldss/conversations/${convId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages.');
    } finally {
      setLoading(false); // Chat content loading is complete
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    const tempId = Date.now().toString(); // Temporary ID for optimistic update
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);

      const newMsg = {
        sender: decoded.id,
        senderModel: 'educator',
        content: newMessage.trim() // Trim message content
      };

      // --- Crucial addition for parent chats ---
      if (userType === 'parent' && studentIdFromState) {
        newMsg.student = studentIdFromState;
      }
      // -----------------------------------------

      // Optimistic update: Add message to UI immediately
      setMessages(prev => [...prev, {
        ...newMsg,
        _id: tempId, // Use tempId for immediate rendering
        timestamp: new Date().toISOString(), // Use ISO string for consistency
        read: false
      }]);
      setNewMessage(""); // Clear input field

      // Send message to backend
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ldss/conversations/${conversationId}/messages`,
        newMsg, // newMsg now contains the student ID if it's a parent chat
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Re-fetch messages to get the actual _id and ensure consistency
      fetchMessages(conversationId);

    } catch (error) {
      console.error('Error sending message:', error);
      // Revert optimistic update if send fails
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setError('Failed to send message.');
      // Log more specific backend error if available
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Backend error message:', error.response.data.message);
        setError(`Failed to send message: ${error.response.data.message}`);
      }
    }
  };

  // Main effect hook to manage data fetching and loading states
  useEffect(() => {
    const fetchAllChatData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        setInitialLoading(false);
        return;
      }

      // 1. Fetch therapist details if not already loaded from cache
      if (!educatorDetails) {
        try {
          const decoded = jwtDecode(token);
          const educatorId = decoded.id;
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/geteducator/${educatorId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data?.educator) {
            setEducatorDetails(response.data.educator);
            localStorage.setItem("educatorDetails", JSON.stringify(response.data.educator));
          } else {
            setError('Failed to load educator profile. Data incomplete.');
            setInitialLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching educator details:', err);
          setError('Failed to load educator profile. Please check your connection or try again.');
          setInitialLoading(false);
          return;
        }
      }

      // 2. Fetch chat-specific data if a participant `id` is provided
      if (id) {
        setLoading(true); // Start loading for chat content
        setError(null); // Clear errors when starting a new chat load
        try {
          await fetchParticipantDetails(id); // Fetch participant details
          const convId = await getOrCreateConversation(); // Get or create conversation, handles student requirement
          if (convId) { // Only fetch messages if conversation ID was successfully obtained
            await fetchMessages(convId);
          } else {
            // getOrCreateConversation already set an error if it returned null
          }
        } catch (err) {
          console.error('An unexpected error occurred during chat setup:', err);
          // Only set a generic error if a more specific one hasn't been set by sub-functions
          setError(prev => prev || 'An unexpected error occurred during chat setup.');
        } finally {
          setLoading(false); // Chat content loading finished (either successfully or with error)
        }
      } else {
        setLoading(false); // No specific chat selected, stop chat content loading
      }
      setInitialLoading(false); // Overall initial loading is complete
    };

    fetchAllChatData();
  }, [id, location.state, navigate, educatorDetails, userType, studentIdFromState]); // Dependencies for re-running effect

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Display initial loading spinner until therapist details are loaded
  if (initialLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <EducatorNavbar
        educatorDetails={educatorDetails}
        navigateToProfile={() => navigate('/educator/profile')}
      />
      <Box sx={{
        background: '#F6F7F9',
        width: "100%",
        height: "90.5vh",
        overflow: 'hidden',
        display: 'flex'
      }}>
        {/* Sidebar */}
        <Box flexBasis="20%" sx={{ height: "100%" }}>
          {educatorDetails ? (
            <EducatorChatSideBar educatorDetails={educatorDetails} />
          ) : (
            // Fallback for sidebar if therapistDetails are somehow missing after initial load
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backgroundColor: 'white',
              borderRadius: "12px",
              margin: "15px"
            }}>
              <CircularProgress />
            </Box>
          )}
        </Box>

        {/* Main Chat Area */}
        <Box flexBasis="80%" sx={{
          height: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {error ? (
            <Box sx={{
              backgroundColor: "white",
              padding: "20px",
              margin: "15px",
              borderRadius: "12px",
              width: "100%",
              height: "90%",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <Typography color="error" variant="h6" sx={{ mb: 2 }}>
                Error: {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{ mt: 2 }}
              >
                Refresh Page
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/educator/chat')}
                sx={{ mt: 2 }}
              >
                Back to Chat List
              </Button>
            </Box>
          ) : id && participantDetails ? (
            // Main chat window when a participant is selected
            <Box sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "100%",
              height: "90%",
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <Box sx={{
                p: 2,
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => navigate('/educator/chat')} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Avatar sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    bgcolor: '#384371'
                  }}>
                    {participantDetails.name?.charAt(0) || ''}
                  </Avatar>
                  <Typography variant="h6" sx={{
                    color: '#384371',
                    ml: 1
                  }}>
                    {participantDetails.name}
                  </Typography>
                </Box>
                {studentName && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{
                      color: '#384371',
                      fontWeight: 500,
                      mr: 0.5
                    }}>
                      {studentName}'s {location.state?.userType === 'parent' ? 'Parent' : 'Therapist'}
                    </Typography>
                    <Avatar sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.875rem',
                      bgcolor: '#384371',
                    }}>
                      {studentName.charAt(0)}
                    </Avatar>
                  </Box>
                )}
              </Box>

              {/* Chat Content Area */}
              {loading ? (
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{
                  flex: 1,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  p: 2 // Padding around messages
                }}>
                  {/* Profile Section (always visible at top of chat content) */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    pt: 4,
                  }}>
                    <Avatar sx={{
                      width: 80,
                      height: 80,
                      fontSize: '2rem',
                      bgcolor: '#384371',
                      mb: 2
                    }}>
                      {participantDetails.name?.charAt(0) || ''}
                    </Avatar>
                    <Typography variant="h5" sx={{
                      color: '#384371',
                      fontWeight: 500,
                      textAlign: 'center'
                    }}>
                      {participantDetails.name}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        {participantDetails.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ py: 2 }}>
                    {messages.map((msg, idx) => {
                      const showDate = idx === 0 ||
                        new Date(messages[idx - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

                      const isEducator = msg.senderModel === 'educator';

                      return (
                        <React.Fragment key={msg._id || idx}>
                          {showDate && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                              <Typography variant="h5" sx={{
                                color: '#384371',
                                px: 2,
                                py: 0.5,
                                fontSize: '0.8em',
                                backgroundColor: '#E0E0E0',
                                borderRadius: '15px'
                              }}>
                                {formatMessageDate(msg.timestamp)}
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{
                            display: 'flex',
                            mb: 2,
                            flexDirection: isEducator ? 'row-reverse' : 'row',
                            alignItems: 'flex-end',
                            gap: 1
                          }}>
                            {!isEducator && (
                              <Avatar sx={{
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem',
                                bgcolor: '#384371'
                              }}>
                                {participantDetails.name?.charAt(0) || ''}
                              </Avatar>
                            )}

                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: isEducator ? 'flex-end' : 'flex-start',
                              minWidth: 0, // Allows this flex item to shrink (crucial for wrapping)
                              flexGrow: 1 // Allows this column to grow and take available horizontal space
                            }}>
                              <Typography variant="caption" sx={{
                                color: 'text.secondary',
                                mb: 0.5,
                                alignSelf: isEducator ? 'flex-end' : 'flex-start'
                              }}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                              <Box sx={{
                                backgroundColor: isEducator ? '#1976d2' : '#F0F6FE', // Use primary color for therapist messages
                                color: isEducator ? 'white' : 'black',
                                px: 2,
                                py: 1,
                                borderRadius: '20px', // More modern rounded corners
                                maxWidth: '70%', // Limit message bubble width
                                overflowWrap: 'break-word', // Ensures long words break correctly
                                wordBreak: 'normal' // Ensures normal word wrapping for other words
                              }}>
                                {msg.content}
                              </Box>
                            </Box>
                          </Box>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </Box>
                </Box>
              )}

              {/* Message Input */}
              <Divider sx={{ backgroundColor: '#f0f0f0' }} />
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newMessage.trim()) handleSendMessage();
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '35px',
                      backgroundColor: '#FFFFFF',
                      pr: '45px', // Make space for the send icon inside the field
                    },
                    flexGrow: 1
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()} // Disable if message is empty
                  sx={{
                    ml: -5, // Position send icon over the TextField's padding
                    p: 1 // Padding for click area
                  }}
                >
                  <SendOutlinedIcon color={newMessage.trim() ? "primary" : "disabled"} />
                </IconButton>
              </Box>
            </Box>
          ) : (
            // Default view when no chat is selected
            <Box
              sx={{
                backgroundColor: "white",
                padding: "10px",
                margin: "15px",
                borderRadius: "12px",
                width: "100%",
                height: "90%",
              }}
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              gap={5}
            >
              <Typography sx={{
                color: 'black',
                fontSize: '24px', // Larger font for welcome
                fontWeight: "600",
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                Welcome <WavingHandIcon sx={{ color: "gold", fontSize: 30 }} /> {educatorDetails?.name || 'Educator'} <AutoAwesomeIcon sx={{ color: "gold", fontSize: 30 }} />
              </Typography>
              <Typography sx={{
                color: 'text.secondary',
                fontSize: '18px',
                fontWeight: "500"
              }}>
                Select a chat from the sidebar to start messaging.
              </Typography>
              <ChatIcon sx={{ fontSize: 80, color: 'action.disabled' }} />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};


export default EducatorChat;