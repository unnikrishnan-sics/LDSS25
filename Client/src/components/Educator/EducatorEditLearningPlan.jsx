import React, { useEffect, useState } from 'react';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { Box, Breadcrumbs, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { toast } from 'react-toastify';

const EducatorEditLearningPlan = () => {
    const activityContainerStyle = {
        width: '360px',
        p: 2,
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        height: '210px',
        display: 'flex',
        flexDirection: 'column'
    };
    const textFieldStyle = { height: "65px", width: "100%", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };
    const inputStyle = { height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px', width: '100%' };

    const { childId } = useParams();
    const navigate = useNavigate();

    const [educatorDetails, setEducatorDetails] = useState({});
    const [learningPlan, setLearningPlan] = useState({
        goal: '',
        planDuration: 1,
        weeks: [{ activities: [{ title: '', description: '' }] }]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLearningPlanOfStudent = async () => {
        try {
            const token = localStorage.getItem("token");
            const educatorId = (JSON.parse(localStorage.getItem("educatorDetails"))?._id);

            if (!educatorId || !childId) {
                throw new Error("Missing educator or student ID");
            }

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/educator/getstudentplan/${educatorId}/${childId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log(response.data.data[0]);

            if (response.data?.data?.length > 0) {
                const plan = response.data.data[0]; // Get the first plan from the array

                // Ensure all required fields exist and are properly formatted
                const formattedPlan = {
                    _id: plan._id,
                    goal: plan.goal || '',
                    planDuration: plan.planDuration || (plan.weeks ? plan.weeks.length : 1),
                    weeks: plan.weeks?.map(week => ({
                        _id: week._id,
                        activities: week.activities?.map(activity => ({
                            _id: activity._id,
                            title: activity.title || '',
                            description: activity.description || '',
                            completed: activity.completed || false
                        })) || [{ title: '', description: '' }]
                    })) || [{ activities: [{ title: '', description: '' }] }],
                    educatorId: plan.educatorId,
                    therapistId: plan.therapistId,
                    childId: plan.childId,
                    status: plan.status,
                    updatedStatus: plan.updatedStatus,
                    createdAt: plan.createdAt
                };

                setLearningPlan(formattedPlan);
            } else {
                // Initialize with default plan if none exists
                setLearningPlan({
                    goal: '',
                    planDuration: 1,
                    weeks: [{ activities: [{ title: '', description: '' }] }]
                });
            }
        } catch (error) {
            console.error("Error fetching learning plan:", error);
            setError("Failed to load learning plan");
            toast.error("Failed to load learning plan");
            // Initialize with default plan on error
            setLearningPlan({
                goal: '',
                planDuration: 1,
                weeks: [{ activities: [{ title: '', description: '' }] }]
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedEducatorDetails = localStorage.getItem("educatorDetails");
        if (storedEducatorDetails) {
            setEducatorDetails(JSON.parse(storedEducatorDetails));
        }
        fetchLearningPlanOfStudent();
    }, [childId]);

    const navigateToProfile = () => {
        navigate('/educator/profile');
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
            weeks: [...prev.weeks, { activities: [{ title: '', description: '' }] }],
            planDuration: prev.planDuration + 1
        }));
    };

    const handleRemoveActivity = (weekIndex, activityIndex) => {
        const updatedWeeks = [...learningPlan.weeks];
        updatedWeeks[weekIndex].activities.splice(activityIndex, 1);

        // If this was the last activity in the week, add a new empty one
        if (updatedWeeks[weekIndex].activities.length === 0) {
            updatedWeeks[weekIndex].activities.push({ title: '', description: '' });
        }

        setLearningPlan(prev => ({ ...prev, weeks: updatedWeeks }));
    };

    const handleRemoveWeek = (weekIndex) => {
        if (learningPlan.weeks.length <= 1) {
            toast.warning("You must have at least one week");
            return;
        }

        const updatedWeeks = [...learningPlan.weeks];
        updatedWeeks.splice(weekIndex, 1);

        setLearningPlan(prev => ({
            ...prev,
            weeks: updatedWeeks,
            planDuration: updatedWeeks.length
        }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const educatorId = (JSON.parse(localStorage.getItem("educatorDetails"))?._id);

        if (!educatorId || !childId) {
            toast.error("Missing educator or student information");
            return;
        }

        try {
            // Prepare the data to send (matching the expected API format)
            const planData = {
                _id: learningPlan._id,
                goal: learningPlan.goal,
                planDuration: learningPlan.planDuration,
                weeks: learningPlan.weeks.map(week => ({
                    _id: week._id,
                    activities: week.activities.map(activity => ({
                        _id: activity._id,
                        title: activity.title,
                        description: activity.description,
                        completed: activity.completed || false
                    }))
                })),
                educatorId: learningPlan.educatorId,
                therapistId: learningPlan.therapistId,
                childId: learningPlan.childId,
                status: learningPlan.status,
                updatedStatus: learningPlan.updatedStatus
            };

            const response = await axios.put(
                `${import.meta.env.VITE_SERVER_URL}/ldss/educator/updateplan/${educatorId}/${childId}`,
                planData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data?.message === "Learning plan updated successfully") {
                toast.success("Learning plan updated successfully");
                navigate(`/educator/viewlearningplan/${childId}`);
            }
        } catch (error) {
            console.error("Error updating learning plan:", error);
            toast.error("Failed to update learning plan");
        }
    };

    const handleCancel = () => {
        navigate(`/educator/viewlearningplan/${childId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <>
            <EducatorNavbar educatorDetails={educatorDetails} navigateToProfile={navigateToProfile} />

            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Edit Learning Plan
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/educator/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    <Link to="/educator/allstudents" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        All Students
                    </Link>
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Edit Learning Plan
                    </Typography>
                </Breadcrumbs>
            </Box>

            <Box display="flex" flexDirection="column" gap={3} alignItems="center" sx={{ width: "774px", mx: "auto", mt: 5 }}>
                <Typography color='primary' sx={{ fontSize: "24px", fontWeight: "500" }}>Edit Learning Plan</Typography>

                {/* Goal & Plan Duration */}
                <Stack direction="row" spacing={3}>
                    <div style={textFieldStyle}>
                        <label>Goal</label>
                        <input
                            style={inputStyle}
                            name='goal'
                            value={learningPlan.goal || ''}
                            onChange={handleInputChange}
                            type='text'
                        />
                    </div>
                    <div style={textFieldStyle}>
                        <label>Plan Duration (Weeks)</label>
                        <input
                            style={inputStyle}
                            name='planDuration'
                            value={learningPlan.planDuration || learningPlan.weeks.length}
                            onChange={handleInputChange}
                            type='number'
                            min="1"
                        />
                    </div>
                </Stack>

                <Box sx={{ borderBottom: "1px solid #CCCCCC", width: "100%" }}></Box>

                {/* Weeks and Activities */}
                {learningPlan.weeks?.map((week, weekIndex) => (
                    <Box key={week._id || weekIndex} display="flex" flexDirection="column" gap={2} alignItems="center" sx={{ width: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                            <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>{`Week ${weekIndex + 1}`}</Typography>
                            {learningPlan.weeks.length > 1 && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => handleRemoveWeek(weekIndex)}
                                >
                                    Remove Week
                                </Button>
                            )}
                        </Box>

                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: '20px'
                        }}>
                            {/* Activities */}
                            {week.activities?.map((activity, activityIndex) => (
                                <Box key={activity._id || activityIndex} sx={activityContainerStyle}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            Activity {activityIndex + 1}
                                        </Typography>
                                        {week.activities.length > 1 && (
                                            <Button
                                                variant="text"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRemoveActivity(weekIndex, activityIndex)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </Box>
                                    <div style={textFieldStyle}>
                                        <label>Title</label>
                                        <input
                                            style={inputStyle}
                                            name='title'
                                            value={activity.title || ''}
                                            onChange={(e) => handleActivityChange(weekIndex, activityIndex, e)}
                                        />
                                    </div>
                                    <div style={{ height: "85px", width: "100%", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                                        <label>Description</label>
                                        <input
                                            style={{ height: "60px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px', width: '100%' }}
                                            name='description'
                                            value={activity.description || ''}
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

                {/* Action Buttons */}
                <Box display='flex' gap={2} sx={{ mb: 4 }}>
                    <Button
                        variant='outlined'
                        color='secondary'
                        sx={{ borderRadius: "25px", height: "40px", width: '200px' }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        color='secondary'
                        sx={{ borderRadius: "25px", height: "40px", width: '200px' }}
                        onClick={handleSubmit}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default EducatorEditLearningPlan;