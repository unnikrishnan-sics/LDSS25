import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Avatar, IconButton, TextField } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParentNavbar from '../Navbar/ParentNavbar';
import { jwtDecode } from 'jwt-decode';

const ParentBlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUserId(decoded.id);
        }

        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Fetched blogs:', response.data.blogs);
                setBlogs(response.data.blogs);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        fetchBlogs();
    }, []);

    const handleLike = async (blogId) => {
        // console.log(`Attempting to like blog: ${blogId}`); // Log L1: Like attempt
        try {
            const token = localStorage.getItem('token');
            if (!token) { console.error('No token for like.'); return; }
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/like/${blogId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(`Blog liked: ${blogId}. Refetching...`); // Log L2: Like success
            // Refetch all blogs to update like counts and statuses across both lists
            fetchBlogs();
        } catch (error) {
            console.error(`Error liking blog ${blogId}:`, error); // Log L3: Like error
            if (error.response) {
                console.error('Like error response data:', error.response.data);
                console.error('Like error response status:', error.response.status);
            }
            // Optionally show an error message
        }
    };

    const handleUnlike = async (blogId) => {
        // console.log(`Attempting to unlike blog: ${blogId}`); // Log U1: Unlike attempt
        try {
            const token = localStorage.getItem('token');
            if (!token) { console.error('No token for unlike.'); return; }
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/unlike/${blogId}`, { // Use DELETE for unlike API
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(`Blog unliked: ${blogId}. Refetching...`); // Log U2: Unlike success
            // Refetch all blogs to update like counts and statuses
            fetchBlogs();
        } catch (error) {
            console.error(`Error unliking blog ${blogId}:`, error); // Log U3: Unlike error
            if (error.response) {
                console.error('Unlike error response data:', error.response.data);
                console.error('Unlike error response status:', error.response.status);
            }
            // Optionally show an error message
        }
    };
    const parentdetails = JSON.parse(localStorage.getItem('parentDetails')) || {};
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <ParentNavbar
                parentdetails={parentdetails}
                navigateToProfile={() => navigate('/parent/profile')}
            />            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>Blogs</Typography>

                <TextField
                    fullWidth
                    placeholder="Search blogs..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                    {filteredBlogs.map(blog => (
                        <Card
                            key={blog._id}
                            onClick={() => navigate(`/parent/blog/${blog._id}`)}
                            sx={{ cursor: 'pointer' }}
                        >
                            {blog.image && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={`${import.meta.env.VITE_SERVER_URL}/uploads/blogs/${blog.image?.filename}`}
                                    alt={blog.title}
                                />
                            )}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {blog.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {blog.description.length > 100 ?
                                        `${blog.description.substring(0, 100)}...` :
                                        blog.description
                                    }
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar
                                        src={blog.creatorId?.profilePic?.filename ?
                                            `${import.meta.env.VITE_SERVER_URL}/uploads/${blog.creatorId?.profilePic?.filename}` : ''}
                                    />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        {blog?.creatorId?.name}
                                    </Typography>
                                </Box>
                                {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <IconButton 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLike(blog._id, e);
                                        }}
                                    >
                                        {blog.likes.some(like => like._id === currentUserId) ? (
                                            <Favorite color="error" />
                                        ) : (
                                            <FavoriteBorder />
                                        )}
                                    </IconButton>
                                    <Typography sx={{ ml: 1 }}>{blog.likes.length}</Typography>
                                </Box> */}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default ParentBlogList;