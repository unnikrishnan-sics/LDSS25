import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar';
import "../../Styles/LandingPage.css";
import Navbar from '../Navbar/Navbar';
import { Avatar, Box, Button, Container, Divider, Fade, Grid, Modal, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import background from "../../assets/Frame 12@2x.png";
import image68 from "../../assets/image 68.png";
import image69 from "../../assets/image 69.png";
import image70 from "../../assets/image 70.png";
import image71 from "../../assets/image 71.png";
import verified from "../../assets/verified.png";
import VerifiedIcon from '@mui/icons-material/Verified';
import AVATAR1 from "../../assets/AVATAR1.png";
import AVATAR2 from "../../assets/AVATAR2.png";
import AVATAR3 from "../../assets/AVATAR3.png";
import AVATAR4 from "../../assets/AVATAR4.png";
import user from "../../assets/user.png";
import shopping from "../../assets/Shopping list.png";
import elearning from "../../assets/Elearning.png";
import keyFeatures1 from "../../assets/image 74.png";
import keyFeatures2 from "../../assets/image 73.png";
import keyFeatures3 from "../../assets/image 75.png";
import keyFeatures4 from "../../assets/image 72.png";
import frame1 from "../../assets/Frame 48095593.png";
import frame2 from "../../assets/Frame 48095594.png";
import Footer from '../Footer/Footer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { Link, useNavigate } from 'react-router-dom';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { toast } from 'react-toastify';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneEnabledOutlinedIcon from '@mui/icons-material/PhoneEnabledOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';

const ParentHome = () => {
    // Updated color palette
    const colors = {
        primary: '#2E3B4E',
        secondary: '#4A90E2',
        accent: '#FFAE00',
        lightBg: '#F8FAFC',
        cardBg: '#FFFFFF',
        textLight: '#7F7F7F'
    }

    const homebg = {
        backgroundColor: colors.lightBg
    }

    const [parent, setParent] = useState("");
    const [hasEducatorRequest, setHasEducatorRequest] = useState(false);
    const [hasTherapistRequest, setHasTherapistRequest] = useState(false);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const parent = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getparent/${decoded.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const parentDatas = localStorage.setItem("parentDetails", JSON.stringify(parent.data.parent));
        setParent(parent.data.parent);

        // Check if parent has any requests
        await checkParentRequests(decoded.id);
    }

    // Check if parent has any pending/accepted requests
    const checkParentRequests = async (parentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/request/fetchall`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const educatorRequests = response.data.requests.filter(
                request => request.parentId === parentId &&
                    (request.status === 'pending' || request.status === 'accepted') &&
                    request.recipientRole === 'educator'
            );

            const therapistRequests = response.data.requests.filter(
                request => request.parentId === parentId &&
                    (request.status === 'pending' || request.status === 'accepted') &&
                    request.recipientRole === 'theraphist'
            );

            setHasEducatorRequest(educatorRequests.length > 0);
            setHasTherapistRequest(therapistRequests.length > 0);
        } catch (error) {
            console.error("Error checking parent requests:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/parent/profile');
    }

    // view all educators
    const [alleducators, setAlleducators] = useState([]);
    const fetchAllEducators = async () => {
        const token = localStorage.getItem("token");
        const alleducators = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/getalleducators`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setAlleducators(alleducators.data.educators);
    }
    useEffect(() => {
        if (!hasEducatorRequest) {
            fetchAllEducators();
        }
    }, [hasEducatorRequest]);

    // educator view model
    const educatorViewstyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        borderRadius: "20px",
        boxShadow: 24,
        p: 4,
        height: "667px",
        width: "1080px",
        background: colors.cardBg,
        overflowY: 'auto',
        maxHeight: '90vh'
    };

    const [educatorViewOpen, setEducatorViewOpen] = useState(false);
    const [singleEducator, setSingleEducator] = useState({});
    const handleEducatorViewOpen = async (educatorId) => {
        const token = localStorage.getItem("token");
        const educator = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/geteducator/${educatorId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setSingleEducator(educator.data.educator);
        setEducatorViewOpen(true);
    }
    const handleEducatorViewClose = () => setEducatorViewOpen(false);

    // parent send request to educator
    const handleEducatorrequest = async () => {
        const token = localStorage.getItem("token");
        const parentId = JSON.parse(localStorage.getItem("parentDetails"))._id;
        const recipientId = singleEducator._id;
        const recipientRole = "educator";
        const message = "I am interested in your education services";
        const requestData = {
            parentId,
            recipientId,
            recipientRole,
            message
        }
        const request = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/request/sendrequest`, requestData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (request.data.message === "Request sent successfully.") {
            toast.success("Request sent successfully.");
            setHasEducatorRequest(true); // Update state to hide educators section
            handleEducatorViewClose();
        }
        else if (request.data.message === "Request already sent") {
            toast.error("You have already sent a request to another Educator.");
            handleEducatorViewClose();
        }
    };

    // all theraphist view 
    const [allTheraphist, setAllTheraphist] = useState([]);
    const fetchAllTheraphist = async () => {
        const token = localStorage.getItem("token");
        const alltheraphist = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/getalltheraphist`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setAllTheraphist(alltheraphist.data.theraphist);
    }
    useEffect(() => {
        if (!hasTherapistRequest) {
            fetchAllTheraphist();
        }
    }, [hasTherapistRequest]);

    // theraphist view model
    const theraphistViewstyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        borderRadius: "20px",
        boxShadow: 24,
        p: 4,
        height: "667px",
        width: "1080px",
        background: colors.cardBg,
        overflowY: 'auto',
        maxHeight: '90vh'
    };

    const [theraphistViewOpen, setTheraphistViewOpen] = useState(false);
    const [singleTheraphist, setSingleTheraphist] = useState({});
    const handleTheraphistViewOpen = async (theraphistId) => {
        const token = localStorage.getItem("token");
        const theraphist = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${theraphistId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setSingleTheraphist(theraphist.data.theraphist);
        setTheraphistViewOpen(true);
    }
    const handleTheraphistViewClose = () => setTheraphistViewOpen(false);

    // parent send request to theraphist
    const handleTheraphistrequest = async () => {
        const token = localStorage.getItem("token");
        const parentId = JSON.parse(localStorage.getItem("parentDetails"))._id;
        const recipientId = singleTheraphist._id;
        const recipientRole = "theraphist";
        const message = "I am interested in your therapist services.";
        const requestData = {
            parentId,
            recipientId,
            recipientRole,
            message
        }
        const request = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/request/sendrequest`, requestData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (request.data.message === "Request sent successfully.") {
            toast.success("Request sent successfully.");
            setHasTherapistRequest(true); // Update state to hide therapists section
            handleTheraphistViewClose();
        }
        else if (request.data.message === "Request already sent") {
            toast.error("You have already sent a request to another Therapist.");
            handleTheraphistViewClose();
        }
    }

    const [educatorRatings, setEducatorRatings] = useState({});
    const [therapistRatings, setTherapistRatings] = useState({});

    useEffect(() => {
        const fetchRatings = async () => {
            const token = localStorage.getItem("token");

            try {
                // Fetch educator ratings
                const educatorRes = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/ldss/ratings/educator`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Create a map of educatorId to average rating
                const educatorRatingMap = {};
                educatorRes.data.data.forEach(rating => {
                    if (!educatorRatingMap[rating.professionalId._id]) {
                        educatorRatingMap[rating.professionalId._id] = {
                            total: 0,
                            count: 0,
                            average: 0
                        };
                    }
                    educatorRatingMap[rating.professionalId._id].total += rating.rating;
                    educatorRatingMap[rating.professionalId._id].count += 1;
                    educatorRatingMap[rating.professionalId._id].average =
                        educatorRatingMap[rating.professionalId._id].total /
                        educatorRatingMap[rating.professionalId._id].count;
                });
                setEducatorRatings(educatorRatingMap);

                // Fetch therapist ratings
                const therapistRes = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/ldss/ratings/theraphist`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Create a map of therapistId to average rating
                const therapistRatingMap = {};
                therapistRes.data.data.forEach(rating => {
                    if (!therapistRatingMap[rating.professionalId._id]) {
                        therapistRatingMap[rating.professionalId._id] = {
                            total: 0,
                            count: 0,
                            average: 0
                        };
                    }
                    therapistRatingMap[rating.professionalId._id].total += rating.rating;
                    therapistRatingMap[rating.professionalId._id].count += 1;
                    therapistRatingMap[rating.professionalId._id].average =
                        therapistRatingMap[rating.professionalId._id].total /
                        therapistRatingMap[rating.professionalId._id].count;
                });
                setTherapistRatings(therapistRatingMap);

            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };

        fetchRatings();
    }, []);

    return (
        <>
            <ParentNavbar homebg={homebg} navigateToProfile={navigateToProfile} parentdetails={parent} />

            {/* Hero Section */}
            <Box sx={{
                backgroundColor: colors.secondary,
                backgroundImage: `linear-gradient(135deg, ${colors.secondary} 0%, #6BB1FF 100%)`,
                color: 'white',
                py: 10,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                px: 2,
                                py: 1,
                                borderRadius: 4,
                                mb: 2
                            }}>
                                <StarIcon sx={{ mr: 1, color: colors.accent }} />
                                <Typography variant="body2">Welcome to Learn Hub</Typography>
                            </Box>

                            <Typography variant="h2" sx={{
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                lineHeight: 1.2
                            }}>
                                Empowering Every Child's Learning Journey
                            </Typography>

                            <Typography variant="body1" sx={{
                                mb: 4,
                                fontSize: '1.1rem',
                                opacity: 0.9,
                                maxWidth: '90%'
                            }}>
                                A one-stop platform connecting parents, educators, and therapists to support children with learning disabilities through personalized learning plans, activity tracking, and seamless collaboration.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                position: 'relative',
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: 6,
                                height: { xs: 300, md: 400 },
                                '& img': {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }
                            }}>
                                <img src={image68} alt="Children learning" />

                                <Box sx={{
                                    position: 'absolute',
                                    top: 20,
                                    left: -20,
                                    backgroundColor: 'white',
                                    p: 1.5,
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <VerifiedIcon color="primary" />
                                    <Typography variant="body2" sx={{ ml: 1, color: colors.primary }}>
                                        Thousands of Verified Educators & Therapists!
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -40,
                                    right: -20,
                                    backgroundColor: colors.lightBg,
                                    p: 2,
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    width: 180
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mb: 1
                                    }}>
                                        {[AVATAR1, AVATAR2, AVATAR3, AVATAR4].map((avatar, index) => (
                                            <Avatar
                                                key={index}
                                                src={avatar}
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    ml: index > 0 ? -1.5 : 0,
                                                    border: '2px solid white'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Typography variant="body2" align="center" sx={{ color: colors.primary }}>
                                        200k+ Learning
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* How It Works Section */}
            <Box sx={{ py: 10, backgroundColor: colors.lightBg }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: colors.primary
                        }}>
                            How It Works
                        </Typography>
                        <Typography variant="body1" sx={{
                            color: colors.textLight,
                            maxWidth: 600,
                            mx: 'auto'
                        }}>
                            Find the perfect learning support in just a few steps
                        </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                backgroundColor: colors.cardBg,
                                p: 4,
                                borderRadius: 3,
                                height: '100%',
                                textAlign: 'center',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                                }
                            }}>
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: `${colors.secondary}20`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    <img src={user} alt="Profile" style={{ width: 40 }} />
                                </Box>
                                <Typography variant="h5" sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    color: colors.primary
                                }}>
                                    Build Profiles
                                </Typography>
                                <Typography variant="body1" sx={{ color: colors.textLight }}>
                                    Parents add child details; educators & therapists set expertise.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                backgroundColor: colors.cardBg,
                                p: 4,
                                borderRadius: 3,
                                height: '100%',
                                textAlign: 'center',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                                }
                            }}>
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: `${colors.secondary}20`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    <img src={elearning} alt="Learning" style={{ width: 40 }} />
                                </Box>
                                <Typography variant="h5" sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    color: colors.primary
                                }}>
                                    Start Learning
                                </Typography>
                                <Typography variant="body1" sx={{ color: colors.textLight }}>
                                    Access personalized plans, track progress, and collaborate.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                backgroundColor: colors.cardBg,
                                p: 4,
                                borderRadius: 3,
                                height: '100%',
                                textAlign: 'center',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                                }
                            }}>
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: `${colors.secondary}20`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    <img src={shopping} alt="Monitor" style={{ width: 40 }} />
                                </Box>
                                <Typography variant="h5" sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    color: colors.primary
                                }}>
                                    Monitor & Improve
                                </Typography>
                                <Typography variant="body1" sx={{ color: colors.textLight }}>
                                    Receive insights, expert advice, and ongoing support.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Educators Section - Only show if no educator requests */}
            {!hasEducatorRequest && (
                <Box sx={{ py: 10, backgroundColor: `${colors.secondary}08` }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="h3" sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: colors.primary
                            }}>
                                Our Educators
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: colors.textLight,
                                maxWidth: 600,
                                mx: 'auto'
                            }}>
                                Create personalized learning plans, track student progress, and collaborate with parents and therapists to support every child's educational journey.
                            </Typography>
                        </Box>

                        <Grid container spacing={4} justifyContent="center">
                            {alleducators
                                .slice(0, 3)
                                .map(educator => {
                                    const ratingData = educatorRatings[educator._id] || { average: 0, count: 0 };
                                    return { ...educator, averageRating: ratingData.average, reviewCount: ratingData.count };
                                })
                                .sort((a, b) => b.averageRating - a.averageRating) // Sort by highest rating first
                                .map((educator, index) => {
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Card sx={{
                                                height: '100%',
                                                borderRadius: 3,
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                                transition: 'transform 0.3s, box-shadow 0.3s',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                                                }
                                            }}>
                                                <CardActionArea onClick={() => handleEducatorViewOpen(educator._id)}>
                                                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                            <Avatar
                                                                src={`${import.meta.env.VITE_SERVER_URL}/uploads/${educator?.profilePic?.filename}`}
                                                                sx={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    mr: 3,
                                                                    border: `2px solid ${colors.secondary}`
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary }}>
                                                                    {educator.name}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: colors.textLight }}>
                                                                    {educator.educationalQualification}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <StarIcon
                                                                            key={star}
                                                                            fontSize="small"
                                                                            sx={{
                                                                                color: star <= Math.floor(educator.averageRating)
                                                                                    ? colors.accent
                                                                                    : star - 0.5 <= educator.averageRating
                                                                                        ? `${colors.accent}80`
                                                                                        : '#DDD'
                                                                            }}
                                                                        />
                                                                    ))}
                                                                    <Typography variant="body2" sx={{ ml: 1, color: colors.textLight }}>
                                                                        ({educator.reviewCount || 0})
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>

                                                        <Divider sx={{ my: 2 }} />

                                                        <Box sx={{ mt: 'auto' }}>
                                                            <Typography variant="body2" sx={{ color: colors.textLight, mb: 1 }}>
                                                                {educator.yearsOfExperience} years Experience
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: colors.textLight, mb: 2 }}>
                                                                {educator.availability}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: colors.secondary,
                                                                    fontWeight: 600,
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                View Profile <ArrowRightAltIcon sx={{ ml: 0.5 }} />
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                        </Grid>

                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button
                                component={Link}
                                to="/parent/viewalleducators"
                                variant="outlined"
                                color="primary"
                                endIcon={<ArrowRightAltIcon />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 50,
                                    fontWeight: 600,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2
                                    }
                                }}
                            >
                                View All Educators
                            </Button>
                        </Box>
                    </Container>
                </Box>
            )}

            {/* Educator View Modal */}
            <Modal
                open={educatorViewOpen}
                onClose={handleEducatorViewClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={educatorViewOpen}>
                    <Box sx={educatorViewstyle}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 4,
                            pb: 2,
                            borderBottom: `1px solid ${colors.lightBg}`
                        }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary }}>
                                Educator Profile
                            </Typography>
                            <CloseIcon
                                onClick={handleEducatorViewClose}
                                sx={{
                                    cursor: 'pointer',
                                    color: colors.textLight,
                                    '&:hover': {
                                        color: colors.primary
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 5 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 4,
                                flexDirection: { xs: 'column', md: 'row' }
                            }}>
                                <Box sx={{
                                    width: { xs: '100%', md: 'auto' },
                                    mb: { xs: 3, md: 0 },
                                    mr: { xs: 0, md: 5 },
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {singleEducator.profilePic?.filename ? (
                                        <Avatar
                                            src={`${import.meta.env.VITE_SERVER_URL}/uploads/${singleEducator?.profilePic?.filename}`}
                                            sx={{
                                                width: 150,
                                                height: 150,
                                                border: `3px solid ${colors.secondary}`
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                width: 150,
                                                height: 150,
                                                fontSize: 60,
                                                bgcolor: colors.secondary
                                            }}
                                        >
                                            {singleEducator.name?.charAt(0)}
                                        </Avatar>
                                    )}
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: colors.primary,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        {singleEducator.name}
                                        {singleEducator._id && (
                                            <Box sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                ml: 2
                                            }}>
                                                {(() => {
                                                    const ratingData = educatorRatings[singleEducator._id] || { average: 0, count: 0 };
                                                    const averageRating = ratingData.average;
                                                    const reviewCount = ratingData.count;

                                                    return (
                                                        <>
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <StarIcon
                                                                    key={star}
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: star <= Math.floor(averageRating)
                                                                            ? colors.accent
                                                                            : star - 0.5 <= averageRating
                                                                                ? `${colors.accent}80`
                                                                                : '#DDD'
                                                                    }}
                                                                />
                                                            ))}
                                                            <Typography variant="body2" sx={{ ml: 1, color: colors.textLight }}>
                                                                ({reviewCount})
                                                            </Typography>
                                                        </>
                                                    );
                                                })()}
                                            </Box>
                                        )}
                                    </Typography>

                                    <Grid container spacing={3} sx={{ mt: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <MailOutlinedIcon sx={{ mr: 2, color: colors.textLight }} />
                                                <Typography variant="body1" sx={{ color: colors.primary }}>
                                                    {singleEducator.email || "Not Updated"}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PhoneEnabledOutlinedIcon sx={{ mr: 2, color: colors.textLight }} />
                                                <Typography variant="body1" sx={{ color: colors.primary }}>
                                                    {singleEducator.phone || "Not Updated"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationOnOutlinedIcon sx={{ mr: 2, color: colors.textLight }} />
                                                <Typography variant="body1" sx={{ color: colors.primary }}>
                                                    {singleEducator.address || "Not Updated"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>

                            <Box sx={{
                                backgroundColor: `${colors.secondary}08`,
                                borderRadius: 3,
                                p: 4,
                                mb: 4
                            }}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 600,
                                    mb: 3,
                                    color: colors.primary
                                }}>
                                    Professional Information
                                </Typography>

                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 600,
                                                color: colors.secondary,
                                                mb: 1
                                            }}>
                                                Educational Qualifications
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: colors.primary }}>
                                                {singleEducator.educationalQualification || "Not Updated"}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 600,
                                                color: colors.secondary,
                                                mb: 1
                                            }}>
                                                Languages Spoken
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: colors.primary }}>
                                                {singleEducator.languages || "Not Updated"}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 600,
                                                color: colors.secondary,
                                                mb: 1
                                            }}>
                                                Years of Experience
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: colors.primary }}>
                                                {singleEducator.yearsOfExperience || "Not Updated"}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 600,
                                                color: colors.secondary,
                                                mb: 1
                                            }}>
                                                Availability
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: colors.primary }}>
                                                {singleEducator.availability || "Not Updated"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    onClick={handleEducatorrequest}
                                    variant="contained"
                                    color="primary"
                                    endIcon={<ArrowRightAltIcon />}
                                    sx={{
                                        px: 6,
                                        py: 1.5,
                                        borderRadius: 50,
                                        fontWeight: 600,
                                        fontSize: '1rem'
                                    }}
                                >
                                    Send Request
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Therapists Section - Only show if no therapist requests */}
            {!hasTherapistRequest && (
                <Box sx={{ py: 10, backgroundColor: colors.lightBg }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="h3" sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: colors.primary
                            }}>
                                Our Therapists
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: colors.textLight,
                                maxWidth: 600,
                                mx: 'auto'
                            }}>
                                Monitor developmental progress, assign therapy-based activities, and collaborate with parents and educators to provide holistic support.
                            </Typography>
                        </Box>

                        <Grid container spacing={4} justifyContent="center">
                            {allTheraphist
                                .slice(0, 3)
                                .map(therapist => {
                                    const ratingData = therapistRatings[therapist._id] || { average: 0, count: 0 };
                                    return { ...therapist, averageRating: ratingData.average, reviewCount: ratingData.count };
                                })
                                .sort((a, b) => b.averageRating - a.averageRating) // Sort by highest rating first
                                .map((therapist, index) => {
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Card sx={{
                                                height: '100%',
                                                borderRadius: 3,
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                                transition: 'transform 0.3s, box-shadow 0.3s',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                                                }
                                            }}>
                                                <CardActionArea onClick={() => handleTheraphistViewOpen(therapist._id)}>
                                                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                            <Avatar
                                                                src={`${import.meta.env.VITE_SERVER_URL}/uploads/${therapist?.profilePic?.filename}`}
                                                                sx={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    mr: 3,
                                                                    border: `2px solid ${colors.secondary}`
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary }}>
                                                                    {therapist.name}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: colors.textLight }}>
                                                                    {therapist.educationalQualification}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <StarIcon
                                                                            key={star}
                                                                            fontSize="small"
                                                                            sx={{
                                                                                color: star <= Math.floor(therapist.averageRating)
                                                                                    ? colors.accent
                                                                                    : star - 0.5 <= therapist.averageRating
                                                                                        ? `${colors.accent}80`
                                                                                        : '#DDD'
                                                                            }}
                                                                        />
                                                                    ))}
                                                                    <Typography variant="body2" sx={{ ml: 1, color: colors.textLight }}>
                                                                        ({therapist.reviewCount || 0})
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>

                                                        <Divider sx={{ my: 2 }} />

                                                        <Box sx={{ mt: 'auto' }}>
                                                            <Typography variant="body2" sx={{ color: colors.textLight, mb: 1 }}>
                                                                {therapist.yearsOfExperience} years Experience
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: colors.textLight, mb: 2 }}>
                                                                {therapist.availability}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: colors.secondary,
                                                                    fontWeight: 600,
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                View Profile <ArrowRightAltIcon sx={{ ml: 0.5 }} />
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                        </Grid>

                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button
                                component={Link}
                                to="/parent/viewalltheraphist"
                                variant="outlined"
                                color="primary"
                                endIcon={<ArrowRightAltIcon />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 50,
                                    fontWeight: 600,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2
                                    }
                                }}
                            >
                                View All Therapists
                            </Button>
                        </Box>
                    </Container>
                </Box>
            )}

            {/* Therapist View Modal */}
            <Modal
                open={theraphistViewOpen}
                onClose={handleTheraphistViewClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={theraphistViewOpen}>
                    <Box sx={theraphistViewstyle}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 4,
                            pb: 2,
                            borderBottom: `1px solid ${colors.lightBg}`
                        }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary }}>
                                Therapist Profile
                            </Typography>
                            <CloseIcon
                                onClick={handleTheraphistViewClose}
                                sx={{
                                    cursor: 'pointer',
                                    color: colors.textLight,
                                    '&:hover': {
                                        color: colors.primary
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 5 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 4,
                                flexDirection: { xs: 'column', md: 'row' }
                            }}>
                                <Box sx={{
                                    width: { xs: '100%', md: 'auto' },
                                    mb: { xs: 3, md: 0 },
                                    mr: { xs: 0, md: 5 },
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {singleTheraphist.profilePic?.filename ? (
                                        <Avatar
                                            src={`${import.meta.env.VITE_SERVER_URL}/uploads/${singleTheraphist?.profilePic?.filename}`}
                                            sx={{
                                                width: 150,
                                                height: 150,
                                                border: `3px solid ${colors.secondary}`
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                width: 150,
                                                height: 150,
                                                fontSize: 60,
                                                bgcolor: colors.secondary
                                            }}
                                        >
                                            {singleTheraphist.name?.charAt(0)}
                                        </Avatar>
                                    )}
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: colors.primary,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        {singleTheraphist.name}
                                        {singleTheraphist._id && (
                                            <Box sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                ml: 2
                                            }}>
                                                {(() => {
                                                    const ratingData = therapistRatings[singleTheraphist._id] || { average: 0, count: 0 };
                                                    const averageRating = ratingData.average;
                                                    const reviewCount = ratingData.count;

                                                    return (
                                                        <>
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <StarIcon
                                                                    key={star}
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: star <= Math.floor(averageRating)
                                                                            ? colors.accent
                                                                            : star - 0.5 <= averageRating
                                                                                ? `${colors.accent}80`
                                                                                : '#DDD'
                                                                    }}
                                                                />
                                                            ))}
                                                            <Typography variant="body2" sx={{ ml: 1, color: colors.textLight }}>
                                                                ({reviewCount})
                                                            </Typography>
                                                        </>
                                                    );
                                                })()}
                                            </Box>
                                        )}
                                    </Typography>

                                    <Grid container spacing={3} sx={{ mt: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <MailOutlinedIcon sx={{ mr: 2, color: colors.textLight }} />
                                                <Typography variant="body1" sx={{ color: colors.primary }}>
                                                    {singleTheraphist.email || "Not Updated"}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PhoneEnabledOutlinedIcon sx={{ mr: 2, color: colors.textLight }} />
                                                <Typography variant="body1" sx={{ color: colors.primary }}>
                                                    {singleTheraphist.phone || "Not Updated"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationOnOutlinedIcon sx={{ mr: 2, color: colors.textLight }} />
                                                <Typography variant="body1" sx={{ color: colors.primary }}>
                                                    {singleTheraphist.address || "Not Updated"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>

                            <Box sx={{
                                backgroundColor: `${colors.secondary}08`,
                                borderRadius: 3,
                                p: 4,
                                mb: 4
                            }}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 600,
                                    mb: 3,
                                    color: colors.primary
                                }}>
                                    Professional Information
                                </Typography>

                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 600,
                                                color: colors.secondary,
                                                mb: 1
                                            }}>
                                                Educational Qualifications
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: colors.primary }}>
                                                {singleTheraphist.educationalQualification || "Not Updated"}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 600,
                                                color: colors.secondary,
                                                mb: 1
                                            }}>
                                                Languages Spoken
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: colors.primary }}>
                                                {singleTheraphist.languages || "Not Updated"}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 600,
                                                color: colors.secondary,
                                                mb: 1
                                            }}>
                                                Years of Experience
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: colors.primary }}>
                                                {singleTheraphist.yearsOfExperience || "Not Updated"}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 600,
                                                color: colors.secondary,
                                                mb: 1
                                            }}>
                                                Availability
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: colors.primary }}>
                                                {singleTheraphist.availability || "Not Updated"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    onClick={handleTheraphistrequest}
                                    variant="contained"
                                    color="primary"
                                    endIcon={<ArrowRightAltIcon />}
                                    sx={{
                                        px: 6,
                                        py: 1.5,
                                        borderRadius: 50,
                                        fontWeight: 600,
                                        fontSize: '1rem'
                                    }}
                                >
                                    Send Request
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Personalized Learning Section */}
            <Box sx={{
                py: 10,
                backgroundColor: colors.secondary,
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Container maxWidth="lg">
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.05,
                        zIndex: 0
                    }}>
                        <Box component="img" src={frame1} alt="Decoration" sx={{ position: 'absolute', top: -50, left: 0 }} />
                        <Box component="img" src={frame2} alt="Decoration" sx={{ position: 'absolute', bottom: -50, right: 0 }} />
                    </Box>

                    <Box sx={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        maxWidth: 800,
                        mx: 'auto'
                    }}>
                        <Typography variant="h3" sx={{
                            fontWeight: 700,
                            mb: 3,
                            fontSize: { xs: '2rem', md: '2.5rem' }
                        }}>
                            Personalized Learning Plans!
                        </Typography>
                        <Typography variant="body1" sx={{
                            fontSize: '1.1rem',
                            opacity: 0.9,
                            lineHeight: 1.6
                        }}>
                            Tailored daily or weekly activities designed to support your child's unique learning needs. Created by educators and therapists, these plans adapt based on your child's progress and goals.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            <Footer userRole="parent" />         </>
    )
}

export default ParentHome