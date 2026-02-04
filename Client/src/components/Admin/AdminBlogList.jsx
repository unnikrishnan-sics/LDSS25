import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Avatar, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSideBar from './Common/AdminSideBar';

const AdminBlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/blog/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlogs(response.data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.creatorId.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AdminSideBar />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>All Blogs</Typography>

                <TextField
                    fullWidth
                    placeholder="Search blogs..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBlogs.map(blog => (
                                <TableRow key={blog._id}>
                                    <TableCell>{blog.title}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={blog.creatorId?.profilePic?.filename ?
                                                    `${import.meta.env.VITE_SERVER_URL}/uploads/${blog.creatorId?.profilePic?.filename}` : ''}
                                                sx={{ width: 24, height: 24, mr: 1 }}
                                            />
                                            {blog.creatorId.name}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => navigate(`/admin/blog/${blog._id}`)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default AdminBlogList;