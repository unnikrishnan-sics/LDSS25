import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Divider, Paper, Breadcrumbs } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import TherapistNavbar from '../Navbar/TheraphistNavbar'; // Adjust path
import moment from 'moment';

const TherapistQuizAttemptList = () => {
    const { childId } = useParams();
    const navigate = useNavigate();

    const [therapistDetails, setTherapistDetails] = useState({});
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const details = localStorage.getItem("theraphistDetails");
        if (details) {
            setTherapistDetails(JSON.parse(details));
        }
        fetchAttempts();
    }, [childId]);

    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    const fetchAttempts = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/therapist/quizzes/attempts/${childId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response, "dfsfs");

            if (response.data.success) {
                setAttempts(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch attempts.");
            }
        } catch (err) {
            console.error("Error fetching attempts:", err);
            setError(err.response?.data?.message || "An error occurred while fetching attempts.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <TherapistNavbar theraphistdetails={therapistDetails} navigateToProfile={navigateToProfile} />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            </>
        );
    }

    if (error) {
        return (
            <>
                <TherapistNavbar theraphistdetails={therapistDetails} navigateToProfile={navigateToProfile} />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <Typography color="error">{error}</Typography>
                </Box>
            </>
        );
    }

    return (
        <>
            <TherapistNavbar theraphistdetails={therapistDetails} navigateToProfile={navigateToProfile} />
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Quiz Attempts
                </Typography>
            </Box>

            <Box display="flex" justifyContent="start" alignItems="start" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/therapist/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    <Link to="/therapist/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        All Students
                    </Link>
                    <Link to={`/therapist/child/${childId}/quizzes`} style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Quizzes
                    </Link>
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Attempts
                    </Typography>
                </Breadcrumbs>
            </Box>


            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 3 }}>
                <Typography variant="h5" color="primary" gutterBottom align="center">
                    Quiz Attempts
                </Typography>

                {attempts.length === 0 ? (
                    <Typography>No attempts recorded for this child yet.</Typography>
                ) : (
                    <List component={Paper} elevation={2}>
                        {attempts.map((attempt) => (
                            <React.Fragment key={attempt._id}>
                                <ListItem
                                    secondaryAction={
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ borderRadius: '20px' }}
                                            onClick={() => navigate(`/therapist/quiz/attempt/${attempt._id}`)}
                                        >
                                            View Report
                                        </Button>
                                    }
                                >
                                    <ListItemText
                                        primary={attempt.quizId?.title || 'Untitled Quiz'}
                                        secondary={`Score: ${attempt.score}/${attempt.answers.length} | Completed: ${moment(attempt.completedAt).format('YYYY-MM-DD HH:mm')}`}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant='outlined'
                        color='secondary'
                        sx={{ borderRadius: '25px', width: '200px' }}
                        onClick={() => navigate(`/therapist/child/${childId}/quizzes`)}
                    >
                        Back to Quizzes
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default TherapistQuizAttemptList;
