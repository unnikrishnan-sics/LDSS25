import React, { useEffect, useState } from 'react';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import "../../Styles/LandingPage.css";
import { Box, Button, Container, Divider, Fade, Grid, Modal, Stack, Typography, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import Footer from '../Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import Backdrop from '@mui/material/Backdrop';
import EducatorViewParentDetails from './Common/EducatorViewParentDetails';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import HomeImage from '../../assets/librarycard.png'; // Ensure you have an appropriate image here
// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const EducatorHome = () => {
    const [educatorDetails, setEducatorDetails] = useState({});
    const [parentRequest, setParentRequest] = useState([]);
    const [requestDetail, setRequestDetail] = useState({});
    const [openParent, setOpenParent] = useState(false);
    const navigate = useNavigate();

    const fetchEducator = async () => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/geteducator/${decoded.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const educatorData = response.data.educator;
        localStorage.setItem("educatorDetails", JSON.stringify(educatorData));
        setEducatorDetails(educatorData);
    }

    const fetchParentsRequest = async () => {
        const token = localStorage.getItem("token");
        const educatorId = JSON.parse(localStorage.getItem("educatorDetails"))._id;
        const request = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/parentsrequest/${educatorId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setParentRequest(request.data.request);
    };

    const fetchParentByRequestId = async (requestId) => {
        const token = localStorage.getItem("token");
        const parent = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/viewrequestedparent/${requestId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setRequestDetail(parent.data.viewRequest);
        handleParentOpen();
    }

    const acceptParentrequest = async (requestId) => {
        const token = localStorage.getItem("token");
        await axios.put(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/acceptsrequest/${requestId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        handleParentClose();
        fetchParentsRequest();
    };

    const rejectParentrequest = async (requestId) => {
        const token = localStorage.getItem("token");
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/rejectparent/${requestId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        handleParentClose();
        fetchParentsRequest();
    };

    const handleParentOpen = () => setOpenParent(true);
    const handleParentClose = () => setOpenParent(false);
    const navigateToProfile = () => navigate('/educator/profile');

    useEffect(() => {
        const storedEducator = localStorage.getItem("educatorDetails");
        if (storedEducator) setEducatorDetails(JSON.parse(storedEducator));
        fetchEducator();
        fetchParentsRequest();
    }, []);

    return (
        <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <EducatorNavbar educatorDetails={educatorDetails} navigateToProfile={navigateToProfile} />

            {/* Hero Section */}
            <Box sx={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                color: 'white',
                py: 10,
                textAlign: 'center'
            }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h3" sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            lineHeight: 1.2
                        }}>
                            Welcome Back, {educatorDetails.name || 'Educator'}!
                        </Typography>
                        <Typography variant="body1" sx={{
                            mb: 4,
                            fontSize: '1.1rem',
                            opacity: 0.9,
                            maxWidth: '800px',
                            mx: 'auto'
                        }}>
                            Empower children's learning journeys with personalized plans and collaborative tools.
                        </Typography>
                    </motion.div>

                    <Box sx={{
                        position: 'relative',
                        mt: 8,
                        height: { xs: 300, md: 400 },
                        animation: `${floatAnimation} 6s ease-in-out infinite`
                    }}>
                        <Box component="img"
                            src={HomeImage}
                            alt="Teaching"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 4,
                                boxShadow: 6
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            {/* Parent Requests Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography variant="h4" sx={{
                        fontWeight: 700,
                        mb: 6,
                        textAlign: 'center',
                        color: '#2E3B4E'
                    }}>
                        Parent Connection Requests
                    </Typography>

                    {parentRequest.filter(request => request.status === "pending").length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            p: 4,
                            backgroundColor: 'white',
                            borderRadius: 4,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                        }}>
                            <Typography variant="h6" color="textSecondary">
                                No pending requests at the moment
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={4}>
                            {parentRequest.filter(request => request.status === "pending").map((request, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card sx={{
                                            height: '100%',
                                            borderRadius: 3,
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 12px 35px rgba(0,0,0,0.15)'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 3
                                                }}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            mr: 3
                                                        }}
                                                        image={`${import.meta.env.VITE_SERVER_URL}/uploads/${request.parentId.profilePic?.filename}`}
                                                        alt={request.parentId.name}
                                                    />
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            {request.parentId.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {request.parentId.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        <strong>Phone:</strong> {request.parentId.phone || 'Not provided'}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Address:</strong> {request.parentId.address || 'Not provided'}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Button
                                                        onClick={() => fetchParentByRequestId(request._id)}
                                                        variant="outlined"
                                                        sx={{
                                                            borderRadius: 50,
                                                            textTransform: 'none',
                                                            px: 3
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            onClick={() => rejectParentrequest(request._id)}
                                                            variant="outlined"
                                                            color="error"
                                                            sx={{
                                                                borderRadius: 50,
                                                                minWidth: 0,
                                                                px: 2
                                                            }}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            onClick={() => acceptParentrequest(request._id)}
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{
                                                                borderRadius: 50,
                                                                minWidth: 0,
                                                                px: 2
                                                            }}
                                                        >
                                                            Accept
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {parentRequest.filter(request => request.status === "pending").length > 0 && (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                component={Link}
                                to="/educator/parentsrequest"
                                variant="text"
                                endIcon={<ArrowRightAltIcon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                View All Requests
                            </Button>
                        </Box>
                    )}
                </motion.div>
            </Container>

            {/* Features Section */}
            <Box sx={{
                py: 8,
                background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)'
            }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h4" sx={{
                            fontWeight: 700,
                            mb: 6,
                            textAlign: 'center',
                            color: '#2E3B4E'
                        }}>
                            Your Educator Toolkit
                        </Typography>

                        <Grid container spacing={4}>
                            {[
                                {
                                    title: "Student Progress",
                                    description: "Track and analyze student development with our comprehensive dashboard.",
                                    icon: "📊"
                                },
                                {
                                    title: "Lesson Plans",
                                    description: "Create and manage customized lesson plans for each student's needs.",
                                    icon: "📝"
                                },
                                {
                                    title: "Collaboration",
                                    description: "Connect with parents and therapists for holistic child development.",
                                    icon: "🤝"
                                }
                            ].map((feature, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card sx={{
                                            height: '100%',
                                            borderRadius: 3,
                                            p: 4,
                                            textAlign: 'center',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                                            backgroundColor: 'white'
                                        }}>
                                            <Typography variant="h2" sx={{
                                                fontSize: '3rem',
                                                mb: 2,
                                                animation: `${floatAnimation} 4s ease-in-out infinite`,
                                                animationDelay: `${index * 0.5}s`
                                            }}>
                                                {feature.icon}
                                            </Typography>
                                            <Typography variant="h5" sx={{
                                                fontWeight: 600,
                                                mb: 2
                                            }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary">
                                                {feature.description}
                                            </Typography>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Modal for Parent Details */}
            <Modal
                open={openParent}
                onClose={handleParentClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openParent}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        width: { xs: '90%', md: '80%' },
                        maxWidth: '1000px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        borderRadius: 3
                    }}>
                        <EducatorViewParentDetails
                            acceptParentrequest={acceptParentrequest}
                            rejectParentrequest={rejectParentrequest}
                            handleParentClose={handleParentClose}
                            requestDetail={requestDetail}
                        />
                    </Box>
                </Fade>
            </Modal>

            <Footer userRole="educator" />        </Box>
    );
};

export default EducatorHome;