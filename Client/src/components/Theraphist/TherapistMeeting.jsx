import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import TheraphistNavbar from '../Navbar/TheraphistNavbar';
import { Box, Breadcrumbs, Button, Typography, Avatar, Chip } from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AddMeeting from './Common/addMeeting';

const TherapistMeeting = () => {
    const [therapistDetails, setTherapistDetails] = useState({});
    const [meetings, setMeetings] = useState([]);
    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const homebg = {
        backgroundColor: "#F6F7F9"
    };

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
                    try {
                        localStorage.setItem("theraphistDetails", JSON.stringify(therapistData));
                        setTherapistDetails(therapistData);
                    } catch (storageError) {
                        console.error("Failed to store in localStorage:", storageError);
                        setTherapistDetails(therapistData);
                    }
                } else {
                    console.error("Invalid therapist data structure");
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
                    }
                } catch (parseError) {
                    console.error("Error parsing cached data:", parseError);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchAllMeetings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found");
                setError("Authentication required");
                return;
            }

            const decoded = jwtDecode(token);
            setLoading(true);

            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/therapist/viewmeeting/${decoded.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.meetings) {
                setMeetings(response.data.meetings);
                filterUpcomingMeetings(response.data.meetings);
            } else {
                setMeetings([]);
                setUpcomingMeetings([]);
            }
        } catch (error) {
            console.error("Error fetching meetings:", error);
            setError("Failed to load meetings");
        } finally {
            setLoading(false);
        }
    };

    const isMeetingUpcoming = (meeting) => {
        if (!meeting?.date || !meeting?.endTime) return false;

        const now = new Date();
        const meetingDate = new Date(meeting.date);

        // Compare dates first
        if (meetingDate.toDateString() !== now.toDateString()) {
            return meetingDate > now;
        }

        // If same date, compare end time
        const [endHours, endMinutes] = meeting.endTime.split(':').map(Number);
        const meetingEndTime = new Date(meetingDate);
        meetingEndTime.setHours(endHours, endMinutes, 0, 0);

        return meetingEndTime > now;
    };

    const filterUpcomingMeetings = (meetings) => {
        const upcoming = meetings.filter(meeting => isMeetingUpcoming(meeting));
        setUpcomingMeetings(upcoming);
    };

    useEffect(() => {
        const storedTherapist = localStorage.getItem("theraphistDetails");
        if (storedTherapist) {
            try {
                const parsed = JSON.parse(storedTherapist);
                if (parsed && parsed._id) {
                    setTherapistDetails(parsed);
                }
            } catch (error) {
                console.error("Error parsing stored therapist:", error);
            }
        }

        fetchTherapist();
        fetchAllMeetings();
    }, []);

    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    const [addMeetingopen, setAddMeetingOpen] = React.useState(false);
    const handleAddMeetingOpen = () => setAddMeetingOpen(true);
    const handleAddMeetingClose = () => {
        setAddMeetingOpen(false);
        fetchAllMeetings(); // Refresh meetings after adding a new one
    };

    const handleJoinMeeting = (meetLink) => {
        if (meetLink) {
            window.open(meetLink, '_blank', 'noopener,noreferrer');
        } else {
            alert('No meeting link available for this meeting');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return 'primary';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <>
            <TheraphistNavbar
                theraphistdetails={therapistDetails}
                navigateToProfile={navigateToProfile}
            />

            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Upcoming Meetings
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/theraphist/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Meetings
                    </Typography>
                </Breadcrumbs>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "200px" }}>
                    <Typography variant="h6" color="textSecondary">
                        Loading meetings...
                    </Typography>
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "200px" }}>
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ background: "white" }}>
                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                        {upcomingMeetings.map((meeting, index) => (
                            <Box
                                key={meeting._id || index}
                                display="flex"
                                alignItems="center"
                                sx={{
                                    height: "198px",
                                    background: "#F0F6FE",
                                    borderRadius: "20px",
                                    m: "20px 50px"
                                }}
                            >
                                {/* First Section (Student Info) */}
                                <Box
                                    sx={{
                                        m: "20px",
                                        borderRadius: "15px",
                                        border: "1px solid #CCCCCC",
                                        height: "150px",
                                        flexBasis: "40%",
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <Box sx={{ gap: "20px", p: "20px" }} display="flex" flexDirection="column" alignItems="start">
                                        <Box display="flex" alignItems="center" sx={{ gap: "15px" }}>
                                            <Box sx={{ color: "#1967D2" }}><PersonOutlinedIcon /></Box>
                                            <Box display="flex" flexDirection="column" alignItems="start">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "12px", fontWeight: "500" }}>
                                                    Student's name
                                                </Typography>
                                                <Typography variant="h6" color="text.primary" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                                    {meeting?.childId?.name || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box display="flex" alignItems="center" sx={{ gap: "15px" }}>
                                            <Box sx={{ color: "#1967D2" }}><PersonOutlinedIcon /></Box>
                                            <Box display="flex" flexDirection="column" alignItems="start">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "12px", fontWeight: "500" }}>
                                                    Parent name
                                                </Typography>
                                                <Typography variant="h6" color="text.primary" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                                    {meeting?.parentId?.name || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ borderLeft: "1px solid #CCCCCC", m: "10px 0" }} />

                                    <Box sx={{ gap: "20px", p: "20px" }} display="flex" flexDirection="column" alignItems="start">
                                        <Box display="flex" alignItems="center" sx={{ gap: "15px", pl: "50px" }}>
                                            <Box sx={{ color: "#1967D2" }}><DateRangeIcon /></Box>
                                            <Box display="flex" flexDirection="column" alignItems="start">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "12px", fontWeight: "500" }}>
                                                    Date of birth
                                                </Typography>
                                                <Typography variant="h6" color="text.primary" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                                    {meeting?.childId?.dateOfBirth ? formatDate(meeting.childId.dateOfBirth) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box display="flex" alignItems="center" sx={{ gap: "15px", pl: "50px" }}>
                                            <Box sx={{ color: "#1967D2" }}>
                                                {meeting?.childId?.gender === 'Female' ? <FemaleIcon /> : <MaleIcon />}
                                            </Box>
                                            <Box display="flex" flexDirection="column" alignItems="start">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "12px", fontWeight: "500" }}>
                                                    Gender
                                                </Typography>
                                                <Typography variant="h6" color="text.primary" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                                    {meeting?.childId?.gender || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Second Section (Meeting Info) */}
                                <Box
                                    sx={{
                                        m: "20px",
                                        borderRadius: "15px",
                                        border: "1px solid #CCCCCC",
                                        height: "150px",
                                        flexBasis: "40%",
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <Box sx={{ gap: "20px", p: "20px" }} display="flex" flexDirection="column" alignItems="start">
                                        <Box display="flex" alignItems="center" sx={{ gap: "15px" }}>
                                            <Box display="flex" flexDirection="column" alignItems="start">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "12px", fontWeight: "500" }}>
                                                    Meeting
                                                </Typography>
                                                <Typography variant="h6" color="text.primary" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                                    {meeting?.meetingTitle || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box display="flex" alignItems="center" sx={{ gap: "15px" }}>
                                            <Box sx={{ color: "#1967D2" }}><DateRangeIcon /></Box>
                                            <Box display="flex" flexDirection="column" alignItems="start">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "12px", fontWeight: "500" }}>
                                                    Date
                                                </Typography>
                                                <Typography variant="h6" color="text.primary" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                                    {formatDate(meeting?.date)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ borderLeft: "1px solid #CCCCCC", m: "10px 0" }} />

                                    <Box sx={{ gap: "20px", p: "20px" }} display="flex" flexDirection="column" alignItems="start">
                                        <Box display="flex" alignItems="center" sx={{ gap: "15px", pl: "50px" }}>
                                            <Box sx={{ color: "#1967D2" }}><AccessTimeIcon /></Box>
                                            <Box display="flex" flexDirection="column" alignItems="start">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "12px", fontWeight: "500" }}>
                                                    Time
                                                </Typography>
                                                <Typography variant="h6" color="text.primary" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                                    {formatTime(meeting?.startTime)} - {formatTime(meeting?.endTime)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Join Button */}
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        borderRadius: "25px",
                                        marginTop: "20px",
                                        height: "40px",
                                        width: "150px",
                                        padding: "10px 35px",
                                        mr: "20px"
                                    }}
                                    onClick={() => handleJoinMeeting(meeting?.meetLink)}
                                >
                                    Join
                                </Button>
                            </Box>
                        ))}
                    </Box>

                    {/* Empty state */}
                    {upcomingMeetings.length === 0 && !loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "200px" }}>
                            <Typography variant="h6" color="textSecondary">
                                No upcoming meetings scheduled
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            <AddMeeting
                handleAddMeetingOpen={handleAddMeetingOpen}
                addMeetingopen={addMeetingopen}
                handleAddMeetingClose={handleAddMeetingClose}
                fetchAllMeetings={fetchAllMeetings}
                therapistId={therapistDetails._id}
            />
        </>
    )
}

export default TherapistMeeting;