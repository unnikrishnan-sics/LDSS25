import React, { useEffect, useState } from 'react';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { Box, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { toast } from 'react-toastify';

const EducatorAddLearningPlan = () => {
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
    const errorStyle = { color: 'red', fontSize: '12px', marginTop: '4px' };

    const { childId } = useParams();

    const [educatorDetails, setEducatorDetails] = useState({});
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

    const [errors, setErrors] = useState({
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
        ]
    });

    useEffect(() => {
        const educatorDetails = localStorage.getItem("educatorDetails");
        if (educatorDetails) {
            setEducatorDetails(JSON.parse(educatorDetails));
        }
    }, []);

    const navigateToProfile = () => {
        navigate('/educator/profile');
    };

    const validateGoal = (value) => {
        if (!value) return 'Goal is required';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Only alphabets are allowed';
        return '';
    };

    const validatePlanDuration = (value) => {
        if (!value) return 'Plan duration is required';
        if (!/^\d+$/.test(value)) return 'Only numbers are allowed';
        if (value <= 0) return 'Duration must be greater than 0';
        return '';
    };

    const validateTitle = (value) => {
        if (!value) return 'Title is required';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Only alphabets are allowed';
        return '';
    };

    const validateDescription = (value) => {
        if (!value) return 'Description is required';
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let error = '';

        if (name === 'goal') {
            error = validateGoal(value);
        } else if (name === 'planDuration') {
            error = validatePlanDuration(value);
        }

        setLearningPlan(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleActivityChange = (weekIndex, activityIndex, e) => {
        const { name, value } = e.target;
        const updatedWeeks = [...learningPlan.weeks];
        updatedWeeks[weekIndex].activities[activityIndex][name] = value;

        // Validate the field
        let error = '';
        if (name === 'title') {
            error = validateTitle(value);
        } else if (name === 'description') {
            error = validateDescription(value);
        }

        // Update errors
        const updatedErrors = JSON.parse(JSON.stringify(errors));
        if (!updatedErrors.weeks[weekIndex]) {
            updatedErrors.weeks[weekIndex] = { activities: [] };
        }
        if (!updatedErrors.weeks[weekIndex].activities[activityIndex]) {
            updatedErrors.weeks[weekIndex].activities[activityIndex] = {};
        }
        updatedErrors.weeks[weekIndex].activities[activityIndex][name] = error;

        setLearningPlan(prev => ({ ...prev, weeks: updatedWeeks }));
        setErrors(updatedErrors);
    };

    const handleAddActivity = (weekIndex) => {
        const updatedWeeks = [...learningPlan.weeks];
        updatedWeeks[weekIndex].activities.push({ title: '', description: '' });

        // Add corresponding error structure
        const updatedErrors = JSON.parse(JSON.stringify(errors));
        if (!updatedErrors.weeks[weekIndex]) {
            updatedErrors.weeks[weekIndex] = { activities: [] };
        }
        updatedErrors.weeks[weekIndex].activities.push({ title: '', description: '' });

        setLearningPlan(prev => ({ ...prev, weeks: updatedWeeks }));
        setErrors(updatedErrors);
    };

    const handleAddWeek = () => {
        setLearningPlan(prev => ({
            ...prev,
            weeks: [...prev.weeks, { activities: [{ title: '', description: '' }] }]
        }));

        setErrors(prev => ({
            ...prev,
            weeks: [...prev.weeks, { activities: [{ title: '', description: '' }] }]
        }));
    };

    const validateAllFields = () => {
        let isValid = true;
        const newErrors = JSON.parse(JSON.stringify(errors));

        // Validate goal
        newErrors.goal = validateGoal(learningPlan.goal);
        if (newErrors.goal) isValid = false;

        // Validate plan duration
        newErrors.planDuration = validatePlanDuration(learningPlan.planDuration);
        if (newErrors.planDuration) isValid = false;

        // Validate weeks and activities
        learningPlan.weeks.forEach((week, weekIndex) => {
            week.activities.forEach((activity, activityIndex) => {
                newErrors.weeks[weekIndex] = newErrors.weeks[weekIndex] || { activities: [] };
                newErrors.weeks[weekIndex].activities[activityIndex] = newErrors.weeks[weekIndex].activities[activityIndex] || {};

                // Validate title
                newErrors.weeks[weekIndex].activities[activityIndex].title = validateTitle(activity.title);
                if (newErrors.weeks[weekIndex].activities[activityIndex].title) isValid = false;

                // Validate description
                newErrors.weeks[weekIndex].activities[activityIndex].description = validateDescription(activity.description);
                if (newErrors.weeks[weekIndex].activities[activityIndex].description) isValid = false;
            });
        });

        setErrors(newErrors);
        return isValid;
    };

    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (!validateAllFields()) {
            toast.error('Please fix all validation errors before submitting');
            return;
        }

        console.log("Submitted Learning Plan:", learningPlan);
        const token = localStorage.getItem('token');
        const educatorId = (JSON.parse(localStorage.getItem("educatorDetails")))._id;
        const payload = {
            ...learningPlan,
            educatorId: educatorId,
            childId: childId
        };

        try {
            const plan = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/addlearning`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(plan);
            if (plan.data.message === "Learning plan already added for this student.") {
                toast.error("Learning plan already added for this student");
                navigate(`/educator/viewlearningplan/${childId}`);
            } else {
                toast.success("Learning plan added successfully!");
                navigate(-1); // This will go back to the previous page
            }
        } catch (error) {
            toast.error('Error submitting learning plan');
            console.error(error);
        }
    };
    return (
        <>
            <EducatorNavbar educatorDetails={educatorDetails} navigateToProfile={navigateToProfile} />

            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Learning Plan
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/educator/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    <Link to="/educator/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
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
                        {errors.goal && <span style={errorStyle}>{errors.goal}</span>}
                    </div>
                    <div style={textFieldStyle}>
                        <label>Plan Duration (Weekly)</label>
                        <input
                            style={inputStyle}
                            name='planDuration'
                            value={learningPlan.planDuration}
                            onChange={handleInputChange}
                            type='number'
                            min="1"
                        />
                        {errors.planDuration && <span style={errorStyle}>{errors.planDuration}</span>}
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
                                            type='text'
                                        />
                                        {errors.weeks[weekIndex]?.activities[activityIndex]?.title &&
                                            <span style={errorStyle}>{errors.weeks[weekIndex].activities[activityIndex].title}</span>}
                                    </div>
                                    <div style={{ height: "85px", width: "100%", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                                        <label>Description</label>
                                        <input
                                            style={{ height: "60px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px', width: '100%' }}
                                            name='description'
                                            value={activity.description}
                                            onChange={(e) => handleActivityChange(weekIndex, activityIndex, e)}
                                        />
                                        {errors.weeks[weekIndex]?.activities[activityIndex]?.description &&
                                            <span style={errorStyle}>{errors.weeks[weekIndex].activities[activityIndex].description}</span>}
                                    </div>
                                </Box>
                            ))}

                            {/* Add Activity Button Container - matches activity container dimensions */}
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

export default EducatorAddLearningPlan;