import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, InputAdornment, TextField, Typography, styled, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AdminSideBar from './Common/AdminSideBar';
import AdminLogout from './Common/AdminLogout';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '30px',
        border: "1px solid black"
    },
});

const AdminViewActivityLibrary = () => {
    const [openLogout, setOpenLogout] = useState(false);
    const handleOpenLogout = () => setOpenLogout(true);
    const handleCloseLogout = () => setOpenLogout(false);
    const navigate = useNavigate();

    const [activityCards, setActivityCards] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllActivities = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/activity/getallactivities`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setActivityCards(response.data.activities);
            setFilteredActivities(response.data.activities);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/activity/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Activity deleted successfully");
            setActivityCards(prev => prev.filter(card => card._id !== id));
            setFilteredActivities(prev => prev.filter(card => card._id !== id));
        } catch (error) {
            console.error("Error deleting activity:", error);
            toast.error("Failed to delete activity");
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (!term) {
            setFilteredActivities(activityCards);
            return;
        }

        const filtered = activityCards.filter(activity => {
            const searchLower = term.toLowerCase();
            return (
                (activity.title && activity.title.toLowerCase().includes(searchLower)) ||
                (activity.activityName && activity.activityName.toLowerCase().includes(searchLower)) ||
                (activity.description && activity.description.toLowerCase().includes(searchLower)) ||
                (activity.category && activity.category.toLowerCase().includes(searchLower))
            );
        });
        setFilteredActivities(filtered);
    };

    useEffect(() => {
        fetchAllActivities();
    }, []);

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#F6F7F9', minHeight: '100vh' }}>
            <Box sx={{ width: '250px', backgroundColor: 'white', margin: '15px', borderRadius: '8px' }}>
                <AdminSideBar />
            </Box>

            <Box sx={{ flexGrow: 1, pt: 2 }}>
                <Box sx={{ height: "70px", background: "white", borderRadius: "8px", mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500" }} color='primary'>Activity Library</Typography>
                    <Button onClick={handleOpenLogout} variant="text" color='primary' sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>Logout</Button>
                </Box>

                <Box sx={{ background: "white", borderRadius: "8px", p: 3 }}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={3}>
                        <Typography variant='h4' color='primary' sx={{ fontSize: '18px', fontWeight: "500" }}>All Activities</Typography>
                        <Box display={'flex'} alignItems={'center'} gap={2}>
                            <StyledTextField
                                placeholder='Search here...'
                                variant="outlined"
                                sx={{ width: '250px', '& .MuiOutlinedInput-root': { height: '40px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={() => navigate('/admin/addactivity')}
                                startIcon={<AddIcon />}
                                sx={{ borderRadius: "25px", height: "45px", width: '160px', padding: '20px 3px', textTransform: "none", fontWeight: "500", fontSize: "13px" }}
                            >
                                Add Activity
                            </Button>
                        </Box>
                    </Box>

                    <Box>
                        <Grid container spacing={3}>
                            {filteredActivities.length === 0 ? (
                                <Grid item xs={12}>
                                    <Typography sx={{ width: '100%', textAlign: 'center', py: 4 }}>No activities found.</Typography>
                                </Grid>
                            ) : (
                                filteredActivities.map((card) => (
                                    <Grid item xs={12} sm={6} md={4} key={card._id}>
                                        <Card sx={{ maxWidth: 345, bgcolor: 'transparent', boxShadow: 'none', p: 2, '&:hover': { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' } }}>
                                            <Box sx={{ width: '200px', height: '200px', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                                {card.activityPhoto && /\.(jpg|jpeg|png|webp)$/i.test(card.activityPhoto) ? (
                                                    <CardMedia
                                                        component="img"
                                                        image={`${import.meta.env.VITE_SERVER_URL}/uploads/${card.activityPhoto}`}
                                                        alt={card.activityName}
                                                        sx={{ width: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: '12px', backgroundColor: '#f5f5f5', fontSize: '14px', textAlign: 'center', p: 2 }}>
                                                        No preview available
                                                    </Box>
                                                )}
                                            </Box>

                                            <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 500, color: "#384371" }}>{card.title}</Typography>
                                                <Typography variant="h6" sx={{ fontSize: "14px", color: "#384371" }}>{card.activityName}</Typography>
                                                <Typography variant="subtitle" sx={{ fontSize: "14px", color: "#384371" }}>{card.description}</Typography>
                                                <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 500, display: 'block' }}>Activity Category</Typography>
                                                <Typography variant="h6" sx={{ color: "#384371", mb: 1, fontSize: "13px" }}>{card.category}</Typography>
                                            </CardContent>

                                            <CardActions sx={{ p: 0, display: 'flex', gap: 2, mt: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => handleDelete(card._id)}
                                                    sx={{ borderRadius: '25px', textTransform: 'none', flex: 1, py: 1 }}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => navigate(`/admin/editactivity/${card._id}`)}
                                                    sx={{ borderRadius: '25px', textTransform: 'none', flex: 1, py: 1 }}
                                                >
                                                    Edit
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Box>

            <AdminLogout handleCloseLogout={handleCloseLogout} openLogout={openLogout} />
        </Box>
    );
};

export default AdminViewActivityLibrary;