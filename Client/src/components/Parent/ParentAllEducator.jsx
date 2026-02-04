import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar'
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Box, Breadcrumbs, Button, Card, Fade, Grid, Modal, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneEnabledOutlinedIcon from '@mui/icons-material/PhoneEnabledOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { toast } from 'react-toastify';

const ParentAllEducator = () => {
    const [parentdetails, setParentdetails] = useState({});
    useEffect(() => {
        const parentdetails = localStorage.getItem("parentDetails");
        setParentdetails(JSON.parse(parentdetails));
    }, []);
    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/parent/profile');
    }
    const colors = {
        primary: '#2E3B4E',
        secondary: '#4A90E2',
        accent: '#FFAE00',
        lightBg: '#F8FAFC',
        cardBg: '#FFFFFF',
        textLight: '#7F7F7F'
    }
    const [allEducators, setAllEducators] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [educatorRatings, setEducatorRatings] = useState({});

    const fetchAllEducators = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/getalleducators`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAllEducators(response.data.educators);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch educators");
            toast.error(err.response?.data?.message || "Failed to fetch educators");
        } finally {
            setLoading(false);
        }
    };

    const fetchEducatorRatings = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/ratings/educator`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const ratingMap = {};
            response.data.data.forEach(rating => {
                if (!ratingMap[rating.professionalId._id]) {
                    ratingMap[rating.professionalId._id] = {
                        total: 0,
                        count: 0,
                        average: 0
                    };
                }
                ratingMap[rating.professionalId._id].total += rating.rating;
                ratingMap[rating.professionalId._id].count += 1;
                ratingMap[rating.professionalId._id].average =
                    ratingMap[rating.professionalId._id].total /
                    ratingMap[rating.professionalId._id].count;
            });
            setEducatorRatings(ratingMap);
        } catch (error) {
            console.error("Error fetching educator ratings:", error);
        }
    };

    useEffect(() => {
        fetchAllEducators();
        fetchEducatorRatings();
    }, []);

    // educator view model
    const educatorViewStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        borderRadius: "20px",
        boxShadow: 24,
        p: 4,
        height: "667px",
        width: { xs: "90%", md: "1080px" },
        background: colors.cardBg,
        overflowY: 'auto',
        maxHeight: '90vh'
    };

    const [educatorViewOpen, setEducatorViewOpen] = useState(false);
    const [singleEducator, setSingleEducator] = useState(null);
    const [educatorLoading, setEducatorLoading] = useState(false);

    const handleEducatorViewOpen = async (educatorId) => {
        try {
            setEducatorLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/educator/geteducator/${educatorId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSingleEducator(response.data.educator);
            setEducatorViewOpen(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch educator details");
            console.error("Error fetching educator:", err);
        } finally {
            setEducatorLoading(false);
        }
    };

    const handleEducatorViewClose = () => {
        setEducatorViewOpen(false);
        setSingleEducator(null);
    };

    // parent send request to educator
    const handleEducatorRequest = async () => {
        if (!singleEducator) return;

        try {
            const token = localStorage.getItem("token");
            const parentId = JSON.parse(localStorage.getItem("parentDetails"))._id;
            const recipientId = singleEducator._id;
            const recipientRole = "educator";
            const message = "I am interested in your educator services.";

            const requestData = {
                parentId,
                recipientId,
                recipientRole,
                message
            };

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/request/sendrequest`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.message === "Request sent successfully.") {
                toast.success("Request sent successfully.");
                handleEducatorViewClose();
            }
            else if (request.data.message === "Request already sent") {
                toast.error("You have already sent a request to another Educator.");
                handleTheraphistViewClose();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send request");
            console.error("Error sending request:", err);
        }
    };

    return (
        <>
            <ParentNavbar parentdetails={parentdetails} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Educator</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ marginTop: "20px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/parent/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Educators</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                            <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                            <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                        </Box>
                    </Box>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                        <Typography>Loading educators...</Typography>
                    </Box>
                ) : error ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3} sx={{ p: "20px 50px", justifyContent: "center" }}>
                        {allEducators.map((educator, index) => {
                            const ratingData = educatorRatings[educator._id] || { average: 0, count: 0 };
                            const averageRating = ratingData.average;
                            const reviewCount = ratingData.count;

                            return (
                                <Grid
                                    key={educator._id || index}
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        maxWidth: "400px",
                                        flexGrow: 1
                                    }}
                                >
                                    <Card sx={{
                                        width: "100%",
                                        height: "197px",
                                        borderRadius: "20px",
                                        padding: "20px",
                                        backgroundColor: "#F6F7F9"
                                    }}>
                                        <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: "157px" }}>
                                            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" sx={{ height: "150px", gap: "10px" }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ height: "150px", width: '150px', borderRadius: "10px", flexShrink: 0 }}
                                                    image={educator?.profilePic?.filename ?
                                                        `${import.meta.env.VITE_SERVER_URL}/uploads/${educator.profilePic.filename}` :
                                                        '/default-educator.png'}
                                                    alt="Profile"
                                                    onError={(e) => {
                                                        e.target.src = '/default-educator.png';
                                                    }}
                                                />
                                                <CardContent
                                                    sx={{
                                                        height: "150px",
                                                        overflow: "hidden",
                                                        padding: "10px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "space-between"
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography variant="h6" color='primary'>
                                                            {educator.name || "Educator Name"}
                                                        </Typography>
                                                        <Box display="flex" alignItems="center">
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
                                                            <Typography sx={{ ml: 1, fontSize: "12px" }}>
                                                                ({reviewCount})
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ borderBottom: "1px solid black" }} />

                                                    <Box>
                                                        <Typography sx={{ color: '#7F7F7F', fontSize: "12px", fontWeight: "500" }}>
                                                            {educator.yearsOfExperience ? `${educator.yearsOfExperience} years Experience` : "Experience not specified"}
                                                        </Typography>
                                                        <Typography
                                                            color='secondary'
                                                            sx={{ cursor: 'pointer' }}
                                                            onClick={() => handleEducatorViewOpen(educator._id)}
                                                        >
                                                            View
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                )}
            </Box>

            {/* educator view modal */}
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
                    <Box sx={educatorViewStyle}>
                        {educatorLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Typography>Loading educator details...</Typography>
                            </Box>
                        ) : singleEducator ? (
                            <>
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
                                            {singleEducator?.profilePic?.filename ? (
                                                <Avatar
                                                    src={`${import.meta.env.VITE_SERVER_URL}/uploads/${singleEducator.profilePic.filename}`}
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
                                                    {singleEducator.name?.charAt(0) || "E"}
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
                                                {singleEducator.name || "Educator Name"}
                                                {(() => {
                                                    const ratingData = educatorRatings[singleEducator._id] || { average: 0, count: 0 };
                                                    const averageRating = ratingData.average;
                                                    const reviewCount = ratingData.count;

                                                    return (
                                                        <Box sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            ml: 2
                                                        }}>
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
                                                        </Box>
                                                    );
                                                })()}
                                            </Typography>

                                            <Grid container spacing={3} sx={{ mt: 2 }}>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <MailOutlinedIcon sx={{ mr: 2, color: colors.textLight }} />
                                                        <Typography variant="body1" sx={{ color: colors.primary }}>
                                                            {singleEducator.email || "Not specified"}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <PhoneEnabledOutlinedIcon sx={{ mr: 2, color: colors.textLight }} />
                                                        <Typography variant="body1" sx={{ color: colors.primary }}>
                                                            {singleEducator.phone || "Not specified"}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <LocationOnOutlinedIcon sx={{ mr: 2, color: colors.textLight }} />
                                                        <Typography variant="body1" sx={{ color: colors.primary }}>
                                                            {singleEducator.address || "Not specified"}
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
                                                        {singleEducator.educationalQualification || "Not specified"}
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
                                                        {singleEducator.languages || "Not specified"}
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
                                                        {singleEducator.yearsOfExperience || "Not specified"}
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
                                                        {singleEducator.availability || "Not specified"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <Button
                                            onClick={handleEducatorRequest}
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
                            </>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Typography>No educator data available</Typography>
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default ParentAllEducator