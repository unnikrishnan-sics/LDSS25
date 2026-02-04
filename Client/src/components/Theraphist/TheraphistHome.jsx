import React, { useEffect, useState } from 'react';
import TheraphistNavbar from '../Navbar/TheraphistNavbar';
import { Box, Button, Container, Typography, Card, CardContent, CardMedia, Grid, Stack, Modal, Fade, Backdrop } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import TherapistViewParentDetails from './Common/TherapistViewParentDetails';
import Footer from '../Footer/Footer';
import { keyframes } from '@mui/system';

// Using only assets from original code
import background from "../../assets/Frame 12@2x.png";
import image68 from "../../assets/image 68.png";
import image69 from "../../assets/image 69.png";
import image70 from "../../assets/image 70.png";
import image71 from "../../assets/image 71.png";
import AVATAR1 from "../../assets/AVATAR1.png";
import AVATAR2 from "../../assets/AVATAR2.png";
import AVATAR3 from "../../assets/AVATAR3.png";
import AVATAR4 from "../../assets/AVATAR4.png";
import user from "../../assets/user.png";
import shopping from "../../assets/Shopping list.png";
import elearning from "../../assets/Elearning.png";

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const TheraphistHome = () => {
    // All existing state and functions remain exactly the same
    const [therapistDetails, setTherapistDetails] = useState({});
    const [parentRequest, setParentRequest] = useState([]);
    const [requestDetail, setRequestDetail] = useState(null);
    const [openParent, setOpenParent] = useState(false);
    const navigate = useNavigate();

    const fetchTherapist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const decoded = jwtDecode(token);
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${decoded.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data?.theraphist) {
                const data = response.data.theraphist;
                localStorage.setItem("theraphistDetails", JSON.stringify(data));
                setTherapistDetails(data);
            }
        } catch (error) {
            console.error("Error fetching therapist:", error);
        }
    };

    const fetchParentsRequest = async () => {
        try {
            const token = localStorage.getItem("token");
            const therapistId = therapistDetails._id;
            if (!therapistId) return;
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/parentsrequest/${therapistId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data?.request) {
                setParentRequest(response.data.request);
            }
        } catch (error) {
            console.error("Failed to fetch parent requests:", error);
        }
    };

    const fetchParentByRequestId = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/viewrequestedparent/${requestId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data?.viewRequest) {
                setRequestDetail(response.data.viewRequest);
                setOpenParent(true);
            }
        } catch (error) {
            console.error("Failed to fetch parent details:", error);
        }
    };

    const acceptParentRequest = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/acceptrequest/${requestId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchParentsRequest();
            setOpenParent(false);
        } catch (error) {
            console.error("Failed to accept request:", error);
        }
    };

    const rejectParentRequest = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/rejectrequest/${requestId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchParentsRequest();
            setOpenParent(false);
        } catch (error) {
            console.error("Failed to reject request:", error);
        }
    };

    const handleParentClose = () => {
        setOpenParent(false);
        setRequestDetail(null);
    };

    useEffect(() => {
        fetchTherapist();
    }, []);

    useEffect(() => {
        if (therapistDetails._id) {
            fetchParentsRequest();
        }
    }, [therapistDetails]);

    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    return (
        <>
            <TheraphistNavbar
                theraphistdetails={therapistDetails}
                navigateToProfile={navigateToProfile}
            />

            {/* Hero Section - Completely redesigned */}
            <Box sx={{
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(rgba(246, 247, 249, 0.9), rgba(246, 247, 249, 0.9)), url(${background})`,
                backgroundSize: 'cover',
                py: 10,
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Container maxWidth="xl">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                animation: `${pulseAnimation} 2s infinite`,
                                backgroundColor: 'rgba(25, 103, 210, 0.1)',
                                borderRadius: '50px',
                                px: 2,
                                py: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                mb: 3
                            }}>
                                <StarIcon sx={{ color: '#FFAE00', mr: 1 }} />
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1967D2' }}>
                                    Welcome to Learn Hub
                                </Typography>
                            </Box>
                            <Typography variant="h1" sx={{
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                fontWeight: 800,
                                lineHeight: 1.2,
                                mb: 3,
                                color: '#1967D2'
                            }}>
                                Empowering Every Child's Learning Journey
                            </Typography>
                            <Typography variant="h5" sx={{
                                fontSize: '1.2rem',
                                color: '#4A5568',
                                mb: 4,
                                maxWidth: '90%'
                            }}>
                                A one-stop platform connecting parents, educators, and therapists to support children with learning disabilities.
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{
                                    borderRadius: '50px',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 14px rgba(25, 103, 210, 0.3)',
                                    '&:hover': {
                                        animation: `${pulseAnimation} 1s infinite`
                                    }
                                }}
                                onClick={() => document.getElementById('requests-section').scrollIntoView({ behavior: 'smooth' })}
                            >
                                View Requests
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                position: 'relative',
                                height: '500px',
                                '& > *': {
                                    position: 'absolute',
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        zIndex: 2
                                    }
                                }
                            }}>
                                <Box
                                    component="img"
                                    src={image68}
                                    alt="Therapy session"
                                    sx={{
                                        width: '60%',
                                        top: '10%',
                                        left: '5%',
                                        animation: `${floatAnimation} 6s ease-in-out infinite`
                                    }}
                                />
                                <Box
                                    component="img"
                                    src={image69}
                                    alt="Happy child"
                                    sx={{
                                        width: '30%',
                                        top: '5%',
                                        right: '10%',
                                        animation: `${floatAnimation} 5s ease-in-out infinite`,
                                        animationDelay: '0.5s'
                                    }}
                                />
                                <Box
                                    component="img"
                                    src={image70}
                                    alt="Learning materials"
                                    sx={{
                                        width: '35%',
                                        bottom: '15%',
                                        left: '15%',
                                        animation: `${floatAnimation} 7s ease-in-out infinite`,
                                        animationDelay: '1s'
                                    }}
                                />
                                <Box
                                    component="img"
                                    src={image71}
                                    alt="Therapist working"
                                    sx={{
                                        width: '50%',
                                        bottom: '10%',
                                        right: '5%',
                                        animation: `${floatAnimation} 6.5s ease-in-out infinite`,
                                        animationDelay: '1.5s'
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>



            {parentRequest.filter(request => request.status === "pending").length > 0 && (
                <Box id="requests-section" sx={{ py: 8, backgroundColor: '#F0F6FE' }}>
                    <Container maxWidth="xl">
                        <Box textAlign="center" mb={6}>
                            <Typography variant="h2" sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 800,
                                mb: 2,
                                position: 'relative',
                                display: 'inline-block',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '80px',
                                    height: '4px',
                                    backgroundColor: '#1967D2',
                                    borderRadius: '2px'
                                }
                            }}>
                                Parent's Requests
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#718096', maxWidth: '600px', mx: 'auto' }}>
                                Review and respond to requests from parents seeking your expertise
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {parentRequest.filter(request => request.status === "pending").map((request, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card sx={{
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                                        }
                                    }}>
                                        <Box sx={{ p: 3, flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                <Box sx={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    flexShrink: 0,
                                                    mr: 3,
                                                    position: 'relative'
                                                }}>
                                                    <CardMedia
                                                        component="img"
                                                        image={`${import.meta.env.VITE_SERVER_URL}/uploads/${request.parentId.profilePic?.filename}`}
                                                        alt="Parent profile"
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                    <VerifiedIcon sx={{
                                                        position: 'absolute',
                                                        bottom: 5,
                                                        right: 5,
                                                        color: '#1967D2',
                                                        backgroundColor: 'white',
                                                        borderRadius: '50%',
                                                        padding: '2px'
                                                    }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                        {request.parentId.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#718096', mb: 1 }}>
                                                        {request.parentId.address}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#718096' }}>
                                                        {request.parentId.phone}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            px: 3,
                                            pb: 3,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Button
                                                onClick={() => fetchParentByRequestId(request._id)}
                                                sx={{
                                                    textTransform: 'none',
                                                    color: '#1967D2',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                            >
                                                View Child
                                            </Button>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    onClick={() => rejectParentRequest(request._id)}
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: '50px',
                                                        px: 2,
                                                        py: 0.5,
                                                        borderColor: '#E53E3E',
                                                        color: '#E53E3E',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(229, 62, 62, 0.04)',
                                                            borderColor: '#E53E3E'
                                                        }
                                                    }}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    onClick={() => acceptParentRequest(request._id)}
                                                    variant="contained"
                                                    sx={{
                                                        borderRadius: '50px',
                                                        px: 2,
                                                        py: 0.5,
                                                        backgroundColor: '#1967D2',
                                                        '&:hover': {
                                                            backgroundColor: '#1659b5'
                                                        }
                                                    }}
                                                >
                                                    Accept
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box textAlign="center" mt={6}>
                            <Link
                                to="/therapist/parentsrequest"
                                style={{ textDecoration: 'none' }}
                            >
                                <Button
                                    variant="text"
                                    endIcon={<ArrowRightAltIcon />}
                                    sx={{
                                        color: '#1967D2',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 103, 210, 0.04)'
                                        }
                                    }}
                                >
                                    View All Requests
                                </Button>
                            </Link>
                        </Box>
                    </Container>
                </Box>
            )}



            {/* How It Works Section - Redesigned */}
            <Box sx={{ py: 7, backgroundColor: 'white' }}>
                <Container maxWidth="xs">
                    <Box textAlign="center" mb={5}>
                        <Typography variant="h2" sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 800,
                            mb: 2
                        }}>
                            How It Works
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#718096', maxWidth: '500px', mx: 'auto' }}>
                            Find the perfect learning in just a few steps
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={11} md={3}>
                            <Box sx={{
                                p: 3,
                                height: '100%',
                                backgroundColor: '#F8FAFF',
                                borderRadius: '16px',
                                textAlign: 'center',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.03)',
                                border: '1px solid rgba(25, 103, 210, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                                }
                            }}>
                                <Box sx={{
                                    width: '70px',
                                    height: '80px',
                                    backgroundColor: 'rgba(25, 103, 210, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    <Box component="img" src={user} alt="Step 1" sx={{ width: '35px' }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                                    Build Profiles
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#718096' }}>
                                    Parents add child details; educators & therapists set expertise.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                p: 4,
                                height: '100%',
                                backgroundColor: '#F8FAFF',
                                borderRadius: '16px',
                                textAlign: 'center',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.03)',
                                border: '1px solid rgba(25, 103, 210, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                                }
                            }}>
                                <Box sx={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: 'rgba(25, 103, 210, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    <Box component="img" src={elearning} alt="Step 2" sx={{ width: '35px' }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                    Start Learning
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#718096' }}>
                                    Access personalized plans, track progress, and collaborate.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                p: 4,
                                height: '100%',
                                backgroundColor: '#F8FAFF',
                                borderRadius: '16px',
                                textAlign: 'center',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.03)',
                                border: '1px solid rgba(25, 103, 210, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                                }
                            }}>
                                <Box sx={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: 'rgba(25, 103, 210, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    <Box component="img" src={shopping} alt="Step 3" sx={{ width: '40px' }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                    Monitor & Improve
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#718096' }}>
                                    Receive insights, expert advice, and ongoing support.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Modal
                open={openParent}
                onClose={handleParentClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={openParent}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        width: { xs: '90%', md: '80%' },
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        {requestDetail && (
                            <TherapistViewParentDetails
                                handleParentClose={handleParentClose}
                                requestDetail={requestDetail}
                                onAccept={() => acceptParentRequest(requestDetail._id)}
                                onReject={() => rejectParentRequest(requestDetail._id)}
                            />
                        )}
                    </Box>
                </Fade>
            </Modal>

            <Footer userRole="therapist" />        </>
    );
};

export default TheraphistHome;