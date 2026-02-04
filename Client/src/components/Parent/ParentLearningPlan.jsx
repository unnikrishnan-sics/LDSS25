import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar'
import { Link, useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Avatar, Box, Breadcrumbs, Button, Card, Fade, Grid, Modal, Rating, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import WcIcon from '@mui/icons-material/Wc';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import Ratings from './Common/Ratings'; // Ensure this component can take 'initialRating'
import axios from 'axios';

const ParentLearningPlan = () => {
    const [parentdetails, setParentdetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const storedParentDetails = localStorage.getItem("parentDetails");
        if (storedParentDetails) {
            setParentdetails(JSON.parse(storedParentDetails));
        }
    }, []);

    const navigateToProfile = () => {
        navigate('/parent/profile');
    };

    // State for ratings modal
    const [ratingState, setRatingState] = useState({
        open: false,
        childId: null,
        professionalId: null, // Stores ID of professional being rated (string)
        professionalType: null, // 'educator' or 'therapist'
        currentRating: 0 // This will be the initial value for the modal
    });

    // State to store fetched ratings for professionals
    // Key: "childId_professionalId_professionalType", Value: rating (number)
    const [professionalRatings, setProfessionalRatings] = useState({});

    const handleRatingOpen = (childId, professionalType, professionalId, existingRating = 0) => {
        // professionalId here should already be the string ID
        if (!professionalId) {
            console.warn("Cannot open rating modal: professionalId is missing.");
            return;
        }
        setRatingState({
            open: true,
            childId,
            professionalId,
            professionalType,
            currentRating: existingRating
        });
    };

    const handleRatingClose = () => {
        setRatingState(prev => ({ ...prev, open: false, childId: null, professionalId: null, professionalType: null, currentRating: 0 }));
    };

    const handleRatingSubmit = async (newRating) => {
        const { childId, professionalId, professionalType } = ratingState;
        const parentId = parentdetails?._id;
        const token = localStorage.getItem("token");

        if (!professionalId || !professionalType || !childId || !parentId) {
            console.error("Missing required data for rating submission:", { childId, professionalId, professionalType, parentId });
            handleRatingClose();
            return;
        }
        // console.log("Submitting rating with:", { professionalId, professionalType, childId, parentId, newRating }); // Add for debugging

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/addrating`, {
                professionalId,
                professionalType,
                childId,
                parentId,
                rating: newRating
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Update local state to reflect the new/updated rating
                setProfessionalRatings(prev => ({
                    ...prev,
                    [`${childId}_${professionalId}_${professionalType}`]: newRating
                }));
                console.log(`Rating ${newRating} submitted for ${professionalType} ${professionalId} of child ${childId}`);
            } else {
                console.error("Failed to submit rating:", response.data.message);
            }
        } catch (error) {
            console.error(`Error submitting rating for ${professionalType} ${professionalId}:`, error.response ? error.response.data : error.message);
        } finally {
            handleRatingClose();
        }
    };

    const [allchild, setAllChild] = useState([]);
    const [educators, setEducators] = useState({}); // {childId: educatorDetails (object or ID string)}
    const [therapists, setTherapists] = useState({}); // {childId: therapistDetails (object or ID string)}

    const fetchAllChildOfParent = async () => {
        const token = localStorage.getItem("token");
        const currentParentDetails = JSON.parse(localStorage.getItem("parentDetails"));
        const parentId = currentParentDetails?._id;

        if (!parentId) {
            console.error("Parent ID not found. Cannot fetch data.");
            return;
        }

        try {
            const allChildRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getallchildofparent/${parentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const children = allChildRes.data.child || [];
            setAllChild(children);

            const tempEducators = {};
            const tempTherapists = {};
            const newProfessionalRatings = {};

            // Fetch educators for parent
            try {
                const educatorRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getacceptededucator/${parentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (educatorRes.data && educatorRes.data.acceptedEducators && educatorRes.data.acceptedEducators.length > 0) {
                    // Assuming recipientId might be populated or just the ID string
                    const firstEducator = educatorRes.data.acceptedEducators[0].recipientId;
                    children.forEach(child => {
                        tempEducators[child._id] = firstEducator;
                    });
                }
            } catch (error) {
                console.error(`Error fetching educators:`, error);
            }

            // Fetch therapists for parent
            try {
                const therapistRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getacceptedtherapist/${parentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (therapistRes.data && therapistRes.data.acceptedTherapists && therapistRes.data.acceptedTherapists.length > 0) {
                    // Assuming recipientId might be populated or just the ID string
                    const firstTherapist = therapistRes.data.acceptedTherapists[0].recipientId;
                    children.forEach(child => {
                        tempTherapists[child._id] = firstTherapist;
                    });
                }
            } catch (error) {
                console.error(`Error fetching therapists:`, error);
            }

            setEducators(tempEducators);
            setTherapists(tempTherapists);

            // Fetch ratings for each professional associated with each child
            for (const child of children) {
                const educator = tempEducators[child._id]; // This could be an object or an ID string
                const therapist = tempTherapists[child._id]; // This could be an object or an ID string

                const educatorId = educator ? (educator._id || educator) : null; // Get actual ID string
                const therapistId = therapist ? (therapist._id || therapist) : null; // Get actual ID string

                if (educatorId) {
                    try {
                        const ratingRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/specific`, {
                            params: {
                                professionalId: educatorId,
                                professionalType: 'educator',
                                childId: child._id,
                                parentId: parentId
                            },
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (ratingRes.data.success && ratingRes.data.rating) {
                            newProfessionalRatings[`${child._id}_${educatorId}_educator`] = ratingRes.data.rating.rating;
                        }
                    } catch (err) {
                        if (!(err.response && err.response.status === 404)) { // 404 means no rating yet, which is fine
                            console.error(`Error fetching rating for educator ${educatorId} (child ${child._id}):`, err.response ? err.response.data : err.message);
                        }
                    }
                }

                if (therapistId) {
                    try {
                        const ratingRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/specific`, {
                            params: {
                                professionalId: therapistId,
                                professionalType: 'theraphist',
                                childId: child._id,
                                parentId: parentId
                            },
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (ratingRes.data.success && ratingRes.data.rating) {
                            newProfessionalRatings[`${child._id}_${therapistId}_theraphist`] = ratingRes.data.rating.rating;
                        }
                    } catch (err) {
                        if (!(err.response && err.response.status === 404)) {
                            console.error(`Error fetching rating for therapist ${therapistId} (child ${child._id}):`, err.response ? err.response.data : err.message);
                        }
                    }
                }
            }
            setProfessionalRatings(newProfessionalRatings);

        } catch (error) {
            console.error("Error fetching children or related data:", error);
        }
    };

    useEffect(() => {
        if (parentdetails?._id) { // Ensure parentdetails is loaded before fetching
            fetchAllChildOfParent();
        }
    }, [parentdetails]); // Rerun if parentdetails changes (e.g., on login)

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <ParentNavbar parentdetails={parentdetails} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Learning</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ marginTop: "20px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/parent/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Learning</Typography>
                    </Breadcrumbs>
                    {/* <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                            <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                            <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                        </Box>
                    </Box> */}
                </Box>

                <Grid sx={{ pt: "10px", pl: "50px", pr: "50px", width: "%", pb: "50px", display: "flex", justifyContent: "center" }} container spacing={3}> {/* Added pb and spacing */}
                    {allchild.map((child) => {
                        const educator = educators[child._id]; // This is the value stored (object or ID string)
                        const therapist = therapists[child._id]; // This is the value stored (object or ID string)

                        // Determine the actual ID string for professionals
                        const educatorId = educator ? (educator._id || educator) : null;
                        const therapistId = therapist ? (therapist._id || therapist) : null;

                        // Keys for professionalRatings state, using the derived ID strings
                        const educatorRatingKey = educatorId ? `${child._id}_${educatorId}_educator` : null;
                        const currentEducatorRating = educatorRatingKey ? professionalRatings[educatorRatingKey] : 0;

                        const therapistRatingKey = therapistId ? `${child._id}_${therapistId}_theraphist` : null;
                        const currentTherapistRating = therapistRatingKey ? professionalRatings[therapistRatingKey] : 0;

                        const educatorName = educator ? (educator.name || educator) : 'Educator N/A';
                        const therapistName = therapist ? (therapist.name || therapist) : 'Therapist N/A';

                        return (
                            <Grid key={child._id} item xs={12} md={6} sx={{ minHeight: "470px" }}> {/* Changed width, used minHeight */}
                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"} sx={{ p: "20px 30px", height: "100%", background: "#F6F7F9", borderRadius: "25px", gap: "20px" }}>
                                    <Box width={"100%"} display={"flex"} gap={2} justifyContent={"space-between"} alignItems={"center"} flexWrap="wrap"> {/* Added flexWrap */}
                                        <Typography sx={{ fontSize: "32px", fontWeight: "600" }} color='primary'>{child.name}</Typography>
                                        <Box display={"flex"} alignItems={"center"} sx={{ gap: "10px", flexWrap: "wrap" }}> {/* Added flexWrap */}
                                            {/* Chat buttons also need to use the actual ID */}
                                            {educatorId && <Button
                                                startIcon={<ChatIcon />}
                                                variant='outlined'
                                                color='secondary'
                                                sx={{ borderRadius: "25px", mt: "10px", height: "40px", width: 'auto', padding: '8px 20px', fontSize: "13px" }}
                                                onClick={async () => {
                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        const parentId = parentdetails._id;

                                                        // First check if conversation exists
                                                        const convsResponse = await axios.get(
                                                            `${import.meta.env.VITE_SERVER_URL}/ldss/conversations/user/${parentId}`,
                                                            { headers: { Authorization: `Bearer ${token}` } }
                                                        );

                                                        const existingConv = convsResponse.data.find(conv =>
                                                            conv.participants.includes(educatorId) &&
                                                            conv.participants.includes(parentId) &&
                                                            (conv.student?._id === child._id || conv.student === child._id)
                                                        );

                                                        if (!existingConv) {
                                                            // Create new conversation if doesn't exist
                                                            await axios.post(
                                                                `${import.meta.env.VITE_SERVER_URL}/ldss/conversations`,
                                                                {
                                                                    participants: [parentId, educatorId],
                                                                    participantModels: ['parent', 'educator'],
                                                                    student: child._id
                                                                },
                                                                { headers: { Authorization: `Bearer ${token}` } }
                                                            );
                                                        }

                                                        // Navigate to chat
                                                        navigate(`/parent/chat/${educatorId}`, {
                                                            state: {
                                                                userType: 'educator',
                                                                studentId: child._id,
                                                                studentName: child.name
                                                            }
                                                        });
                                                    } catch (error) {
                                                        console.error('Error initiating chat:', error);
                                                    }
                                                }}
                                            >
                                                Chat Educator
                                            </Button>}

                                            {therapistId && <Button
                                                startIcon={<ChatIcon />}
                                                variant='outlined'
                                                color='secondary'
                                                sx={{ borderRadius: "25px", mt: "10px", height: "40px", width: 'auto', padding: '8px 20px', fontSize: "13px" }}
                                                onClick={async () => {
                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        const parentId = parentdetails._id;

                                                        // First check if conversation exists
                                                        const convsResponse = await axios.get(
                                                            `${import.meta.env.VITE_SERVER_URL}/ldss/conversations/user/${parentId}`,
                                                            { headers: { Authorization: `Bearer ${token}` } }
                                                        );

                                                        const existingConv = convsResponse.data.find(conv =>
                                                            conv.participants.includes(therapistId) &&
                                                            conv.participants.includes(parentId) &&
                                                            (conv.student?._id === child._id || conv.student === child._id)
                                                        );

                                                        if (!existingConv) {
                                                            // Create new conversation if doesn't exist
                                                            await axios.post(
                                                                `${import.meta.env.VITE_SERVER_URL}/ldss/conversations`,
                                                                {
                                                                    participants: [parentId, therapistId],
                                                                    participantModels: ['parent', 'theraphist'],
                                                                    student: child._id
                                                                },
                                                                { headers: { Authorization: `Bearer ${token}` } }
                                                            );
                                                        }

                                                        // Navigate to chat
                                                        navigate(`/parent/chat/${therapistId}`, {
                                                            state: {
                                                                userType: 'theraphist',
                                                                studentId: child._id,
                                                                studentName: child.name
                                                            }
                                                        });
                                                    } catch (error) {
                                                        console.error('Error initiating chat:', error);
                                                    }
                                                }}
                                            >
                                                Chat Therapist
                                            </Button>}

                                        </Box>
                                    </Box>

                                    <Box width={"100%"} display={"flex"} justifyContent={"space-between"} flexWrap="wrap"> {/* Added flexWrap */}
                                        <Box sx={{ gap: "20px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                                <Box sx={{ color: "#1967D2" }}><DateRangeIcon /></Box>
                                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                                    <Typography variant='body2' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Date of Birth</Typography>
                                                    <Typography variant='subtitle1' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{formatDate(child.dateOfBirth)}</Typography>
                                                </Box>
                                            </Box>
                                            <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                                <Box sx={{ color: "#1967D2" }}><ApartmentOutlinedIcon /></Box>
                                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                                    <Typography variant='body2' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>School Name</Typography>
                                                    <Typography variant='subtitle1' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{child.schoolName}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box sx={{ gap: "20px", pr: { md: "100px", xs: 0 } }} display={"flex"} flexDirection={"column"} alignItems={"start"}> {/* Adjusted padding */}
                                            <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: { md: "50px", xs: 0 } }}>
                                                <Box sx={{ color: "#1967D2" }}><WcIcon /></Box>
                                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                                    <Typography variant='body2' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Gender</Typography>
                                                    <Typography variant='subtitle1' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{child.gender}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ border: "1px solid #CCCCCC", borderRadius: "12px" }} minHeight={"176px"} width={"100%"} display={"flex"} flexDirection={{ xs: "column", md: "row" }} alignItems={"stretch"} justifyContent={"space-between"}> {/* stretch items */}
                                        {/* Educator Section */}
                                        <Box display={'flex'} flexDirection={'column'} alignItems="center" width={"100%"} p={2} gap={1}>
                                            <Typography variant='h6' color='secondary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                                {/* Display educator name if object, otherwise the ID string as fallback */}
                                                {educator ? (educator.name || educator) : 'Educator N/A'}
                                            </Typography>
                                            {educatorId && ( // Use educatorId for conditional rendering
                                                <>
                                                    {currentEducatorRating > 0 ? (
                                                        <Box textAlign="center" my={1}>
                                                            <Typography variant="caption">Your Rating:</Typography>
                                                            <Rating value={currentEducatorRating} readOnly precision={0.5} />
                                                            <Button
                                                                onClick={() => handleRatingOpen(child._id, 'educator', educatorId, currentEducatorRating)}
                                                                size="small" variant="text" sx={{ mt: 0.5, fontSize: "12px" }}
                                                            >
                                                                Update
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <Button
                                                            onClick={() => handleRatingOpen(child._id, 'educator', educatorId, 0)}
                                                            startIcon={<AddIcon />}
                                                            variant='outlined'
                                                            color='secondary'
                                                            sx={{ borderRadius: "25px", my: 1, height: "30px", fontSize: "12px", padding: "5px 15px" }}
                                                        >
                                                            Rate
                                                        </Button>
                                                    )}
                                                    <Typography variant='body2' color='primary' sx={{ fontSize: "14px", textAlign: "center" }}>View learning plan</Typography>
                                                    <Link to={`/parent/educatorlearningplan/${educatorId}/${child._id}`} style={{ width: "100%", textDecoration: "none" }}>
                                                        <Button fullWidth variant='contained' color='secondary' sx={{ borderRadius: "25px", height: "40px", fontSize: "13px" }}>Learning plan</Button>
                                                    </Link>
                                                </>
                                            )}
                                        </Box>

                                        <Divider orientation="vertical" variant="middle" flexItem sx={{ display: { xs: "none", md: "block" } }} />
                                        <Divider orientation="horizontal" flexItem sx={{ display: { xs: "block", md: "none", width: "80%", margin: "10px auto" } }} />

                                        {/* Therapist Section */}
                                        <Box display={'flex'} flexDirection={'column'} alignItems="center" width={"100%"} p={2} gap={1}>
                                            <Typography variant='h6' color='secondary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                                {/* Display therapist name if object, otherwise the ID string as fallback */}
                                                {therapist ? (therapist.name || therapist) : 'Therapist N/A'}
                                            </Typography>
                                            {therapistId && ( // Use therapistId for conditional rendering
                                                <>
                                                    {currentTherapistRating > 0 ? (
                                                        <Box textAlign="center" my={1}>
                                                            <Typography variant="caption">Your Rating:</Typography>
                                                            <Rating value={currentTherapistRating} readOnly precision={0.5} />
                                                            <Button
                                                                onClick={() => handleRatingOpen(child._id, 'theraphist', therapistId, currentTherapistRating)}
                                                                size="small" variant="text" sx={{ mt: 0.5, fontSize: "12px" }}
                                                            >
                                                                Update
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <Button
                                                            onClick={() => handleRatingOpen(child._id, 'theraphist', therapistId, 0)}
                                                            startIcon={<AddIcon />}
                                                            variant='outlined'
                                                            color='secondary'
                                                            sx={{ borderRadius: "25px", my: 1, height: "30px", fontSize: "12px", padding: "5px 15px" }}
                                                        >
                                                            Rate
                                                        </Button>
                                                    )}
                                                    <Typography variant='body2' color='primary' sx={{ fontSize: "14px", textAlign: "center" }}>View learning plan</Typography>
                                                    <Link to={`/parent/therapistlearningplan/${therapistId}/${child._id}`} style={{ width: "100%", textDecoration: "none" }}>
                                                        <Button fullWidth variant='contained' color='secondary' sx={{ borderRadius: "25px", height: "40px", fontSize: "13px" }}>Learning plan</Button>
                                                    </Link>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>

                <Ratings
                    openRating={ratingState.open}
                    handleRatingClose={handleRatingClose}
                    handleRatingSubmit={handleRatingSubmit}
                    professionalType={ratingState.professionalType}
                    initialRating={ratingState.currentRating} // Pass initial rating to modal
                />
            </Box>
        </>
    )
}

export default ParentLearningPlan;