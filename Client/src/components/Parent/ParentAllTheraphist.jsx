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

const ParentAllTheraphist = () => {
    const colors = {
        primary: '#2E3B4E',
        secondary: '#4A90E2',
        accent: '#FFAE00',
        lightBg: '#F8FAFC',
        cardBg: '#FFFFFF',
        textLight: '#7F7F7F'
    }

    const [parentdetails, setParentdetails] = useState({});
    useEffect(() => {
        const parentdetails = localStorage.getItem("parentDetails");
        setParentdetails(JSON.parse(parentdetails));
    }, []);

    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/parent/profile');
    }

    const [allTheraphist, setAllTheraphist] = useState([]);
    const [therapistRatings, setTherapistRatings] = useState({});

    const fetchAllTheraphist = async () => {
        const token = localStorage.getItem("token");
        const alltheraphist = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/getalltheraphist`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setAllTheraphist(alltheraphist.data.theraphist);
    }

    const fetchTherapistRatings = async () => {
        const token = localStorage.getItem("token");
        try {
            const therapistRes = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/ratings/theraphist`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

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
            console.error("Error fetching therapist ratings:", error);
        }
    };

    useEffect(() => {
        fetchAllTheraphist();
        fetchTherapistRatings();
    }, []);

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
        console.log(request);

        if (request.data.message === "Request sent successfully.") {
            toast.success("Request sent successfully.");
            handleTheraphistViewClose();
        }
        else if (request.data.message === "Request already sent") {
            toast.error("You have already sent a request to another Therapist.");
            handleTheraphistViewClose();
        }
    }

    return (
        <>
            <ParentNavbar parentdetails={parentdetails} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Therapist</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ marginTop: "20px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/parent/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Child</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                            <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                            <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                        </Box>
                    </Box>
                </Box>

                {/* all therapists - updated grid layout */}
                <Grid container spacing={3} sx={{ p: "20px 50px", justifyContent: "center" }}>
                    {allTheraphist.map((therapist, index) => {
                        const ratingData = therapistRatings[therapist._id] || { average: 0, count: 0 };
                        const averageRating = ratingData.average;
                        const reviewCount = ratingData.count;

                        return (
                            <Grid
                                key={index}
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
                                                image={`${import.meta.env.VITE_SERVER_URL}/uploads/${therapist?.profilePic?.filename}`}
                                                alt="Profile"
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
                                                        {therapist.name}
                                                    </Typography>
                                                    <Typography sx={{ color: '#7F7F7F', fontSize: "13px", fontWeight: "500" }}>
                                                        {therapist.educationalQualification}
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
                                                        {therapist.yearsOfExperience} years Experience
                                                    </Typography>
                                                    <Typography sx={{ color: '#7F7F7F', fontSize: "12px", fontWeight: "500" }}>
                                                        {therapist.availability}
                                                    </Typography>
                                                    <Typography
                                                        color='secondary'
                                                        sx={{ cursor: 'pointer' }}
                                                        onClick={() => handleTheraphistViewOpen(therapist._id)}
                                                    >
                                                        View all
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
            </Box>

            {/* therapist view model */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
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
        </>
    )
}

export default ParentAllTheraphist