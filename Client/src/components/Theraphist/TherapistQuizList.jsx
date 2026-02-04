import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, List, Paper, ListItem, ListItemText, Divider, Breadcrumbs, IconButton } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import TherapistNavbar from '../Navbar/TheraphistNavbar'; // Adjust path
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
const TherapistQuizList = () => {
    const { childId } = useParams();
    const navigate = useNavigate();

    const [therapistDetails, setTherapistDetails] = useState({});
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const details = localStorage.getItem("theraphistDetails");
        if (details) {
            setTherapistDetails(JSON.parse(details));
        }
        fetchQuizzes();
    }, [childId]);

    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    const fetchQuizzes = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/therapist/quizzes/child/${childId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setQuizzes(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch quizzes.");
            }
        } catch (err) {
            console.error("Error fetching quizzes:", err);
            setError(err.response?.data?.message || "An error occurred while fetching quizzes.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (window.confirm("Are you sure you want to delete this quiz and all its attempts?")) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(
                    `${import.meta.env.VITE_SERVER_URL}/ldss/therapist/quiz/${quizId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    toast.success("Quiz deleted successfully!");
                    // Remove the deleted quiz from the state
                    setQuizzes(quizzes.filter(q => q._id !== quizId));
                } else {
                    toast.error(response.data.message || "Failed to delete quiz.");
                }
            } catch (err) {
                console.error("Error deleting quiz:", err);
                toast.error(err.response?.data?.message || "An error occurred while deleting the quiz.");
            }
        }
    };


    if (loading) {
        return (
            <>
                <TherapistNavbar therapistDetails={therapistDetails} navigateToProfile={navigateToProfile} />
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
                    Quizzes
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
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Quizzes
                    </Typography>
                </Breadcrumbs>
            </Box>


            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" color="primary">
                        Available Quizzes
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/therapist/child/${childId}/quizzes/add`)}
                        sx={{ borderRadius: '25px' }}
                    >
                        Add New Quiz
                    </Button>
                </Box>


                {quizzes.length === 0 ? (
                    <Typography>No quizzes found for this child yet.</Typography>
                ) : (
                    <List component={Paper} elevation={2}>
                        {quizzes.map((quiz) => (
                            <React.Fragment key={quiz._id}>
                                <ListItem
                                    secondaryAction={
                                        <>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ mr: 1, borderRadius: '20px' }}
                                                onClick={() => navigate(`/therapist/child/${childId}/quizzes/attempts`)}
                                            >
                                                View Attempts
                                            </Button>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteQuiz(quiz._id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </>
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
            </Box>
        </>
    );
};

export default TherapistQuizList;
