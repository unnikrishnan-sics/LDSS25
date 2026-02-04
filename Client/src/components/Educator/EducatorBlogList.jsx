import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Avatar, IconButton, TextField } from '@mui/material';
import { Add, Edit, Delete, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { jwtDecode } from 'jwt-decode'; // Correct import

const EducatorBlogList = () => {
    const [blogs, setBlogs] = useState([]); // State for blogs *not* created by the current user
    const [myBlogs, setMyBlogs] = useState([]); // State for blogs created by the current user
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const educatorDetails = JSON.parse(localStorage.getItem('educatorDetails')) || {};

    console.log('Component rendering...'); // Log 1: Component rendering indicator
    console.log('Current myBlogs length:', myBlogs.length); // Log 2: Length of myBlogs state on render
    console.log('Current blogs length:', blogs.length); // Log 3: Length of blogs state on render

    const fetchBlogs = async () => {
        console.log('Fetching blogs from backend...'); // Log 4: Fetch start
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found. Redirecting to login.'); // Log 5: No token
                // Optionally redirect to login if token is missing
                // navigate('/login'); 
                return; // Stop fetching if no token
            }

            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Blogs fetched successfully. Total blogs:', response.data.blogs.length); // Log 6: Fetch success

            const decoded = jwtDecode(token);
            const userId = decoded.id; // Get user ID from token

            const fetchedBlogs = response.data.blogs;

            const myBlogsData = fetchedBlogs.filter(blog =>
                blog.creatorId && blog.creatorId._id === userId && blog.creatorType === 'educator'
            );
            console.log('Filtered myBlogs length:', myBlogsData.length); // Log 7: My blogs count

            const allOtherBlogsData = fetchedBlogs.filter(blog =>
                !(blog.creatorId && blog.creatorId._id === userId && blog.creatorType === 'educator')
                // Alternatively, simply filter out my blogs if the initial filter is guaranteed to work:
                // blog.creatorId && blog.creatorId._id !== userId 
            );
            console.log('Filtered allOtherBlogs length:', allOtherBlogsData.length); // Log 8: Other blogs count


            setMyBlogs(myBlogsData);
            setBlogs(allOtherBlogsData); // Setting state will trigger re-render

        } catch (error) {
            console.error('Error fetching blogs:', error); // Log 9: Fetch error
            // Check error response for more details
            if (error.response) {
                console.error('Fetch error response data:', error.response.data);
                console.error('Fetch error response status:', error.response.status);
            }
        }
    };

    useEffect(() => {
        fetchBlogs();
        // Depend on navigate if you redirect in fetchBlogs, otherwise empty array is fine
    }, []);

    const handleLike = async (blogId) => {
        console.log(`Attempting to like blog: ${blogId}`); // Log L1: Like attempt
        try {
            const token = localStorage.getItem('token');
            if (!token) { console.error('No token for like.'); return; }
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/like/${blogId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`Blog liked: ${blogId}. Refetching...`); // Log L2: Like success
            // Refetch all blogs to update like counts and statuses across both lists
            fetchBlogs();
        } catch (error) {
            console.error(`Error liking blog ${blogId}:`, error); // Log L3: Like error
            if (error.response) {
                console.error('Like error response data:', error.response.data);
                console.error('Like error response status:', error.response.status);
            }
        }
    };

    const handleUnlike = async (blogId) => {
        console.log(`Attempting to unlike blog: ${blogId}`); // Log U1: Unlike attempt
        try {
            const token = localStorage.getItem('token');
            if (!token) { console.error('No token for unlike.'); return; }
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/unlike/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`Blog unliked: ${blogId}. Refetching...`); // Log U2: Unlike success
            // Refetch all blogs to update like counts and statuses
            fetchBlogs();
        } catch (error) {
            console.error(`Error unliking blog ${blogId}:`, error); // Log U3: Unlike error
            if (error.response) {
                console.error('Unlike error response data:', error.response.data);
                console.error('Unlike error response status:', error.response.status);
            }
        }
    };

    const deleteBlog = async (blogId) => {
        console.log(`Delete called for blog ID: ${blogId}`); // Log D1: Delete called
        if (!window.confirm('Are you sure you want to delete this blog?')) {
            console.log('Delete cancelled by user.'); // Log D2: Delete cancelled
            return;
        }

        console.log(`Confirmed delete for blog ID: ${blogId}`); // Log D3: Delete confirmed
        setIsDeleting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) { console.error('No token for delete.'); setIsDeleting(false); return; }

            console.log(`Sending DELETE request for blog ID: ${blogId}`); // Log D4: Sending delete request
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/delete/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Backend DELETE response status:', response.status); // Log D5: Backend response status
            // Optional: console.log('Backend DELETE response data:', response.data); // Log D6 if needed

            // --- Direct State Update After Successful Deletion ---

            // Log the state *before* filtering
            console.log('State BEFORE filtering - myBlogs IDs:', myBlogs.map(b => b._id)); // Log D7
            console.log('State BEFORE filtering - blogs IDs:', blogs.map(b => b._id)); // Log D8

            // Filter the state: Keep blogs whose ID does *not* match the deleted blogId
            setMyBlogs(prevMyBlogs => {
                const newState = prevMyBlogs.filter(blog => blog._id !== blogId);
                console.log('State AFTER filtering - new myBlogs length:', newState.length); // Log D9
                console.log('State AFTER filtering - new myBlogs IDs:', newState.map(b => b._id)); // Log D10
                return newState;
            });

            setBlogs(prevBlogs => {
                const newState = prevBlogs.filter(blog => blog._id !== blogId);
                console.log('State AFTER filtering - new blogs length:', newState.length); // Log D11
                console.log('State AFTER filtering - new blogs IDs:', newState.map(b => b._id)); // Log D12
                return newState;
            });

            console.log(`State update called. Blog ${blogId} should be removed from view on next render.`); // Log D13

            // Note: We are NOT calling fetchBlogs() here. The state updates above
            // are sufficient for immediate UI change.

        } catch (error) {
            console.error(`Error deleting blog ${blogId}:`, error); // Log D14: Delete error
            // Check error.response for server-side error details
            if (error.response) {
                console.error('Delete error response data:', error.response.data);
                console.error('Delete error response status:', error.response.status);
            }
            alert('Failed to delete blog. Please check console for details.');
        } finally {
            console.log('Delete process finished for blog ID:', blogId); // Log D15
            setIsDeleting(false);
        }
    };

    // Note: Search filtering is applied only to the 'blogs' list (not 'myBlogs')
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Add creator name to search?
        (blog.creatorId?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtered blogs length for display:', filteredBlogs.length); // Log 14: Filtered length

    return (
        <>
            <EducatorNavbar
                educatorDetails={educatorDetails}
                navigateToProfile={() => navigate('/educator/profile')}
            />            <Box sx={{ p: 3 }}>
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
                        onClick={() => navigate('/educator/blog/add')}
                    >
                        Add New Blog
                    </Button>
                </Box>

                <Typography variant="h5" sx={{ mb: 2 }}>My Blogs ({myBlogs.length})</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                    {/* Check if myBlogs is empty */}
                    {myBlogs.length === 0 ? (
                        <Typography variant="body1" sx={{ gridColumn: 'span / total columns if needed, e.g., span 4', textAlign: 'center' }}>
                            You haven't created any blogs yet. Click "Add New Blog" to get started!
                        </Typography>
                    ) : (
                        myBlogs.map(blog => (
                            <Card key={blog._id} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                {blog.image && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={`${import.meta.env.VITE_SERVER_URL}/uploads/blogs/${blog.image.filename}`}
                                        alt={blog.title}
                                    />
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
                                        <IconButton onClick={() => navigate(`/educator/blog/edit/${blog._id}`)} aria-label="edit">
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
                                        {blog.likes.some(like => {
                                             const token = localStorage.getItem('token');
                                             if (!token) return false;
                                             const decoded = jwtDecode(token);
                                             return like._id === decoded.id;
                                        }) ? (
                                            <IconButton onClick={() => handleUnlike(blog._id)} aria-label="unlike">
                                                <Favorite color="error" />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => handleLike(blog._id)} aria-label="like">
                                                <FavoriteBorder />
                                            </IconButton>
                                        )}
                                        <Typography>{blog.likes.length}</Typography>
                                    </Box> */}
                                </Box>
                            </Card>
                        ))
                    )}
                </Box>

                {/* Search Input Field */}
                {/* Moved search field up near the title and Add button */}
                {/* <TextField
                     label="Search Blogs"
                     variant="outlined"
                     fullWidth
                     sx={{ mb: 3 }}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                 /> */}

                <Typography variant="h5" sx={{ mb: 2 }}>All Other Blogs ({filteredBlogs.length})</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                    {/* Check if filteredBlogs is empty */}
                    {filteredBlogs.length === 0 ? (
                        <Typography variant="body1" sx={{ gridColumn: 'span / total columns if needed, e.g., span 4', textAlign: 'center' }}>
                            {searchTerm ? `No blogs found matching "${searchTerm}".` : "No other blogs available at this time."}
                        </Typography>
                    ) : (
                        filteredBlogs.map(blog => (
                            // Use a Box or Fragment around the Card to apply the click handler safely
                            <Box key={blog._id} onClick={() => navigate(`/educator/blog/detail/${blog._id}`)} sx={{ cursor: 'pointer' }}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}> {/* Added height 100% for grid alignment */}
                                    {blog.image && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={`${import.meta.env.VITE_SERVER_URL}/uploads/blogs/${blog.image.filename}`}
                                            alt={blog.title}
                                        />
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
                                        {blog.likes.some(like => {
                                            const token = localStorage.getItem('token');
                                            if (!token) return false;
                                            const decoded = jwtDecode(token);
                                            return like._id === decoded.id;
                                        }) ? (
                                            <IconButton 
                                                onClick={(e) => { e.stopPropagation(); handleUnlike(blog._id); }} 
                                                aria-label="unlike"
                                            >
                                                <Favorite color="error" />
                                            </IconButton>
                                        ) : (
                                            <IconButton 
                                                onClick={(e) => { e.stopPropagation(); handleLike(blog._id); }} 
                                                aria-label="like"
                                            >
                                                <FavoriteBorder />
                                            </IconButton>
                                        )}
                                        <Typography>{blog.likes.length}</Typography>
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

export default EducatorBlogList;