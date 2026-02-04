import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Divider, Paper, Breadcrumbs } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ParentNavbar from '../Navbar/ParentNavbar'; // Adjust path
import moment from 'moment';

const ParentQuizList = () => {
    const { childId } = useParams(); // Get childId from URL
    const navigate = useNavigate();

    const [parentDetails, setParentDetails] = useState({});
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const details = localStorage.getItem("parentDetails");
        if (details) {
            setParentDetails(JSON.parse(details));
        }
        if (childId) {
            fetchQuizzesForChild();
        } else {
            setError("Child ID is missing.");
            setLoading(false);
        }

    }, [childId]); // Depend on childId

    const navigateToProfile = () => {
        navigate('/parent/profile');
    };

    const fetchQuizzesForChild = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/parent/quizzes/child/${childId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setQuizzes(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch quizzes.");
            }
        } catch (err) {
            console.error("Error fetching parent quizzes:", err);
            setError(err.response?.data?.message || "An error occurred while fetching quizzes.");
        } finally {
            setLoading(false);
        }
    };
    console.log(quizzes);

    if (loading) {
        return (
            <>
                <ParentNavbar parentdetails={parentDetails} navigateToProfile={navigateToProfile} />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            </>
        );
    }

    if (error) {
        return (
            <>
                <ParentNavbar parentdetails={parentDetails} navigateToProfile={navigateToProfile} />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <Typography color="error">{error}</Typography>
                </Box>
            </>
        );
    }


    return (
        <>
            <ParentNavbar parentdetails={parentDetails} navigateToProfile={navigateToProfile} />
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Quizzes
                </Typography>
            </Box>

            <Box display="flex" justifyContent="start" alignItems="start" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/parent/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    {/* Assuming you have a page listing all children for the parent */}
                    {/* <Link to="/parent/children" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        My Children
                    </Link> */}
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Quizzes
                    </Typography>
                </Breadcrumbs>
            </Box>


            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 3 }}>
                <Typography variant="h5" color="primary" gutterBottom align="center">
                    Available Quizzes
                </Typography>

                {quizzes.length === 0 ? (
                    <Typography>No quizzes found for this child yet.</Typography>
                ) : (
                    <List component={Paper} elevation={2}>
                        {quizzes.map((quiz) => (
                            <React.Fragment key={quiz._id}>
                                <ListItem
                                    secondaryAction={
                                        quiz.attempt ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="success"
                                                sx={{ borderRadius: '20px' }}
                                                onClick={() => navigate(`/parent/quiz/attempt/${quiz.attempt._id}`)}
                                            >
                                                View Result ({quiz.attempt.score}/{quiz.questions.length})
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="secondary"
                                                sx={{ borderRadius: '20px' }}
                                                onClick={() => navigate(`/parent/quiz/take/${quiz._id}`)}
                                            >
                                                Take Quiz
                                            </Button>
                                        )
                                    }
                                >
                                    <ListItemText
                                        primary={quiz.title}
                                        secondary={`${quiz.questions.length} Questions`}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    {/* Link back to where you list children or the child's detail page */}
                    {/* Example: navigate(`/parent/child/${childId}`) */}
                    <Button
                        variant='outlined'
                        color='secondary'
                        sx={{ borderRadius: '25px', width: '200px' }}
                        onClick={() => navigate('/parent/home')} // Adjust to appropriate back link
                    >
                        Back
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default ParentQuizList;
