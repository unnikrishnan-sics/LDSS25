import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Avatar, Button, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminSideBar from './Common/AdminSideBar';

const AdminBlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <Typography variant="h5">Blog not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <AdminSideBar />
            <Box sx={{ flexGrow: 1, p: 3, maxWidth: 800 }}>
                <Button
                    variant="outlined"
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
                                <Typography variant="body1">{blog.creatorId.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="body1" paragraph>
                            {blog.description}
                        </Typography>

                        {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            {blog.likes.length} likes
                        </Typography> */}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default AdminBlogDetail;