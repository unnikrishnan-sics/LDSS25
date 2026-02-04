import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, InputAdornment, TextField, Typography, styled, Avatar, Tooltip } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminViewSingleTherapist from './Common/AdminViewSingleTherapist';
import AdminSideBar from './Common/AdminSideBar';
import AdminLogout from './Common/AdminLogout';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '30px',
        border: "1px solid black"
    },
});

const AdminViewTheraphist = () => {
    const [openLogout, setOpenLogout] = useState(false);
    const handleOpenLogout = () => setOpenLogout(true);
    const handleCloseLogout = () => setOpenLogout(false);
    const [activeTab, setActiveTab] = useState('request');
    const [searchQuery, setSearchQuery] = useState('');
    const [theraphist, setTheraphist] = useState([]);
    const [theraphistDetails, setTheraphistDetails] = useState([]);
    const [filteredTherapists, setFilteredTherapists] = useState([]);

    const fetchAllTheraphist = async () => {
        try {
            const token = localStorage.getItem("token");
            const allTheraphist = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/getalltheraphist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const theraphistData = allTheraphist.data.theraphist;
            setTheraphist(theraphistData);
            const unapproved = theraphistData.filter(e => e.isAdminApproved === false);
            setTheraphistDetails(unapproved);
            setFilteredTherapists(unapproved);
        } catch (error) {
            console.error("Failed to fetch therapists:", error);
        }
    };

    useEffect(() => {
        fetchAllTheraphist();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery === '') {
                setFilteredTherapists(theraphistDetails);
            } else {
                const filtered = theraphistDetails.filter(therapist =>
                    (therapist.name && therapist.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (therapist.email && therapist.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (therapist.phone && String(therapist.phone).includes(searchQuery.toLowerCase()))
                );
                setFilteredTherapists(filtered);
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, theraphistDetails]);

    const approvedTheraphist = () => {
        const approved = theraphist.filter(e => e.isAdminApproved === true);
        setTheraphistDetails(approved);
        setFilteredTherapists(approved);
    };

    const [theraphistdetail, setTheraphistdetail] = useState({});
    const [openTheraphist, setOpenTheraphist] = useState(false);
    const handleTheraphistOpen = () => setOpenTheraphist(true);
    const handleTheraphistClose = () => setOpenTheraphist(false);

    const fetchTheraphistDetail = async (theraphistId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${theraphistId}`, {
                headers: { Authorization: `bearer ${token}` }
            });
            setTheraphistdetail(response.data.theraphist);
            handleTheraphistOpen();
        } catch (error) {
            console.error("Error fetching therapist details:", error);
        }
    };

    const approve = async (theraphistId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/admin/theraphist/accept/${theraphistId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllTheraphist();
            setOpenTheraphist(false);
        } catch (error) {
            console.error("Error approving therapist:", error);
        }
    };

    const rejectTheraphist = async (theraphistId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/admin/theraphist/reject/${theraphistId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllTheraphist();
            setOpenTheraphist(false);
        } catch (error) {
            console.error("Error rejecting therapist:", error);
        }
    };

    return (
        <>
            <Container maxWidth="x-lg" sx={{ background: "#F6F7F9" }}>
                <Grid container spacing={2} sx={{ height: "100vh", width: "100%" }}>
                    <Grid size={{ xs: 6, md: 2 }} sx={{ height: "100%", background: "white", margin: "15px 0px", borderRadius: "8px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} flexDirection={'column'}>
                        <AdminSideBar />
                    </Grid>
                    <Grid item xs={6} md={10} sx={{ height: "100%", display: "flex", justifyContent: "start", alignItems: "center", gap: "30px", flexDirection: "column", padding: "15px 0px", borderRadius: "8px", flexGrow: 1 }}>
                        <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "100%" }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500", ml: '20px' }} color='primary'>Therapist</Typography>
                            <Button onClick={handleOpenLogout} variant="text" color='primary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                        </Box>
                        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                            <Box sx={{ backgroundColor: '#F6F7F9', borderRadius: '30px', padding: '5px', display: 'inline-flex', boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.05)' }}>
                                <Button
                                    onClick={() => {
                                        fetchAllTheraphist();
                                        setActiveTab('request');
                                        setSearchQuery('');
                                    }}
                                    sx={{ padding: '8px 20px', backgroundColor: activeTab === 'request' ? '#1967D2' : 'transparent', color: activeTab === 'request' ? '#fff' : '#000', borderRadius: '25px', textTransform: 'none', fontWeight: 500, fontSize: '14px', minWidth: '120px', transition: 'all 0.3s ease', '&:hover': { backgroundColor: activeTab === 'request' ? '#1152b4' : 'rgba(0,0,0,0.04)' } }}
                                >
                                    Request
                                </Button>
                                <Button
                                    onClick={() => {
                                        approvedTheraphist();
                                        setActiveTab('therapist');
                                        setSearchQuery('');
                                    }}
                                    sx={{ padding: '8px 20px', backgroundColor: activeTab === 'therapist' ? '#1967D2' : 'transparent', color: activeTab === 'therapist' ? '#fff' : '#000', borderRadius: '25px', textTransform: 'none', fontWeight: 500, fontSize: '14px', minWidth: '120px', transition: 'all 0.3s ease', '&:hover': { backgroundColor: activeTab === 'therapist' ? '#1152b4' : 'rgba(0,0,0,0.04)' } }}
                                >
                                    Therapist
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ height: "562px", width: "100%", padding: "20px 10px" }}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography variant='h4' color='primary' sx={{ fontSize: '18px', fontWeight: "600" }}> {activeTab === 'request' ? 'Requests' : 'Approved Therapists'}</Typography>
                                <StyledTextField
                                    placeholder='Search by name, email, or phone...'
                                    variant="outlined"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>),
                                    }}
                                />
                            </Box>
                            <Box sx={{ height: "320px", overflowY: 'auto' }}>
                                <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
                                    <Table sx={{ minWidth: 650, border: "none" }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ color: "#1967D2" }}>S.NO</TableCell>
                                                <TableCell align="left" sx={{ color: "#1967D2" }}>Profile</TableCell>
                                                <TableCell align="left" sx={{ color: "#1967D2" }}>Name</TableCell>
                                                <TableCell align="left" sx={{ color: "#1967D2" }}>Phone Number</TableCell>
                                                <TableCell align="left" sx={{ color: "#1967D2" }}>Email Id</TableCell>
                                                <TableCell align="left" sx={{ color: "#1967D2" }} >Address</TableCell>
                                                <TableCell align="left" sx={{ color: "#1967D2" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredTherapists.length > 0 ? (
                                                filteredTherapists.map((therapist, index) => (
                                                    <TableRow key={therapist._id || index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& td, & th': { border: 'none' } }}>
                                                        <TableCell component="th" scope="row">{index + 1}</TableCell>
                                                        <TableCell align="left">{therapist.profilePic?.filename ? (<Avatar src={`${import.meta.env.VITE_SERVER_URL}/uploads/${therapist?.profilePic?.filename}`} />) : (<Avatar>{therapist?.name?.charAt(0).toUpperCase()}</Avatar>)}</TableCell>
                                                        <TableCell align="left">{therapist.name}</TableCell>
                                                        <TableCell align="left">{therapist.phone}</TableCell>
                                                        <TableCell align="left">{therapist.email}</TableCell>
                                                        <TableCell align="left">{therapist.address}</TableCell>
                                                        <TableCell align="left"><Tooltip title="View Details"><VisibilityIcon sx={{ cursor: 'pointer' }} color='secondary' onClick={() => fetchTheraphistDetail(therapist._id)} /></Tooltip></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center">
                                                        No therapists found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Modal
                    open={openTheraphist}
                    onClose={handleTheraphistClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{ backdrop: { timeout: 500 } }}
                >
                    <Fade in={openTheraphist}>
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "900px", bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, height: "600px", borderRadius: '8px' }}>
                            <AdminViewSingleTherapist theraphistdetail={theraphistdetail} handleTheraphistClose={handleTheraphistClose} approve={approve} rejectTheraphist={rejectTheraphist} />
                        </Box>
                    </Fade>
                </Modal>
                <AdminLogout handleCloseLogout={handleCloseLogout} openLogout={openLogout} />
            </Container>
        </>
    );
};

export default AdminViewTheraphist;