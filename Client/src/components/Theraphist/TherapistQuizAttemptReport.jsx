import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Grid, Breadcrumbs } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import TherapistNavbar from '../Navbar/TheraphistNavbar'; // Adjust path
import moment from 'moment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const TherapistQuizAttemptReport = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [therapistDetails, setTherapistDetails] = useState({});
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const details = localStorage.getItem("theraphistDetails");
        if (details) {
            setTherapistDetails(JSON.parse(details));
        }
        fetchAttemptDetails();
    }, [attemptId]);

    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    const fetchAttemptDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/therapist/quiz/attempt/${attemptId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setAttempt(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch attempt details.");
            }
        } catch (err) {
            console.error("Error fetching attempt details:", err);
            setError(err.response?.data?.message || "An error occurred while fetching attempt details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <TherapistNavbar therapgistdetails={therapistDetails} navigateToProfile={navigateToProfile} />
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

    if (!attempt || !attempt.quizId) {
        return (
            <>
                <TherapistNavbar theraphistdetails={therapistDetails} navigateToProfile={navigateToProfile} />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <Typography>Attempt data is incomplete.</Typography>
                </Box>
            </>
        );
    }


    return (
        <>
            <TherapistNavbar theraphistdetails={therapistDetails} navigateToProfile={navigateToProfile} />
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Quiz Report
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
                    <Link to={`/therapist/child/${attempt.childId}/quizzes`} style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Quizzes
                    </Link>
                    <Link to={`/therapist/child/${attempt.childId}/quizzes/attempts`} style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Attempts
                    </Link>
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Report
                    </Typography>
                </Breadcrumbs>
            </Box>


            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 3 }}>
                <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="primary" gutterBottom align="center">
                        {attempt.quizId.title || 'Quiz Report'}
                    </Typography>
                    <Typography variant="h6" color="secondary" align="center">
                        Score: {attempt.score} / {attempt.quizId.questions.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center">
                        Completed on: {moment(attempt.completedAt).format('YYYY-MM-DD HH:mm')}
                    </Typography>
                    {/* Optionally display child name if populated or fetched */}
                    {/* <Typography variant="body2" color="textSecondary" align="center">
                         For Child: {attempt.childId?.name || 'N/A'}
                     </Typography> */}
                </Paper>

                {attempt.quizId.questions.map((question, qIndex) => {
                    const attemptedAnswer = attempt.answers.find(ans => ans.questionIndex === qIndex);
                    const chosenOptionIndex = attemptedAnswer ? attemptedAnswer.chosenAnswerIndex : -1;
                    const isCorrect = attemptedAnswer ? attemptedAnswer.isCorrect : false;
                    const correctOptionIndex = question.correctAnswerIndex;

                    return (
                        <Paper key={qIndex} elevation={1} sx={{ p: 3, mt: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" color="primary">
                                    Question {qIndex + 1}: {question.questionText}
                                </Typography>
                                {isCorrect ? (
                                    <CheckCircleOutlineIcon color="success" />
                                ) : (
                                    <CancelOutlinedIcon color="error" />
                                )}
                            </Box>
                            <Box sx={{ mt: 2, ml: 2 }}>
                                {question.options.map((option, oIndex) => (
                                    <Typography
                                        key={oIndex}
                                        sx={{
                                            fontWeight: chosenOptionIndex === oIndex ? 'bold' : 'normal',
                                            color: oIndex === correctOptionIndex ? 'green' : (chosenOptionIndex === oIndex ? 'red' : 'inherit'),
                                            mb: 1
                                        }}
                                    >
                                        {oIndex === correctOptionIndex && oIndex === chosenOptionIndex && <CheckCircleOutlineIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} color="success" fontSize="small" />}
                                        {oIndex === correctOptionIndex && oIndex !== chosenOptionIndex && <CheckCircleOutlineIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} color="success" fontSize="small" />}
                                        {chosenOptionIndex === oIndex && oIndex !== correctOptionIndex && <CancelOutlinedIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} color="error" fontSize="small" />}
                                        {String.fromCharCode(65 + oIndex)}. {option}
                                        {oIndex === correctOptionIndex && oIndex !== chosenOptionIndex && <Typography component="span" sx={{ ml: 1, fontSize: '0.8em', color: 'green' }}> (Correct Answer)</Typography>}
                                        {chosenOptionIndex === oIndex && oIndex !== correctOptionIndex && <Typography component="span" sx={{ ml: 1, fontSize: '0.8em', color: 'red' }}> (Your Answer)</Typography>}
                                    </Typography>
                                ))}
                            </Box>
                        </Paper>
                    );
                })}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant='outlined'
                        color='secondary'
                        sx={{ borderRadius: '25px', width: '200px' }}
                        onClick={() => navigate(`/therapist/child/${attempt.childId}/quizzes/attempts`)}
                    >
                        Back to Attempts
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default TherapistQuizAttemptReport;
