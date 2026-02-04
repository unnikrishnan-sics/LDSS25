
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Avatar, IconButton, TextField } from '@mui/material';
import { Add, Edit, Delete, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TheraphistNavbar from '../Navbar/TheraphistNavbar';
import { jwtDecode } from 'jwt-decode'; // Correct import

const TherapistBlogList = () => {
    const [blogs, setBlogs] = useState([]); // State for blogs *not* created by the current user
    const [myBlogs, setMyBlogs] = useState([]); // State for blogs created by the current user
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLiking, setIsLiking] = useState(null); // Track which blog is currently being liked/unliked to disable button
    const navigate = useNavigate();
    const therapistDetails = JSON.parse(localStorage.getItem('theraphistDetails')) || {}; // Assuming therapist details are stored here

    // console.log('Component rendering...'); // Debug log
    // console.log('Current myBlogs length:', myBlogs.length); // Debug log
    // console.log('Current blogs length:', blogs.length); // Debug log

    const fetchBlogs = async () => {
        // console.log('Fetching blogs from backend...'); // Debug log
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found. Redirecting to login.');
                // Optionally redirect to login
                // navigate('/therapist/login');
                return; // Stop fetching
            }

            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // console.log('Blogs fetched successfully. Total blogs:', response.data.blogs.length); // Debug log

            let userId = null;
            try {
                const decoded = jwtDecode(token);
                userId = decoded.id; // Get user ID from token (usually a string)
            } catch (e) {
                console.error("Failed to decode token during fetch:", e);
                // Handle error, maybe clear token or redirect
                return;
            }


            const fetchedBlogs = response.data.blogs;

            // Process blogs to ensure likes array contains usable IDs
            const processedBlogs = fetchedBlogs.map(blog => ({
                ...blog,
                // Normalize likes array to always contain objects with _id
                // This helps the isBlogLikedByUser function
                likes: blog.likes.map(like => typeof like === 'string' ? { _id: like } : like)
            }));
            // console.log('Processed blogs:', processedBlogs); // Debug log

            const myBlogsData = processedBlogs.filter(blog =>
                blog.creatorId && String(blog.creatorId._id) === String(userId) && blog.creatorType === 'theraphist'
            );
            // console.log('Filtered myBlogs length:', myBlogsData.length); // Debug log

            const allOtherBlogsData = processedBlogs.filter(blog =>
                // Check if the blog has a creatorId and it's NOT the current user
                blog.creatorId && String(blog.creatorId._id) !== String(userId)
                // Or if it is the current user but the creatorType is different (less common scenario)
                // || (blog.creatorId && String(blog.creatorId._id) === String(userId) && blog.creatorType !== 'theraphist')
            );
            // console.log('Filtered allOtherBlogs length:', allOtherBlogsData.length); // Debug log

            setMyBlogs(myBlogsData);
            setBlogs(allOtherBlogsData); // Setting state will trigger re-render

        } catch (error) {
            console.error('Error fetching blogs:', error);
            if (error.response) {
                console.error('Fetch error response data:', error.response.data);
                console.error('Fetch error response status:', error.response.status);
            }
        }
    };

    useEffect(() => {
        fetchBlogs();
        // Add navigate as a dependency if you uncomment the redirect line in fetchBlogs
    }, []); // Empty dependency array means this effect runs once on mount

    // Helper function to check if the current user has liked a specific blog
    const isBlogLikedByUser = (blog) => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        let userId = null;
        try {
            const decoded = jwtDecode(token);
            userId = decoded.id; // Get user ID string from token
        } catch (e) {
            console.error("Failed to decode token in isBlogLikedByUser:", e);
            return false; // Cannot get user ID
        }

        if (!userId) return false; // No user ID obtained

        // Check if the likes array contains the current user's ID
        // The likes array can contain either populated user objects or just IDs
        return blog.likes.some(like => {
            let likeId = null;
            // Safely extract the ID from the 'like' entry
            if (typeof like === 'string') {
                likeId = like;
            } else if (like && typeof like === 'object' && like._id) {
                likeId = like._id;
            }

            // Compare IDs after ensuring both are strings
            // Use String() to handle potential ObjectId objects or strings consistently
            return likeId !== null && String(likeId) === String(userId);
        });
    };


    const handleLike = async (blogId) => {
        // console.log(`Attempting to like blog: ${blogId}`); // Debug log
        setIsLiking(blogId); // Disable button for this blog
        try {
            const token = localStorage.getItem('token');
            if (!token) { console.error('No token for like.'); return; }
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/like/${blogId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(`Blog liked: ${blogId}. Refetching...`); // Debug log
            // Refetch all blogs to update like counts and statuses across both lists
            await fetchBlogs(); // Use await to ensure state is updated before potentially enabling button
        } catch (error) {
            console.error(`Error liking blog ${blogId}:`, error);
            if (error.response) {
                console.error('Like error response data:', error.response.data);
                console.error('Like error response status:', error.response.status);
            }
        } finally {
            setIsLiking(null); // Enable button
        }
    };

    const handleUnlike = async (blogId) => {
        // console.log(`Attempting to unlike blog: ${blogId}`); // Debug log
        setIsLiking(blogId); // Disable button for this blog
        try {
            const token = localStorage.getItem('token');
            if (!token) { console.error('No token for unlike.'); return; }
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/unlike/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(`Blog unliked: ${blogId}. Refetching...`); // Debug log
            // Refetch all blogs to update like counts and statuses
            await fetchBlogs(); // Use await to ensure state is updated
        } catch (error) {
            console.error(`Error unliking blog ${blogId}:`, error);
            if (error.response) {
                console.error('Unlike error response data:', error.response.data);
                console.error('Unlike error response status:', error.response.status);
            }
        } finally {
            setIsLiking(null); // Enable button
        }
    };

    const deleteBlog = async (blogId) => {
        // console.log(`Delete called for blog ID: ${blogId}`); // Debug log
        if (!window.confirm('Are you sure you want to delete this blog?')) {
            // console.log('Delete cancelled by user.'); // Debug log
            return;
        }

        // console.log(`Confirmed delete for blog ID: ${blogId}`); // Debug log
        setIsDeleting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) { console.error('No token for delete.'); setIsDeleting(false); return; }

            // console.log(`Sending DELETE request for blog ID: ${blogId}`); // Debug log
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/delete/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // console.log('Backend DELETE response status:', response.status); // Debug log
            // Optional: console.log('Backend DELETE response data:', response.data); // Debug log

            // --- Direct State Update After Successful Deletion ---
            // Log the state *before* filtering
            // console.log('State BEFORE filtering - myBlogs IDs:', myBlogs.map(b => b._id)); // Debug log
            // console.log('State BEFORE filtering - blogs IDs:', blogs.map(b => b._id)); // Debug log

            // Filter the state: Keep blogs whose ID does *not* match the deleted blogId
            // Use functional update form of setState to ensure you have the latest state
            setMyBlogs(prevMyBlogs => {
                const newState = prevMyBlogs.filter(blog => blog._id !== blogId);
                // console.log('State AFTER filtering - new myBlogs length:', newState.length); // Debug log
                // console.log('State AFTER filtering - new myBlogs IDs:', newState.map(b => b._id)); // Debug log
                return newState;
            });

            setBlogs(prevBlogs => {
                const newState = prevBlogs.filter(blog => blog._id !== blogId);
                // console.log('State AFTER filtering - new blogs length:', newState.length); // Debug log
                // console.log('State AFTER filtering - new blogs IDs:', newState.map(b => b._id)); // Debug log
                return newState;
            });

            // console.log(`State update called. Blog ${blogId} should be removed from view on next render.`); // Debug log

            // Note: We are NOT calling fetchBlogs() here. The state updates above
            // are sufficient for immediate UI change.

        } catch (error) {
            console.error(`Error deleting blog ${blogId}:`, error);
            if (error.response) {
                console.error('Delete error response data:', error.response.data);
                console.error('Delete error response status:', error.response.status);
            }
            alert('Failed to delete blog. Please check console for details.');
        } finally {
            // console.log('Delete process finished for blog ID:', blogId); // Debug log
            setIsDeleting(false);
        }
    };

    // Note: Search filtering is applied only to the 'blogs' list (not 'myBlogs')
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Add creator name to search? Safely access creatorId and name
        (blog.creatorId?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    // console.log('Filtered blogs length for display:', filteredBlogs.length); // Debug log

    return (
        <>
            <TheraphistNavbar
                theraphistdetails={therapistDetails}
                navigateToProfile={() => navigate('/therapist/profile')}
            />
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                    <Typography variant="h4">Blogs</Typography>
                    {/* Optional: Add Search Field Here */}
                    <TextField
                        label="Search Blogs"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/therapist/blog/add')}
                    >
                        Add New Blog
                    </Button>
                </Box>

                <Typography variant="h5" sx={{ mb: 2 }}>My Blogs ({myBlogs.length})</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                    {/* Check if myBlogs is empty */}
                    {myBlogs.length === 0 ? (
                        <Typography variant="body1" sx={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                            You haven't created any blogs yet. Click "Add New Blog" to get started!
                        </Typography>
                    ) : (
                        myBlogs.map(blog => (
                            <Card key={blog._id} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                {blog.image && blog.image.filename ? (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={`${import.meta.env.VITE_SERVER_URL}/uploads/blogs/${blog.image.filename}`}
                                        alt={blog.title}
                                    />
                                ) : (
                                    // Placeholder or nothing if no image
                                    <Box sx={{ height: 140, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">No Image</Typography>
                                    </Box>
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {blog.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {blog.description.length > 150 ? // Increased description length limit slightly for card view
                                            `${blog.description.substring(0, 150)}...` :
                                            blog.description
                                        }
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar
                                            src={blog.creatorId?.profilePic?.filename ?
                                                `${import.meta.env.VITE_SERVER_URL}/uploads/${blog.creatorId.profilePic.filename}` : ''}
                                            alt={blog.creatorId?.name || 'Creator'} // Added alt text
                                        />
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            {blog.creatorId?.name || 'Unknown Creator'} {/* Added fallback name */}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                {/* Actions section */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pt: 0 }}>
                                    <Box>
                                        {/* Edit Button */}
                                        <IconButton onClick={() => navigate(`/therapist/blog/edit/${blog._id}`)} aria-label="edit">
                                            <Edit color="primary" />
                                        </IconButton>
                                        {/* Delete Button */}
                                        <IconButton
                                            onClick={() => deleteBlog(blog._id)}
                                            disabled={isDeleting} // Disable while deletion is in progress
                                            aria-label="delete"
                                        >
                                            <Delete color="error" />
                                        </IconButton>
                                    </Box>
                                    {/* Like/Unlike Button and Count */}
                                    {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {isBlogLikedByUser(blog) ? (
                                            <IconButton
                                                onClick={() => handleUnlike(blog._id)}
                                                disabled={isLiking === blog._id} // Disable while processing like/unlike for THIS blog
                                                aria-label="unlike"
                                            >
                                                <Favorite color="error" />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                onClick={() => handleLike(blog._id)}
                                                disabled={isLiking === blog._id} // Disable while processing like/unlike for THIS blog
                                                aria-label="like"
                                            >
                                                <FavoriteBorder />
                                            </IconButton>
                                        )}
                                        <Typography>{blog.likes ? blog.likes.length : 0}</Typography>
                                    </Box> */}
                                </Box>
                            </Card>
                        ))
                    )}
                </Box>

                <Typography variant="h5" sx={{ mb: 2 }}>All Other Blogs ({filteredBlogs.length})</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                    {/* Check if filteredBlogs is empty */}
                    {filteredBlogs.length === 0 ? (
                        <Typography variant="body1" sx={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                            {searchTerm ? `No blogs found matching "${searchTerm}".` : "No other blogs available at this time."}
                        </Typography>
                    ) : (
                        filteredBlogs.map(blog => (
                            // Use a Box or Fragment around the Card to apply the click handler safely
                            <Box key={blog._id} onClick={() => navigate(`/therapist/blog/detail/${blog._id}`)} sx={{ cursor: 'pointer' }}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}> {/* Added height 100% for grid alignment */}
                                    {blog.image && blog.image.filename ? (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={`${import.meta.env.VITE_SERVER_URL}/uploads/blogs/${blog.image.filename}`}
                                            alt={blog.title}
                                        />
                                    ) : (
                                        // Placeholder or nothing if no image
                                        <Box sx={{ height: 140, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="caption" color="text.secondary">No Image</Typography>
                                        </Box>
                                    )}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {blog.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {blog.description.length > 150 ?
                                                `${blog.description.substring(0, 150)}...` :
                                                blog.description
                                            }
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar
                                                src={blog.creatorId?.profilePic?.filename ?
                                                    `${import.meta.env.VITE_SERVER_URL}/uploads/${blog.creatorId.profilePic.filename}` : ''}
                                                alt={blog.creatorId?.name || 'Creator'} // Added alt text
                                            />
                                            <Typography variant="body2" sx={{ ml: 1 }}>
                                                {blog.creatorId?.name || 'Unknown Creator'} {/* Added fallback name */}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    {/* Actions section - Only Like/Unlike for other users' blogs */}
                                    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2, pt: 0 }}>
                                        {isBlogLikedByUser(blog) ? (
                                            <IconButton
                                                // Stop propagation to prevent the parent Box's navigate from firing
                                                onClick={(e) => { e.stopPropagation(); handleUnlike(blog._id); }}
                                                disabled={isLiking === blog._id} // Disable while processing like/unlike for THIS blog
                                                aria-label="unlike"
                                            >
                                                <Favorite color="error" />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                // Stop propagation
                                                onClick={(e) => { e.stopPropagation(); handleLike(blog._id); }}
                                                disabled={isLiking === blog._id} // Disable while processing like/unlike for THIS blog
                                                aria-label="like"
                                            >
                                                <FavoriteBorder />
                                            </IconButton>
                                        )}
                                        <Typography>{blog.likes ? blog.likes.length : 0}</Typography>
                                    </Box> */}
                                </Card>
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </>
    );
};

export default TherapistBlogList;
