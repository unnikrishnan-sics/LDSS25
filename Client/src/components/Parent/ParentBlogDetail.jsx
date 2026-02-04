import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Avatar, IconButton, Button, CircularProgress } from '@mui/material';
import { Favorite, FavoriteBorder, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ParentNavbar from '../Navbar/ParentNavbar';

const ParentBlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const parentDetails = JSON.parse(localStorage.getItem('parentDetails')) || {};
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem('token');
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

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (blog.likes.some(like => like._id === jwtDecode(token).id)) {
                await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/unlike/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/like/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            // Refresh blog data
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlog(response.data.blog);
        } catch (error) {
            console.error('Error updating like:', error);
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
                <ParentNavbar
                    parentdetails={parentDetails}
                    navigateToProfile={() => navigate('/parent/profile')}
                />
                <Typography variant="h5">Blog not found</Typography>
            </Box>
        );
    }

    return (
        <>
            <ParentNavbar
                parentdetails={parentDetails}
                navigateToProfile={() => navigate('/parent/profile')}
            />            <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
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
                                src={blog.creatorId.profilePic?.filename ?
                                    `${import.meta.env.VITE_SERVER_URL}/uploads/${blog.creatorId.profilePic?.filename}` : ''}
                            />
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="body1">{blog.creatorId?.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(blog.createdAt).toLocaleDateString()}
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

export default ParentBlogDetail;