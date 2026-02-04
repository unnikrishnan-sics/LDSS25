import React, { useEffect, useState } from 'react';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { Box, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { toast } from 'react-toastify';

const EducatorViewLearningPlan = () => {
    const [educatorDetails, setEducatorDetails] = useState({});
    const [useDummyData, setUseDummyData] = useState(false);

    useEffect(() => {
        const educatorDetails = localStorage.getItem("educatorDetails");
        if (educatorDetails) {
            setEducatorDetails(JSON.parse(educatorDetails));
        }
    }, []);

    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/educator/profile');
    };
    const { childId } = useParams();

    const [studentPlan, setStudentsPlan] = useState(null);

    // Dummy data for learning plans
    const dummyLearningPlans = [
        {
            _id: 'plan1',
            goal: 'Improve reading comprehension',
            planDuration: 8,
            weeks: [
                {
                    activities: [
                        {
                            title: 'Reading Practice',
                            description: 'Read short stories and answer questions'
                        },
                        {
                            title: 'Vocabulary Building',
                            description: 'Learn 10 new words each week'
                        },
                        {
                            title: 'Comprehension Exercises',
                            description: 'Practice identifying main ideas'
                        }
                    ]
                },
                {
                    activities: [
                        {
                            title: 'Advanced Reading',
                            description: 'Read longer passages with complex themesRead longer passages with complex themesRead longer passages with complex themesRead longer passages with complex themesRead longer passages with complex themes'
                        },
                        {
                            title: 'Context Clues',
                            description: 'Practice deducing word meanings from context'
                        },
                        {
                            title: 'Summary Writing',
                            description: 'Write summaries of read passages'
                        }
                    ]
                },
                {
                    activities: [
                        {
                            title: 'Advanced Reading',
                            description: 'Read longer passages with complex themes'
                        },
                        {
                            title: 'Context Clues',
                            description: 'Practice deducing word meanings from context'
                        },
                        {
                            title: 'Summary Writing',
                            description: 'Write summaries of read passages'
                        }
                    ]
                },
                // Add more weeks as needed
            ]
        }
    ];

    const fetchLearningPlanOfStudent = async () => {
        if (useDummyData) {
            // Use dummy data
            setStudentsPlan(dummyLearningPlans);
        } else {
            // Actual API call
            try {
                const token = localStorage.getItem("token");
                const educatorId = (JSON.parse(localStorage.getItem("educatorDetails"))?._id);
                const studentPlan = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/ldss/educator/getstudentplan/${educatorId}/${childId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setStudentsPlan(studentPlan.data.data);
            } catch (error) {
                console.error("Failed to fetch learning plan:", error);
                setStudentsPlan(null);
            }
        }
    };

    useEffect(() => {
        fetchLearningPlanOfStudent();
    }, []);

    const deleteLearningPlan = async (planid) => {
        if (useDummyData) {
            // Handle dummy data deletion
            setStudentsPlan(null);
            toast.success("Dummy learning plan deleted");
        } else {
            // Actual API call
            try {
                const token = localStorage.getItem("token");
                await axios.delete(
                    `${import.meta.env.VITE_SERVER_URL}/ldss/educator/deleteplan/${planid}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                // Immediately remove the plan from the frontend
                setStudentsPlan(null);
                toast.success("Learning plan deleted successfully");
            } catch (error) {
                console.error("Failed to delete learning plan:", error);
                toast.error("Failed to delete learning plan");
            }
        }
    };

    const handleEdit = () => {
        navigate(`/educator/editlearningplan/${childId}`);
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
                    <Link to="/educator/allstudents" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        All Students
                    </Link>
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Learning Plan
                    </Typography>
                </Breadcrumbs>
            </Box>

            {studentPlan ? (
                <Box>
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} m={"20px 50px"} sx={{ background: "#F0F6FE", height: "70px" }}>
                        <Typography variant='h4' color='primary' sx={{ fontSize: "24px", fontWeight: "600", pl: "20px" }}>
                            Goal: {studentPlan[0]?.goal}
                        </Typography>
                        <Typography variant='h4' color='primary' sx={{ fontSize: "24px", fontWeight: "600", pr: "20px" }}>
                            {studentPlan[0]?.planDuration} Weeks Plan
                        </Typography>
                    </Box>

                    {Array.isArray(studentPlan[0]?.weeks) && studentPlan[0]?.weeks.map((week, weekIndex) => (
                        <Box key={weekIndex} display={'flex'} flexDirection={'column'} m={"20px 50px"} sx={{ height: "268px", background: "#F0F6FE" }}>
                            <Typography variant='h6' color='primary' sx={{ fontSize: "24px", fontWeight: "500", p: "20px 30px" }}>
                                Week {weekIndex + 1}
                            </Typography>

                            <Box display={"flex"} alignItems={"center"} gap={1}>
                                {Array.isArray(week.activities) && week.activities.map((activity, index) => (
                                    <Box key={index} display={'flex'} flexDirection={'column'} gap={1} width={"33%"} p={"10px 30px"}>
                                        <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                            Activity {index + 1}
                                        </Typography>
                                        <Box>
                                            <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>
                                                {activity.title}
                                            </Typography>
                                            <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#7F7F7F" }}>
                                                {activity.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ))}

                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3} sx={{ marginBottom: "50px", }}>
                        <Button
                            onClick={() => deleteLearningPlan(studentPlan[0]._id)}
                            variant='outlined'
                            color='secondary'
                            sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={handleEdit}
                            variant='contained'
                            color='secondary'
                            sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                        >
                            Edit
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Typography color='primary' sx={{ mt: "50px", fontSize: "32px", fontWeight: "600" }} textAlign={'center'}>
                    No learning plan added yet
                </Typography>
            )}
        </>
    );
};

export default EducatorViewLearningPlan;