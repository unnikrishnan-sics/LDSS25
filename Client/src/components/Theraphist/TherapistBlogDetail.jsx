import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Avatar, IconButton, Button, CircularProgress } from '@mui/material';
import { Favorite, FavoriteBorder, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TheraphistNavbar from '../Navbar/TheraphistNavbar';
import { jwtDecode } from 'jwt-decode';

const TherapistBlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const therapistDetails = JSON.parse(localStorage.getItem('theraphistDetails')) || {};
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUserId(decoded.id);
        }

        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBlog(response.data.blog);
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const handleLike = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/like/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBlogs();
        } catch (error) {
            console.error('Error liking blog:', error);
        }
    };

    const handleUnlike = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/unlike/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBlogs();
        } catch (error) {
            console.error('Error unliking blog:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!blog) {
        return (
            <Box sx={{ p: 3 }}>
                <TheraphistNavbar
                    theraphistdetails={therapistDetails}
                    navigateToProfile={() => navigate('/therapist/profile')}
                />

                <Typography variant="h5">Blog not found</Typography>
            </Box>
        );
    }

    const isLiked = blog.likes.some(like => like._id === currentUserId);

    return (
        <>
            <TheraphistNavbar
                theraphistdetails={therapistDetails}
                navigateToProfile={() => navigate('/therapist/profile')}
            />
            <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                >
                    Back to Blogs
                </Button>

                <Card>
                    {blog.image && (
                        <CardMedia
                            component="img"
                            height="300"
                            image={`${import.meta.env.VITE_SERVER_URL}/uploads/blogs/${blog.image.filename}`}
                            alt={blog.title}
                        />
                    )}
                    <CardContent>
                        <Typography variant="h4" component="div" sx={{ mb: 2 }}>
                            {blog.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar
                                src={blog.creatorId?.profilePic?.filename ?
                                    `${import.meta.env.VITE_SERVER_URL}/uploads/${blog.creatorId?.profilePic?.filename}` : ''}
                            />
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="body1">{blog.creatorId?.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(blog?.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="body1" paragraph>
                            {blog.description}
                        </Typography>


                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default TherapistBlogDetail;