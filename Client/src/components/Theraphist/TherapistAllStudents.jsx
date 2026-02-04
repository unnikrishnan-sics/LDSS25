import React, { useEffect, useState } from 'react';
import TherapistNavbar from '../Navbar/TheraphistNavbar'; // Corrected import to TherapistNavbar
import {
    Box,
    Breadcrumbs,
    Button,
    Grid,
    Typography,
    LinearProgress
} from '@mui/material';
import {
    SearchOutlined,
    PersonOutlined,
    ApartmentOutlined,
    Female,
    DateRange,
    Chat,
    Add,
    Assignment
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Meeting from './Common/Meeting';
import ViewStudentActivity from './Common/ViewStudentActivity';
import QuizIcon from '@mui/icons-material/Quiz';

const TherapistAllStudents = () => {
    const [therapistDetails, setTherapistDetails] = useState(null);
    const [allChildren, setAllChildren] = useState([]);
    const [filteredChildren, setFilteredChildren] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [useDummyData, setUseDummyData] = useState(false); // Kept as per your original code
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize therapist details
    const fetchTherapist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found");
                return;
            }

            const decoded = jwtDecode(token);

            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${decoded.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.theraphist) {
                const therapistData = response.data.theraphist;

                if (therapistData && therapistData._id) {
                    localStorage.setItem("theraphistDetails", JSON.stringify(therapistData));
                    setTherapistDetails(therapistData);
                    // Pass therapistId to fetchAllChildren for clarity and immediate use
                    fetchAllChildren(therapistData._id);
                }
            }
        } catch (error) {
            console.error("Error fetching therapist:", error);
            const cachedData = localStorage.getItem("theraphistDetails");
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    if (parsed && parsed._id) {
                        setTherapistDetails(parsed);
                        fetchAllChildren(parsed._id); // Try to fetch children with cached ID
                    }
                } catch (parseError) {
                    console.error("Error parsing cached data:", parseError);
                    setLoading(false);
                }
            } else {
                setLoading(false); // If no cached data, stop loading
            }
        }
    };

    useEffect(() => {
        fetchTherapist();
    }, []);

    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    const fetchAllChildren = async (therapistId) => { // Accept therapistId as argument
        setLoading(true);
        try {
            if (useDummyData) {
                const dummyChildren = []; // Populate with actual dummy data if needed for testing
                setAllChildren(dummyChildren);
                setFilteredChildren(dummyChildren);
            } else {
                const token = localStorage.getItem("token");
                // Ensure therapistId is available before making API call
                if (!therapistId) {
                    console.error("Therapist ID is missing for fetching children.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/getchildrenofallapprovedparents/${therapistId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const childrenWithPlanAndProgress = await Promise.all(
                    response.data.children.map(async (child) => {
                        let hasLearningPlan = false;
                        let progress = 0;
                        let weeks = 0;

                        try {
                            const planResponse = await axios.get(
                                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/getstudentplan/${therapistId}/${child._id}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            const learningPlan = planResponse.data.data?.[0];
                            if (learningPlan) {
                                hasLearningPlan = true;
                                weeks = learningPlan.planDuration || 0;
                                const completedWeeks = learningPlan.weeks?.filter(week =>
                                    week.activities.every(activity => activity.status === 'completed')
                                ).length || 0;
                                progress = weeks > 0 ? Math.round((completedWeeks / weeks) * 100) : 0;
                            }
                        } catch (error) {
                            console.warn(`Could not fetch learning plan for child ${child._id}:`, error.message);
                        }

                        return {
                            ...child,
                            hasLearningPlan,
                            progress,
                            weeks
                        };
                    })
                );

                setAllChildren(childrenWithPlanAndProgress);
                setFilteredChildren(childrenWithPlanAndProgress);
            }
        } catch (error) {
            console.error("Failed to fetch children:", error);
            setAllChildren([]);
            setFilteredChildren([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle search functionality
    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term === '') {
            setFilteredChildren(allChildren);
        } else {
            const filtered = allChildren.filter(child =>
                child.name.toLowerCase().includes(term.toLowerCase()) ||
                (child.parentId?.name && child.parentId.name.toLowerCase().includes(term.toLowerCase())) ||
                (child.schoolName && child.schoolName.toLowerCase().includes(term.toLowerCase()))
            );
            setFilteredChildren(filtered);
        }
    };
    const handleChatClick = (parentId, studentId, studentName) => {
        // --- START DEBUG LOGS ---
        console.log("TherapistAllStudents - handleChatClick called with:");
        console.log("  parentId (recipient ID):", parentId);
        console.log("  studentId (child._id):", studentId);
        console.log("  studentName (child.name):", studentName);
        // --- END DEBUG LOGS ---

        // Basic validation before navigating
        if (!parentId || !studentId || !studentName) {
            console.error("Missing required chat details:", { parentId, studentId, studentName });
            alert("Could not start chat: Missing parent or student information. Please try again.");
            return;
        }

        navigate(`/therapist/chat/${parentId}`, {
            state: {
                userType: 'parent', // Explicitly set userType to 'parent'
                studentId: studentId,   // Pass the student's ID
                studentName: studentName // Pass student's name for chat header
            }
        });
    };
    // Meeting modal state
    const [openMeeting, setOpenMeeting] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState(null);

    // Activities modal state
    const [openActivity, setOpenActivity] = useState(false);
    const [selectedChildIdForActivity, setSelectedChildIdForActivity] = useState(null);

    const handleMeetingOpen = (childId) => {
        setOpenMeeting(true);
        setSelectedChildId(childId);
    };

    const handleMeetingClose = () => {
        setOpenMeeting(false);
        setSelectedChildId(null);
    };

    const handleActivityOpen = (childId) => {
        setOpenActivity(true);
        setSelectedChildIdForActivity(childId);
    };

    const handleActivityClose = () => {
        setOpenActivity(false);
        setSelectedChildIdForActivity(null);
    };

    // *** MODIFIED: Pass studentId and studentName in the state ***
    const handleQuizClick = (studentId, studentName) => {
        // --- START DEBUG LOGS ---
        console.log("TherapistAllStudents - handleQuizClick called with:");
        console.log("  studentId (child._id):", studentId);
        console.log("  studentName (child.name):", studentName);
        // --- END DEBUG LOGS ---

        // Basic validation before navigating
        if (!studentId || !studentName) {
            console.error("Missing required chat details:", { parentId, studentId, studentName });
            alert("Could not start chat: Missing parent or student information. Please try again.");
            return;
        }

        navigate(`/therapist/child/${studentId}/quizzes`, {
            state: {
                studentId: studentId,   // Pass the student's ID
                studentName: studentName // Pass student's name for quiz header
            }
        });
    };



    // DO NOT CHANGE ANY OTHER FUNCTIONS - Confirmed
    const handleLearningPlanClick = (childId, hasLearningPlan) => {
        if (hasLearningPlan) {
            // Navigate to view learning plan (which will have edit option)
            navigate(`/therapist/viewlearningplan/${childId}`);
        } else {
            // Navigate to add new learning plan
            navigate(`/therapist/addlearningplan/${childId}`);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    if (!therapistDetails && loading) { // Show loading until therapistDetails are fetched
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Loading therapist information...</Typography>
            </Box>
        );
    }
    // If not loading and no therapistDetails, it means an error or no data
    if (!therapistDetails && !loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error" variant="h6">Failed to load therapist details.</Typography>
                <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Retry</Button>
            </Box>
        );
    }


    return (
        <>
            <TherapistNavbar theraphistdetails={therapistDetails} navigateToProfile={navigateToProfile} />

            <Box sx={{ background: "white" }}>
                {/* Header Section */}
                <Box display="flex" justifyContent="center" alignItems="center" sx={{
                    height: "46px",
                    background: "#DBE8FA"
                }}>
                    <Typography color='primary' textAlign="center" sx={{
                        fontSize: "18px",
                        fontWeight: "600"
                    }}>
                        All Students
                    </Typography>
                </Box>

                {/* Breadcrumbs and Search */}
                <Box display="flex" justifyContent="space-between" alignItems="start" sx={{
                    mt: "30px",
                    ml: "50px",
                    mr: "50px"
                }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#7F7F7F",
                            textDecoration: "none"
                        }} to="/therapist/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{
                            fontSize: "12px",
                            fontWeight: "500"
                        }}>
                            All Students
                        </Typography>
                    </Breadcrumbs>

                    <Box display="flex" alignItems="center" gap={1} sx={{
                        padding: "8px 15px",
                        borderRadius: "25px",
                        border: "1px solid #CCCCCC",
                        height: "40px"
                    }}>
                        <SearchOutlined />
                        <input
                            placeholder='Search here'
                            style={{
                                border: 0,
                                outline: 0,
                                height: "100%",
                                width: "200px"
                            }}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Box>
                </Box>

                {/* Students Grid */}
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "300px" }}>
                        <Typography>Loading students...</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2} sx={{
                        pt: "30px",
                        pl: "50px",
                        pr: "50px",
                        width: "100%",
                        pb: "50px",
                        justifyContent: "center",
                    }}>
                        {filteredChildren.length > 0 ? (
                            filteredChildren.map((child, index) => (
                                <Grid item key={child._id || index} xs={12} sm={6} sx={{ height: "400px" }}>
                                    {/* --- START DEBUG LOGS FOR EACH CHILD CARD --- */}
                                    {console.log(`Rendering Therapist child card for:`, child.name)}
                                    {console.log(`  Child ID:`, child._id)}
                                    {console.log(`  Parent ID:`, child.parentId?._id)}
                                    {/* --- END DEBUG LOGS --- */}
                                    {/* Student Card */}
                                    <Box display="flex" flexDirection="column" alignItems="start" sx={{
                                        p: "30px",
                                        background: "#F6F7F9",
                                        borderRadius: "25px",
                                        gap: "20px",
                                        width: "100%",
                                        height: "100%"
                                    }}>
                                        {/* Student Name and Buttons */}
                                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" gap={2}>
                                            <Link to={`/therapist/viewlearningplan/${child._id}`} style={{ textDecoration: "none" }}>
                                                <Typography sx={{
                                                    fontSize: "24px",
                                                    fontWeight: "600"
                                                }} color='primary'>
                                                    {child.name}
                                                </Typography>
                                            </Link>

                                            <Box display="flex" alignItems="center" gap="10px">
                                                <Button
                                                    startIcon={<Chat />}
                                                    variant='outlined'
                                                    color='secondary'
                                                    sx={{
                                                        borderRadius: "25px",
                                                        height: "45px",
                                                        minWidth: '120px',
                                                        fontSize: "14px",
                                                        fontWeight: "500"
                                                    }}
                                                    // MODIFIED: Pass all required data to handleChatClick
                                                    onClick={() => handleChatClick(child.parentId?._id, child._id, child.name)}
                                                    // Disable the button if critical data is missing
                                                    disabled={!child.parentId?._id || !child._id || !child.name}
                                                >
                                                    Chat
                                                </Button>

                                                <Button
                                                    startIcon={child.hasLearningPlan ? <Assignment /> : <Add />}
                                                    variant='outlined'
                                                    color='secondary'
                                                    sx={{
                                                        borderRadius: "25px",
                                                        height: "45px",
                                                        minWidth: '350px',
                                                        fontSize: "14px",
                                                        fontWeight: "500"
                                                    }}
                                                    onClick={() => handleLearningPlanClick(child._id, child.hasLearningPlan)}
                                                >
                                                    {child.hasLearningPlan ? "Learning Plan" : "Add Learning Plan"}
                                                </Button>
                                            </Box>
                                        </Box>

                                        {/* Student Details */}
                                        <Box display="flex" justifyContent="space-between" width="100%">
                                            {/* Left Column */}
                                            <Box display="flex" flexDirection="column" gap="20px">
                                                <Box display="flex" alignItems="center" gap="15px">
                                                    <PersonOutlined sx={{ color: "#1967D2" }} />
                                                    <Box>
                                                        <Typography sx={{
                                                            fontSize: "12px",
                                                            fontWeight: "500"
                                                        }} color='secondary'>
                                                            Parent Name
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontSize: "14px",
                                                            fontWeight: "500"
                                                        }} color='primary'>
                                                            {child.parentId?.name || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box display="flex" alignItems="center" gap="15px">
                                                    <ApartmentOutlined sx={{ color: "#1967D2" }} />
                                                    <Box>
                                                        <Typography sx={{
                                                            fontSize: "12px",
                                                            fontWeight: "500"
                                                        }} color='secondary'>
                                                            School Name
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontSize: "14px",
                                                            fontWeight: "500"
                                                        }} color='primary'>
                                                            {child.schoolName || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* Right Column */}
                                            <Box display="flex" flexDirection="column" gap="20px" sx={{
                                                pl: "50px",
                                                borderLeft: "1px solid #CCCCCC"
                                            }}>
                                                <Box display="flex" alignItems="center" gap="15px">
                                                    <DateRange sx={{ color: "#1967D2" }} />
                                                    <Box>
                                                        <Typography sx={{
                                                            fontSize: "12px",
                                                            fontWeight: "500"
                                                        }} color='secondary'>
                                                            Date of Birth
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontSize: "14px",
                                                            fontWeight: "500"
                                                        }} color='primary'>
                                                            {formatDate(child.dateOfBirth)}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box display="flex" alignItems="center" gap="15px">
                                                    <Female sx={{ color: "#1967D2" }} />
                                                    <Box>
                                                        <Typography sx={{
                                                            fontSize: "12px",
                                                            fontWeight: "500"
                                                        }} color='secondary'>
                                                            Gender
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontSize: "14px",
                                                            fontWeight: "500"
                                                        }} color='primary'>
                                                            {child.gender || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Description */}
                                        <Box>
                                            <Typography sx={{
                                                fontSize: "16px",
                                                fontWeight: "500"
                                            }} color='secondary'>
                                                Description
                                            </Typography>
                                            <Typography sx={{
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                lineHeight: "1.5"
                                            }} color='primary'>
                                                {child.description || 'No description available'}
                                            </Typography>
                                        </Box>

                                        {/* Progress Bar */}
                                        {/* <Box width="100%">
                                            <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                                                <Typography sx={{
                                                    fontSize: "16px",
                                                    fontWeight: "600"
                                                }} color='secondary'>
                                                    Progress
                                                </Typography>
                                                <Typography sx={{
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }} color='secondary'>
                                                    {child.weeks || 0} Weeks
                                                </Typography>
                                            </Box>

                                            <Box sx={{
                                                background: "#DBE8FA",
                                                display: "flex",
                                                alignItems: "center",
                                                width: "100%",
                                                borderRadius: "25px",
                                                height: "15px"
                                            }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={child.progress || 0}
                                                    sx={{
                                                        height: "100%",
                                                        borderRadius: "25px",
                                                        backgroundColor: "transparent",
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#1967D2',
                                                            borderRadius: "25px"
                                                        },
                                                        width: `${child.progress || 0}%`,
                                                    }}
                                                />
                                            </Box>
                                        </Box> */}

                                        {/* Action Buttons */}
                                        <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={2}>
                                            <Button
                                                startIcon={<QuizIcon />}
                                                variant='outlined'
                                                color='secondary'
                                                sx={{
                                                    borderRadius: "25px",
                                                    height: "45px",
                                                    minWidth: '120px',
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    mr: 2
                                                }}
                                                // MODIFIED: Pass all required data to handleChatClick
                                                onClick={() => handleQuizClick(child._id, child.name)}
                                                // Disable the button if critical data is missing
                                                disabled={!child._id || !child.name}
                                            >
                                                Quiz
                                            </Button>
                                            <Button
                                                onClick={() => handleMeetingOpen(child._id)}
                                                variant='contained'
                                                color='secondary'
                                                sx={{
                                                    borderRadius: "25px",
                                                    height: "45px",
                                                    width: '48%',
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                Meeting
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12} sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "200px"
                            }}>
                                <Typography variant="h6" color="textSecondary">
                                    {searchTerm ? 'No matching students found' : 'No students found'}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>

            {/* Meeting Modal */}
            <Meeting
                childId={selectedChildId}
                openMeeting={openMeeting}
                handleMeetingClose={handleMeetingClose}
            />

            {/* Activities Modal */}
            <ViewStudentActivity
                childId={selectedChildIdForActivity}
                openActivity={openActivity}
                handleActivityClose={handleActivityClose}
            />
        </>
    );
};

export default TherapistAllStudents;