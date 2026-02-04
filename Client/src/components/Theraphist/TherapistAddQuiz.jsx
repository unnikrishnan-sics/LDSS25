import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, IconButton, Paper, CircularProgress, Breadcrumbs } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import TherapistNavbar from '../Navbar/TheraphistNavbar'; // Adjust path as needed

const TherapistAddQuiz = () => {
    const { childId } = useParams();
    const navigate = useNavigate();

    const [therapistDetails, setTherapistDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState({
        title: '',
        questions: [
            { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }, // Start with 4 options
            { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
            { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
            { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
            { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
        ],
    });

    useEffect(() => {
        const details = localStorage.getItem("theraphistDetails");
        if (details) {
            setTherapistDetails(JSON.parse(details));
        }
        // Optionally fetch child name here if needed for display
    }, []);

    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    const handleTitleChange = (e) => {
        setQuizData({ ...quizData, title: e.target.value });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[index][field] = value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].correctAnswerIndex = parseInt(value, 10);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const addQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [...quizData.questions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }],
        });
    };

    const removeQuestion = (index) => {
        if (quizData.questions.length > 5) { // Keep minimum 5 questions
            const newQuestions = quizData.questions.filter((_, qIndex) => qIndex !== index);
            setQuizData({ ...quizData, questions: newQuestions });
        } else {
            toast.info("A quiz must have at least 5 questions.");
        }
    };

    const addOption = (qIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].options.push('');
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...quizData.questions];
        if (newQuestions[qIndex].options.length > 2) { // Keep minimum 2 options
            newQuestions[qIndex].options.splice(oIndex, 1);
            // Adjust correct answer index if it was the removed option or an index higher than the removed one
            if (newQuestions[qIndex].correctAnswerIndex === oIndex) {
                newQuestions[qIndex].correctAnswerIndex = 0; // Reset to first option
            } else if (newQuestions[qIndex].correctAnswerIndex > oIndex) {
                newQuestions[qIndex].correctAnswerIndex -= 1;
            }
            setQuizData({ ...quizData, questions: newQuestions });
        } else {
            toast.info("A question must have at least 2 options.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            console.log(therapistDetails._id);

            const payload = {
                childId: childId,
                title: quizData.title,
                therapistId: therapistDetails._id,
                questions: quizData.questions
                    // Basic trimming
                    .map(q => ({
                        ...q,
                        questionText: q.questionText.trim(),
                        options: q.options.map(opt => opt.trim())
                    }))
                    // Filter out empty questions or options (optional, backend validates too)
                    .filter(q => q.questionText && q.options.every(opt => opt !== '') && q.options.length >= 2),
            };

            if (payload.questions.length < 5) {
                toast.error("Please ensure you have at least 5 questions, and all questions/options are filled.");
                setLoading(false);
                return;
            }
            // Deeper validation: check correct answer index validity relative to options length
            for (const q of payload.questions) {
                if (q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
                    toast.error(`Question "${q.questionText}" has an invalid correct answer selection.`);
                    setLoading(false);
                    return;
                }
            }


            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/therapist/quizzes`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Quiz created successfully!");
                navigate(`/therapist/child/${childId}/quizzes`); // Navigate to quiz list for this child
            } else {
                toast.error(response.data.message || "Failed to create quiz.");
            }

        } catch (error) {
            console.error("Error creating quiz:", error);
            toast.error(error.response?.data?.message || "An error occurred while creating the quiz.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TherapistNavbar theraphistdetails={therapistDetails} navigateToProfile={navigateToProfile} />
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Create Quiz
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
                        Add New Quiz
                    </Typography>
                </Breadcrumbs>
            </Box>


            <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 3 }}>
                <Typography variant="h5" color="primary" gutterBottom align="center">
                    Create New Quiz for Child ID: {childId}
                </Typography>

                <TextField
                    label="Quiz Title"
                    fullWidth
                    margin="normal"
                    value={quizData.title}
                    onChange={handleTitleChange}
                    required
                />

                {quizData.questions.map((q, qIndex) => (
                    <Paper key={qIndex} elevation={1} sx={{ p: 3, mt: 3, position: 'relative' }}>
                        <Typography variant="h6" color="secondary" gutterBottom>
                            Question {qIndex + 1}
                        </Typography>
                        {quizData.questions.length > 5 && ( // Allow removal only if > 5 questions
                            <IconButton
                                aria-label="remove question"
                                size="small"
                                onClick={() => removeQuestion(qIndex)}
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                                color="error"
                            >
                                <RemoveIcon />
                            </IconButton>
                        )}


                        <TextField
                            label="Question Text"
                            fullWidth
                            margin="normal"
                            value={q.questionText}
                            onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                            required
                        />

                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Options (Select the correct one):</Typography>
                        {q.options.map((opt, oIndex) => (
                            <Box key={oIndex} display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                                <input
                                    type="radio"
                                    name={`correctAnswer-${qIndex}`}
                                    value={oIndex}
                                    checked={q.correctAnswerIndex === oIndex}
                                    onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                                    required // Ensure one correct answer is selected
                                />
                                <TextField
                                    label={`Option ${oIndex + 1}`}
                                    fullWidth
                                    size="small"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    required
                                />
                                {q.options.length > 2 && ( // Allow removal only if > 2 options
                                    <IconButton
                                        aria-label="remove option"
                                        size="small"
                                        onClick={() => removeOption(qIndex, oIndex)}
                                        color="error"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        <Button
                            variant='outlined'
                            size="small"
                            onClick={() => addOption(qIndex)}
                            startIcon={<AddIcon />}
                            sx={{ mt: 1 }}
                        >
                            Add Option
                        </Button>

                    </Paper>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant='outlined'
                        color='secondary'
                        startIcon={<AddIcon />}
                        onClick={addQuestion}
                        sx={{ borderRadius: '25px', width: '200px' }}
                    >
                        Add Question
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        sx={{ borderRadius: '25px', width: '200px' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create Quiz'}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default TherapistAddQuiz;
