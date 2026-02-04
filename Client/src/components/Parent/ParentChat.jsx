import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Avatar, TextField, IconButton,
  Divider, CircularProgress, Button
} from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ParentNavbar from '../Navbar/ParentNavbar';
import EmailIcon from '@mui/icons-material/Email';
import ParentChatSideBar from './Common/ParentChatSideBar';

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

const ParentChat = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Initialize therapistDetails from localStorage, but expect it to be fetched if not found
  const [educatorDetails, setEducatorDetails] = useState(() => {
    const cachedData = localStorage.getItem("parentDetails");
    return cachedData ? JSON.parse(cachedData) : null;
  });

  const [participantDetails, setParticipantDetails] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState(null);

  const userType = location.state?.userType;
  const studentIdFromState = location.state?.studentId;

  const fetchParticipantDetails = async (participantId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let endpoint = '';

      if (userType === 'educator') {
        endpoint = `${import.meta.env.VITE_SERVER_URL}/ldss/educator/geteducator/${participantId}`;
        setStudentName(location.state?.studentName || '');
      } else if (userType === 'theraphist') {
        endpoint = `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${participantId}`;
        setStudentName(location.state?.studentName || '');
      } else {
        return;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setParticipantDetails(userType === 'educator' ? response.data.educator : response.data.theraphist);
      }
    } catch (error) {
      console.error('Error fetching participant details:', error);
      setError('Failed to load participant details.');
      setLoading(false);
    }
  };
  console.log(participantDetails);

  const getOrCreateConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return null;
      }

      const decoded = jwtDecode(token);
      const educatorId = decoded.id;

      if (userType === 'parent' && !studentIdFromState) {
        setError('Cannot start conversation: A specific student is required for parent chats. This parent might not have an associated student for you to chat about.');
        return null;
      }

      const existingConvs = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ldss/conversations/user/${educatorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const existingConv = existingConvs.data.find(conv =>
        conv.participants.includes(id) &&
        conv.participants.includes(educatorId) &&
        (userType !== 'parent' || String(conv.student) === String(studentIdFromState))
      );

      if (existingConv) {
        setConversationId(existingConv._id);
        setMessages(existingConv.messages || []);
        return existingConv._id;
      }

      const requestData = {
        participants: [educatorId, id],
        participantModels: ['parent', userType]
      };

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

  const fetchMessages = async (convId) => {
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
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    const tempId = Date.now().toString();
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);

      const newMsg = {
        sender: decoded.id,
        senderModel: 'parent',
        content: newMessage.trim()
      };

      if (userType === 'parent' && studentIdFromState) {
        newMsg.student = studentIdFromState;
      }

      setMessages(prev => [...prev, {
        ...newMsg,
        _id: tempId,
        timestamp: new Date().toISOString(),
        read: false
      }]);
      setNewMessage("");

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ldss/conversations/${conversationId}/messages`,
        newMsg,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchMessages(conversationId);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setError('Failed to send message.');
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Backend error message:', error.response.data.message);
        setError(`Failed to send message: ${error.response.data.message}`);
      }
    }
  };

  useEffect(() => {
    const fetchAllChatData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        setInitialLoading(false);
        return;
      }

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

      if (id) {
        setLoading(true);
        setError(null);
        try {
          await fetchParticipantDetails(id);
          const convId = await getOrCreateConversation();
          if (convId) {
            await fetchMessages(convId);
          }
        } catch (err) {
          console.error('An unexpected error occurred during chat setup:', err);
          setError(prev => prev || 'An unexpected error occurred during chat setup.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
      setInitialLoading(false);
    };

    fetchAllChatData();
  }, [id, location.state, navigate, educatorDetails, userType, studentIdFromState]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      <ParentNavbar
        parentdetails={educatorDetails}
        navigateToProfile={() => navigate('/parent/profile')}
      />
      <Box sx={{
        background: '#F6F7F9',
        width: "100%",
        height: "90.5vh",
        overflow: 'hidden',
        display: 'flex'
      }}>
        <Box flexBasis="100%" sx={{
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
                onClick={() => navigate('/parent/chat')}
                sx={{ mt: 2 }}
              >
                Back to Chat List
              </Button>
            </Box>
          ) : id && participantDetails ? (
            <Box sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "100%",
              height: "90%",
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <Box sx={{
                p: 2,
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => navigate('/parent/learningplan')} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                  </IconButton>
                  {participantDetails.profilePic?.filename ? (
                    <Avatar
                      src={`${import.meta.env.VITE_SERVER_URL}/uploads/${participantDetails.profilePic.filename}`}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <Avatar sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.875rem',
                      bgcolor: '#384371'
                    }}>
                      {participantDetails.name?.charAt(0) || ''}
                    </Avatar>
                  )}
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
                      {studentName}'s {location.state?.userType === 'educator' ? 'Educator' : 'Therapist'}
                    </Typography>
                    {/* <Avatar sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.875rem',
                      bgcolor: '#384371',
                    }}>
                      {studentName.charAt(0)}
                    </Avatar> */}
                  </Box>
                )}
              </Box>

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
                  p: 2
                }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    pt: 4,
                  }}>
                    {participantDetails.profilePic?.filename ? (
                      <Avatar
                        src={`${import.meta.env.VITE_SERVER_URL}/uploads/${participantDetails.profilePic?.filename}`}
                        sx={{ width: 80, height: 80, mb: 2 }}
                      />
                    ) : (
                      <Avatar sx={{
                        width: 80,
                        height: 80,
                        fontSize: '2rem',
                        bgcolor: '#384371',
                        mb: 2
                      }}>
                        {participantDetails.name?.charAt(0) || ''}
                      </Avatar>
                    )}
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

                  <Box sx={{ py: 2 }}>
                    {messages.map((msg, idx) => {
                      const showDate = idx === 0 ||
                        new Date(messages[idx - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

                      const isEducator = msg.senderModel === 'parent';

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
                              participantDetails.profilePic?.filename ? (
                                <Avatar
                                  src={`${import.meta.env.VITE_SERVER_URL}/uploads${participantDetails.profilePic.filename}`}
                                  sx={{ width: 32, height: 32 }}
                                />
                              ) : (
                                <Avatar sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: '0.875rem',
                                  bgcolor: '#384371'
                                }}>
                                  {participantDetails.name?.charAt(0) || ''}
                                </Avatar>
                              )
                            )}

                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: isEducator ? 'flex-end' : 'flex-start',
                              minWidth: 0,
                              flexGrow: 1
                            }}>
                              <Typography variant="caption" sx={{
                                color: 'text.secondary',
                                mb: 0.5,
                                alignSelf: isEducator ? 'flex-end' : 'flex-start'
                              }}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                              <Box sx={{
                                backgroundColor: isEducator ? '#1976d2' : '#F0F6FE',
                                color: isEducator ? 'white' : 'black',
                                px: 2,
                                py: 1,
                                borderRadius: '20px',
                                maxWidth: '70%',
                                overflowWrap: 'break-word',
                                wordBreak: 'normal'
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
                      pr: '45px',
                    },
                    flexGrow: 1
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  sx={{
                    ml: -5,
                    p: 1
                  }}
                >
                  <SendOutlinedIcon color={newMessage.trim() ? "primary" : "disabled"} />
                </IconButton>
              </Box>
            </Box>
          ) : (
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
                fontSize: '24px',
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

export default ParentChat;