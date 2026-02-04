import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { toast } from 'react-toastify';
import TherapistNavbar from '../Navbar/TheraphistNavbar';

const TherapistAddLearningPlan = () => {
    const activityContainerStyle = {
        width: '360px',
        p: 2,
        borderRadius: '8px',
        backgroundColor: '#fffff',
        height: '210px', // Fixed height to match all containers
        display: 'flex',
        flexDirection: 'column'
    };
    const textFieldStyle = { height: "65px", width: "100%", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };
    const inputStyle = { height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px', width: '100%' };

    const { childId } = useParams();

    const [therapistDetails, setTherapistDetails] = useState({});
    const [learningPlan, setLearningPlan] = useState({
        goal: '',
        planDuration: '',
        weeks: [
            {
                activities: [
                    { title: '', description: '' },
                    { title: '', description: '' },
                    { title: '', description: '' }
                ]
            }
        ],
    });

    useEffect(() => {
        const therapistDetails = localStorage.getItem("therapistDetails");
        if (therapistDetails) {
            setTherapistDetails(JSON.parse(therapistDetails));
        }
    }, []);

    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLearningPlan(prev => ({ ...prev, [name]: value }));
    };

    const handleActivityChange = (weekIndex, activityIndex, e) => {
        const { name, value } = e.target;
        const updatedWeeks = [...learningPlan.weeks];
        updatedWeeks[weekIndex].activities[activityIndex][name] = value;
        setLearningPlan(prev => ({ ...prev, weeks: updatedWeeks }));
    };

    const handleAddActivity = (weekIndex) => {
        const updatedWeeks = [...learningPlan.weeks];
        updatedWeeks[weekIndex].activities.push({ title: '', description: '' });
        setLearningPlan(prev => ({ ...prev, weeks: updatedWeeks }));
    };

    const handleAddWeek = () => {
        setLearningPlan(prev => ({
            ...prev,
            weeks: [...prev.weeks, { activities: [{ title: '', description: '' }] }]
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const therapistDetails = JSON.parse(localStorage.getItem("theraphistDetails"));
            const therapistId = therapistDetails._id;

            if (!therapistId) {
                toast.error("Therapist details not found");
                return;
            }

            const payload = {
                ...learningPlan,
                therapistId: therapistId,
                childId: childId
            };

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/addlearning`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.message === "Learning plan already exists for this student.") {
                toast.error("Learning plan already exists for this student");
                navigate(`/therapist/viewlearningplan/${childId}`);
                return;
            }

            if (response.data.success) {
                toast.success("Learning plan created successfully");
                navigate(`/therapist/viewlearningplan/${childId}`);
            }
        } catch (error) {
            console.error("Error submitting learning plan:", error);
            if (error.response) {
                if (error.response.status === 409) {
                    toast.error("Learning plan already exists for this student");
                    navigate(`/therapist/viewlearningplan/${childId}`);
                } else {
                    toast.error(error.response.data.message || "Failed to create learning plan");
                }
            } else {
                toast.error("Network error - please try again");
            }
        }
    };

    return (
        <>
            <TherapistNavbar
                therapistDetails={therapistDetails}
                navigateToProfile={navigateToProfile}
            />

            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Learning Plan
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/therapist/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    <Link to="/therapist/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        All Students
                    </Link>
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Learning Plan
                    </Typography>
                </Breadcrumbs>
            </Box>

            <Box display="flex" flexDirection="column" gap={3} alignItems="center" sx={{ width: "774px", mx: "auto", mt: 5 }}>
                <Typography color='primary' sx={{ fontSize: "24px", fontWeight: "500" }}>Add Learning Plan</Typography>

                {/* Goal & Plan Duration */}
                <Stack direction="row" spacing={3}>
                    <div style={textFieldStyle}>
                        <label>Goal</label>
                        <input
                            style={inputStyle}
                            name='goal'
                            value={learningPlan.goal}
                            onChange={handleInputChange}
                            type='text'
                        />
                    </div>
                    <div style={textFieldStyle}>
                        <label>Plan Duration (Weekly)</label>
                        <input
                            style={inputStyle}
                            name='planDuration'
                            value={learningPlan.planDuration}
                            onChange={handleInputChange}
                            type='number'
                        />
                    </div>
                </Stack>

                <Box sx={{ borderBottom: "1px solid #CCCCCC", width: "100%" }}></Box>

                {/* Weeks and Activities */}
                {learningPlan.weeks.map((week, weekIndex) => (
                    <Box key={weekIndex} display="flex" flexDirection="column" gap={2} alignItems="center" sx={{ width: '100%' }}>
                        <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>{`Week ${weekIndex + 1}`}</Typography>

                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: '20px'
                        }}>
                            {/* Activities */}
                            {week.activities.map((activity, activityIndex) => (
                                <Box key={activityIndex} sx={activityContainerStyle}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Activity {activityIndex + 1}
                                    </Typography>
                                    <div style={textFieldStyle}>
                                        <label>Title</label>
                                        <input
                                            style={inputStyle}
                                            name='title'
                                            value={activity.title}
                                            onChange={(e) => handleActivityChange(weekIndex, activityIndex, e)}
                                        />
                                    </div>
                                    <div style={{ height: "85px", width: "100%", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                                        <label>Description</label>
                                        <input
                                            style={{ height: "60px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px', width: '100%' }}
                                            name='description'
                                            value={activity.description}
                                            onChange={(e) => handleActivityChange(weekIndex, activityIndex, e)}
                                        />
                                    </div>
                                </Box>
                            ))}

                            {/* Add Activity Button Container */}
                            <Box sx={{
                                ...activityContainerStyle,
                                border: '1px dashed #CCCCCC',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    sx={{ borderRadius: "25px", width: '200px' }}
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddActivity(weekIndex)}
                                >
                                    Add activity
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ borderBottom: "1px solid #CCCCCC", width: "100%" }}></Box>
                    </Box>
                ))}

                {/* Add Week Button */}
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "100px", width: "744px", border: "1px dashed #CCCCCC" }}>
                    <Button
                        variant='outlined'
                        color='secondary'
                        sx={{ borderRadius: "25px", height: "40px", width: '200px' }}
                        startIcon={<AddIcon />}
                        onClick={handleAddWeek}
                    >
                        Add week
                    </Button>
                </Box>
                <Box sx={{ borderBottom: "1px solid #CCCCCC", width: "100%" }}></Box>

                {/* Submit Button */}
                <Button
                    variant='contained'
                    color='secondary'
                    sx={{ borderRadius: "25px", height: "40px", width: '200px', mb: 4 }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
        </>
    );
};

export default TherapistAddLearningPlan;