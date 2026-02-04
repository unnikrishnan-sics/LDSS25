import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, FormControl, RadioGroup, FormControlLabel, Radio, Breadcrumbs } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ParentNavbar from '../Navbar/ParentNavbar'; // Adjust path

const ParentTakeQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIndex: chosenOptionIndex }
    const [submitting, setSubmitting] = useState(false);
    const parentDetails = JSON.parse(localStorage.getItem("parentDetails")) || {};
    useEffect(() => {

        fetchQuizDetails();
    }, [quizId]);

    const navigateToProfile = () => {
        navigate('/parent/profile');
    };

    const fetchQuizDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');

            const quizResponse = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/quizzes/${quizId}`, // Use the new route
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!quizResponse.data.success || !quizResponse.data.data) {
                throw new Error("Quiz not found or could not fetch.");
            }

            const fetchedQuiz = quizResponse.data.data;

            // Check if the logged-in parent is associated with the child of this quiz
            const parentDetails = JSON.parse(localStorage.getItem("parentDetails"));
            // This requires fetching the child's details or ensuring the parent model
            // includes child references, or checking on the backend.
            // For simplicity in the frontend, let's just check if an attempt exists.
            // A proper backend check that the parent is linked to the child (via the child model)
            // should be added to the getQuizById controller function for security.

            // Check if an attempt already exists for this quiz and THIS CHILD for THIS PARENT
            // This check is important and might require a specific backend route
            // or fetching attempts first. Let's modify the ParentQuizList to pass attempt status
            // and the TakeQuiz component to check *before* fetching details, or fetch attempts here.

            // ** Better Approach: Check for existing attempt *after* getting quiz data**
            const attemptsResponse = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/parent/quizzes/child/${fetchedQuiz.childId}`, // Reuse the list endpoint to check attempts
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const quizWithStatus = attemptsResponse.data.data.find(q => q._id === quizId);

            if (quizWithStatus && quizWithStatus.attempt) {
                toast.info("You have already completed this quiz.");
                navigate(`/parent/quiz/attempt/${quizWithStatus.attempt._id}`); // Redirect to report
                return;
            }


            setQuiz(fetchedQuiz);
            // Initialize answers state
            const initialAnswers = {};
            fetchedQuiz.questions.forEach((_, index) => {
                // No default selection, user must choose
            });
            setSelectedAnswers(initialAnswers);


        } catch (err) {
            console.error("Error fetching quiz details:", err);
            setError(err.response?.data?.message || "An error occurred while fetching quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (qIndex, oIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [qIndex]: oIndex,
        });
    };

    const handleSubmitAttempt = async () => {
        if (!quiz) return;

        // Basic validation: Check if all questions have an answer selected
        if (Object.keys(selectedAnswers).length !== quiz.questions.length ||
            Object.values(selectedAnswers).some(answer => answer === undefined || answer === null)) {
            toast.warning("Please answer all questions before submitting.");
            return;
        }


        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');

            // Prepare the answers payload in the format backend expects
            const answersPayload = Object.keys(selectedAnswers).map(qIndex => ({
                questionIndex: parseInt(qIndex, 10),
                chosenAnswerIndex: selectedAnswers[qIndex]
            }));

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/parent/quiz/submit/${quizId}`,
                {
                    answers: answersPayload,
                    parentId: parentDetails._id // Pass parent ID if needed
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success(`Quiz submitted! Your score: ${response.data.score}/${response.data.totalQuestions}`);
                navigate(`/parent/quiz/attempt/${response.data.data._id}`); // Navigate to the attempt report
            } else {
                toast.error(response.data.message || "Failed to submit quiz.");
            }

        } catch (err) {
            console.error("Error submitting quiz attempt:", err);
            toast.error(err.response?.data?.message || "An error occurred while submitting the quiz.");
        } finally {
            setSubmitting(false);
        }
    };


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

    if (!quiz) {
        return (
            <>
                <ParentNavbar parentdetails={parentDetails} navigateToProfile={navigateToProfile} />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <Typography>Quiz data is not available.</Typography>
                </Box>
            </>
        );
    }


    return (
        <>
            <ParentNavbar parentdetails={parentDetails} navigateToProfile={navigateToProfile} />
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Take Quiz
                </Typography>
            </Box>

            <Box display="flex" justifyContent="start" alignItems="start" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/parent/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    {/* Link back to the child's quiz list - needs childId */}
                    {/* Assuming quiz object contains childId after fetch */}
                    {quiz.childId && (
                        <Link to={`/parent/child/${quiz.childId}/quizzes`} style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                            Quizzes
                        </Link>
                    )}

                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Take Quiz
                    </Typography>
                </Breadcrumbs>
            </Box>


            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 3 }}>
                <Typography variant="h5" color="primary" gutterBottom align="center">
                    {quiz.title}
                </Typography>

                {quiz.questions.map((question, qIndex) => (
                    <Paper key={qIndex} elevation={1} sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Question {qIndex + 1}: {question.questionText}
                        </Typography>
                        <FormControl component="fieldset" sx={{ mt: 1, ml: 2 }}>
                            <RadioGroup
                                aria-label={`question-${qIndex}`}
                                name={`question-${qIndex}`}
                                value={selectedAnswers[qIndex] !== undefined ? selectedAnswers[qIndex].toString() : ''}
                                onChange={(e) => handleAnswerChange(qIndex, parseInt(e.target.value, 10))}
                            >
                                {question.options.map((option, oIndex) => (
                                    <FormControlLabel
                                        key={oIndex}
                                        value={oIndex.toString()}
                                        control={<Radio />}
                                        label={`${String.fromCharCode(65 + oIndex)}. ${option}`}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant='contained'
                        color='secondary'
                        sx={{ borderRadius: '25px', width: '200px' }}
                        onClick={handleSubmitAttempt}
                        disabled={submitting}
                    >
                        {submitting ? <CircularProgress size={24} /> : 'Submit Quiz'}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default ParentTakeQuiz;
