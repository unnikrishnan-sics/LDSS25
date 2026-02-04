import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ParentChatSideBar = ({ parentDetails }) => {
  const { id: selectedParticipantId } = useParams();
  const location = useLocation();
  const [searchTermEducators, setSearchTermEducators] = useState('');
  const [searchTermTherapists, setSearchTermTherapists] = useState('');
  const [conversations, setConversations] = useState([]);
  const [acceptedEducators, setAcceptedEducators] = useState([]);
  const [acceptedTherapists, setAcceptedTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('ParentChatSideBar useEffect triggered');

    if (!parentDetails?._id && !localStorage.getItem('token')) {
      console.log('No parent details or token available');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const currentParentId = parentDetails?._id || jwtDecode(token).id;

        console.log('Fetching data for parent:', currentParentId);

        const [educatorsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getacceptededucator/${currentParentId}`,
            { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const therapistsResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/ldss/parent/getacceptedtherapist/${currentParentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Therapists API response:', therapistsResponse.data); // Debug log

        const acceptedEds = educatorsResponse.data.acceptedEducators || [];
        const acceptedTherapists = therapistsResponse.data.acceptedTherapists
          ? therapistsResponse.data.acceptedTherapists.map(conn => conn.recipientId)
          : [];
        console.log('Accepted educators:', acceptedEds);
        console.log('Accepted therapists:', acceptedTherapists);

        setAcceptedEducators(acceptedEds);
        setAcceptedTherapists(acceptedTherapists);

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/ldss/conversations/user/${currentParentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('All conversations:', response.data);

        const validConversations = response.data.filter(conv => {
          const otherParticipant = conv.participants.find(p => String(p._id) !== String(currentParentId));

          if (!otherParticipant) return false;

          // Check if participant is an accepted educator
          const isEducator = acceptedEds.some(e => String(e.recipientId._id) === String(otherParticipant._id));

          // Check if participant is an accepted therapist
          const isTherapist = acceptedTherapists.some(t => String(t._id) === String(otherParticipant._id));

          return isEducator || isTherapist;
        });

        console.log('Valid conversations:', validConversations);
        setConversations(validConversations);

      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load chat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parentDetails]);

  // Group educator conversations by educator, listing all their students
  const groupedEducatorConversations = useMemo(() => {
    const educatorMap = new Map();

    conversations.forEach(conv => {
      const otherParticipant = conv.participants.find(p => String(p._id) !== String(parentDetails?._id));

      // Skip if not an educator conversation
      if (!otherParticipant || !(otherParticipant.role === 'educator' || conv.participantModels.includes('educator'))) {
        return;
      }

      const educatorId = otherParticipant._id;
      const student = conv.student;

      if (!educatorMap.has(educatorId)) {
        educatorMap.set(educatorId, {
          educator: otherParticipant,
          students: new Set(),
          firstConversation: conv
        });
      }

      if (student) {
        educatorMap.get(educatorId).students.add(student);
      }
    });

    return Array.from(educatorMap.values()).map(entry => ({
      ...entry.educator,
      allStudents: Array.from(entry.students),
      firstStudentId: entry.firstConversation.student?._id,
      firstStudentName: entry.firstConversation.student?.name,
    }));
  }, [conversations, parentDetails]);

  // Group therapist conversations by therapist, listing all their students
  const groupedTherapistConversations = useMemo(() => {
    console.log('Grouping therapist conversations...'); // Debug log

    const therapistMap = new Map();

    conversations.forEach(conv => {
      // Debug log for each conversation
      console.log('Processing conversation:', conv._id, 'with participants:', conv.participants);

      // Find the therapist participant (not the parent)
      const therapistParticipant = conv.participants.find(p =>
        String(p._id) !== String(parentDetails?._id) &&
        acceptedTherapists.some(t => String(t._id) === String(p._id))
      );

      if (!therapistParticipant) {
        console.log('No therapist participant found in conversation', conv._id);
        return;
      }

      console.log('Found therapist:', therapistParticipant);

      const therapistId = therapistParticipant._id;
      const student = conv.student;

      if (!therapistMap.has(therapistId)) {
        therapistMap.set(therapistId, {
          therapist: therapistParticipant,
          students: new Set(),
          firstConversation: conv
        });
      }

      if (student) {
        therapistMap.get(therapistId).students.add(student);
      }
    });

    const result = Array.from(therapistMap.values()).map(entry => ({
      ...entry.therapist,
      allStudents: Array.from(entry.students),
      firstStudentId: entry.firstConversation.student?._id,
      firstStudentName: entry.firstConversation.student?.name,
    }));

    console.log('Final grouped therapists:', result); // Debug log
    return result;
  }, [conversations, parentDetails]);

  // Filter grouped educator conversations based on search term
  const filteredEducators = useMemo(() => {
    return groupedEducatorConversations.filter(groupedEducator => {
      const educatorName = groupedEducator.name?.toLowerCase() || '';
      const studentNames = groupedEducator.allStudents.map(s => s.name?.toLowerCase() || '').join(' ');
      const searchTerm = searchTermEducators.toLowerCase();
      return educatorName.includes(searchTerm) || studentNames.includes(searchTerm);
    });
  }, [groupedEducatorConversations, searchTermEducators]);

  // Filter grouped therapist conversations based on search term
  const filteredTherapists = useMemo(() => {
    return groupedTherapistConversations.filter(groupedTherapist => {
      const therapistName = groupedTherapist.name?.toLowerCase() || '';
      const studentNames = groupedTherapist.allStudents.map(s => s.name?.toLowerCase() || '').join(' ');
      const searchTerm = searchTermTherapists.toLowerCase();
      return therapistName.includes(searchTerm) || studentNames.includes(searchTerm);
    });
  }, [groupedTherapistConversations, searchTermTherapists]);

  if (loading) {
    return (
      <Box sx={{
        width: "100%",
        height: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: "12px",
        margin: "15px"
      }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        width: "100%",
        height: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: "12px",
        margin: "15px",
        p: 2,
        textAlign: 'center',
        color: 'error.main'
      }}>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      py: "15px"
    }}>
      {/* Educators Section */}
      <Box sx={{
        background: "white",
        mx: "15px",
        mb: "15px",
        flex: 1,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: '45%'
      }}>
        <Box sx={{ p: "10px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }} color='primary'>Educators</Typography>
          <Box display="flex" alignItems="center" gap={1} mt={2}
            sx={{
              padding: "8px 15px",
              borderRadius: "25px",
              border: "1px solid #CCCCCC",
              height: "40px"
            }}
          >
            <SearchOutlinedIcon sx={{ color: 'action.active' }} />
            <input
              placeholder="Search educators"
              style={{
                border: 0,
                outline: 0,
                height: "100%",
                width: "100%",
                backgroundColor: "transparent",
                fontSize: '1rem'
              }}
              value={searchTermEducators}
              onChange={(e) => setSearchTermEducators(e.target.value)}
            />
          </Box>
        </Box>

        <Box sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          '&::-webkit-scrollbar': { display: 'none' },
          flex: 1,
          px: "10px",
          pb: "10px"
        }}>
          {filteredEducators.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              {searchTermEducators ? 'No matching educators found' : 'No educator chats found'}
            </Typography>
          ) : (
            filteredEducators.map((groupedEducator) => {
              const isSelected = selectedParticipantId === groupedEducator._id &&
                groupedEducator.allStudents.some(s => s._id === location.state?.studentId);

              return (
                <Link
                  key={groupedEducator._id}
                  to={`/parent/chat/${groupedEducator._id}`}
                  state={{
                    userType: 'educator',
                    studentName: groupedEducator.firstStudentName,
                    studentId: groupedEducator.firstStudentId
                  }}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    p={1}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      backgroundColor: isSelected ? 'primary.main' : 'transparent',
                      color: isSelected ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                        color: isSelected ? 'white' : 'inherit'
                      }
                    }}
                  >
                    {groupedEducator.profilePic ? (
                      <Avatar
                        src={`${import.meta.env.VITE_SERVER_URL}/uploads/${groupedEducator.profilePic}`}
                        alt={groupedEducator.name || ''}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: isSelected ? 'white' : 'primary.main',
                          color: isSelected ? 'primary.main' : 'white'
                        }}
                      >
                        {(groupedEducator.name || '').charAt(0)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography fontWeight="bold">{groupedEducator.name}</Typography>
                      {groupedEducator.allStudents.length > 0 && (
                        <Typography variant="body2" sx={{
                          color: isSelected ? 'white' : 'text.secondary'
                        }}>
                          {groupedEducator.allStudents.map(s => s.name).join(', ')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Link>
              );
            })
          )}
        </Box>
      </Box>

      {/* Therapists Section */}
      <Box sx={{
        background: "white",
        mx: "15px",
        mt: 0,
        flex: 1,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: '45%'
      }}>
        <Box sx={{ p: "10px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }} color='primary'>Therapists</Typography>
          <Box display="flex" alignItems="center" gap={1} mt={2}
            sx={{
              padding: "8px 15px",
              borderRadius: "25px",
              border: "1px solid #CCCCCC",
              height: "40px"
            }}
          >
            <SearchOutlinedIcon sx={{ color: 'action.active' }} />
            <input
              placeholder="Search Therapists"
              style={{
                border: 0,
                outline: 0,
                height: "100%",
                width: "100%",
                backgroundColor: "transparent",
                fontSize: '1rem'
              }}
              value={searchTermTherapists}
              onChange={(e) => setSearchTermTherapists(e.target.value)}
            />
          </Box>
        </Box>

        <Box sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          '&::-webkit-scrollbar': { display: 'none' },
          flex: 1,
          px: "10px",
          pb: "10px"
        }}>
          {filteredTherapists.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              {searchTermTherapists ? 'No matching therapists found' : 'No therapist chats found'}
            </Typography>
          ) : (
            filteredTherapists.map((groupedTherapist) => {
              const isSelected = selectedParticipantId === groupedTherapist._id &&
                groupedTherapist.allStudents.some(s => s._id === location.state?.studentId);

              return (
                <Link
                  key={groupedTherapist._id}
                  to={`/parent/chat/${groupedTherapist._id}`}
                  state={{
                    userType: 'theraphist',
                    studentName: groupedTherapist.firstStudentName,
                    studentId: groupedTherapist.firstStudentId
                  }}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    p={1}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      backgroundColor: isSelected ? 'primary.main' : 'transparent',
                      color: isSelected ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                        color: isSelected ? 'white' : 'inherit'
                      }
                    }}
                  >
                    {groupedTherapist.profilePic ? (
                      <Avatar
                        src={`${import.meta.env.VITE_SERVER_URL}/uploads/${groupedTherapist.profilePic}`}
                        alt={groupedTherapist.name || ''}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: isSelected ? 'white' : 'primary.main',
                          color: isSelected ? 'primary.main' : 'white'
                        }}
                      >
                        {(groupedTherapist.name || '').charAt(0)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography fontWeight="bold">{groupedTherapist.name}</Typography>
                      {groupedTherapist.allStudents.length > 0 && (
                        <Typography variant="body2" sx={{
                          color: isSelected ? 'white' : 'text.secondary'
                        }}>
                          {groupedTherapist.allStudents.map(s => s.name).join(', ')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Link>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ParentChatSideBar;