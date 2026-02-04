import React, { useEffect, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  styled,
  Card,
  CardContent,
  CardMedia,
  CardActions
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import LirbraryCardImage from '../../assets/librarycard.png';

// ✅ Move dummy data outside component
const activityCards = [
  {
    id: 1,
    title: "Critical Thinking Debate",
    description: "Students debate on 'Social media does more harm than good', preparing arguments for or against.",
    category: "Communication & Cognitive Skills"
  },
  {
    id: 2,
    title: "STEM Challenge",
    description: "Design and build a bridge using only straws and tape that can hold weight.",
    category: "Problem-Solving"
  },
  {
    id: 3,
    title: "Creative Writing Workshop",
    description: "Encourages students to write short stories using prompts and peer review.",
    category: "Language & Communication"
  },
  {
    id: 4,
    title: "Mindfulness Meditation",
    description: "Guided breathing and reflection activities to develop self-regulation.",
    category: "Wellbeing"
  },
  {
    id: 5,
    title: "Science Scavenger Hunt",
    description: "Students explore their environment to identify examples of scientific concepts.",
    category: "Inquiry-Based Learning"
  },
  {
    id: 6,
    title: "Team Building Maze",
    description: "Students guide a blindfolded partner through a simple obstacle maze.",
    category: "Teamwork & Trust"
  }
];


const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    border: "1px solid black"
  },
});

const EducatorViewActivityLibrary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = activityCards.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.category.toLowerCase().includes(searchTerm.toLowerCase())

  );
  const [educatorDetails, setEducatorDetails] = useState({});
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchEducator = async () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/geteducator/${decoded.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const educatorData = response.data.educator;
    localStorage.setItem("educatorDetails", JSON.stringify(educatorData));
    setEducatorDetails(educatorData);
  };
  useEffect(() => {
    const storedEducator = localStorage.getItem("educatorDetails");
    if (storedEducator) {
      setEducatorDetails(JSON.parse(storedEducator));
    }
    fetchEducator();

    const chatId = parseInt(id);
    if (chatId && dummyChats[chatId]) {
      setMessages(dummyChats[chatId]);
    } else {
      setMessages([]);
    }
  }, [id]);

  return (
    <Box>
      {/* Main Content */}
      <Box>
        {/* Header */}
        <EducatorNavbar educatorDetails={educatorDetails} navigateToProfile={() => navigate('/educator/profile')} />
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
          <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>All Students</Typography>
        </Box>
        {/* Content Area */}
        <Box sx={{ background: "white", borderRadius: "8px", p: 3 }}>
          {/* Search and Breadcrumb */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="start" sx={{ mt: "10px", mx: "50px" }}>
              <Breadcrumbs aria-label="breadcrumb" separator="›">
                <Link to="/educator/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                  Home
                </Link>
                <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                  Meetings
                </Typography>
              </Breadcrumbs>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <StyledTextField
                placeholder='Search here...'
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: '250px',
                  '& .MuiOutlinedInput-root': {
                    height: '40px'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Activity Cards Grid */}
          <Grid container spacing={3}>
            {filteredActivities.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={card.id}>
                <Card sx={{
                  maxWidth: 345,
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  p: 2,
                  '&:hover': {
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={LirbraryCardImage}
                    alt="Activity Card"
                    sx={{
                      borderRadius: '12px',
                      objectFit: 'cover',
                      backgroundColor: 'transparent',
                      mb: 2
                    }}
                  />

                  <CardContent sx={{
                    p: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{
                      fontWeight: 500,
                      color: "#384371",
                      minHeight: '64px'
                    }}>
                      {card.title}
                    </Typography>

                    <Typography variant="body2" sx={{
                      color: "#384371",
                      minHeight: '72px',
                      mb: 1
                    }}>
                      {card.description}
                    </Typography>

                    <Typography variant="caption" sx={{
                      color: 'secondary.main',
                      fontWeight: 500,
                      display: 'block'
                    }}>
                      Activity Category
                    </Typography>

                    <Typography variant="body2" sx={{
                      color: "#384371",

                      fontSize: "13px"
                    }}>
                      {card.category}
                    </Typography>
                  </CardContent>


                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredActivities.length === 0 && (
            <Box textAlign="center" mt={4}>
              <Typography variant="body1" color="textSecondary">
                No activities match your search.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EducatorViewActivityLibrary;
