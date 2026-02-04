import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import TheraphistNavbar from '../Navbar/TheraphistNavbar';
import { jwtDecode } from 'jwt-decode';

const TherapistViewLearningPlan = () => {
    const [therapistDetails, setTherapistDetails] = useState({});
    const [studentPlan, setStudentsPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { childId } = useParams();

    // Initialize therapist details
    useEffect(() => {
        const fetchTherapist = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const decoded = jwtDecode(token);
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${decoded.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data?.theraphist?._id) {
                    setTherapistDetails(response.data.theraphist);
                    fetchLearningPlan(response.data.theraphist._id, childId);
                }
            } catch (error) {
                console.error("Error fetching therapist:", error);
                setLoading(false);
            }
        };

        fetchTherapist();
    }, [childId]);

    const fetchLearningPlan = async (therapistId, studentId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/getstudentplan/${therapistId}/${studentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data?.data) {
                setStudentsPlan(response.data.data);
            } else {
                setStudentsPlan(null);
            }
        } catch (error) {
            console.error("Failed to fetch learning plan:", error);
            setStudentsPlan(null);
        } finally {
            setLoading(false);
        }
    };

    const deleteLearningPlan = async (planId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/deleteplan/${planId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/therapist/allstudents');
        } catch (error) {
            console.error("Failed to delete learning plan:", error);
        }
    };

    const handleEdit = () => {
        navigate(`/therapist/editlearningplan/${childId}`);
    };

    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <>
            <TheraphistNavbar theraphistdetails={therapistDetails} navigateToProfile={navigateToProfile} />

            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Learning Plan
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/theraphist/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    <Link to="/therapist/allstudents" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
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

                    {studentPlan[0]?.weeks?.map((week, weekIndex) => (
                        <Box key={weekIndex} display={'flex'} flexDirection={'column'} m={"20px 50px"} sx={{ height: "268px", background: "#F0F6FE" }}>
                            <Typography variant='h6' color='primary' sx={{ fontSize: "24px", fontWeight: "500", p: "20px 30px" }}>
                                Week {weekIndex + 1}
                            </Typography>

                            <Box display={"flex"} alignItems={"center"} gap={1}>
                                {week.activities?.map((activity, index) => (
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

                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3} sx={{ marginBottom: "50px" }}>
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

export default TherapistViewLearningPlan;