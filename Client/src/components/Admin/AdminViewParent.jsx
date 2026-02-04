import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, InputAdornment, TextField, Typography, Avatar, Tooltip, Modal, Fade, Backdrop, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import AdminSideBar from './Common/AdminSideBar';
import AdminViewSingleParent from './Common/AdminViewSingleParent';
import AdminLogout from './Common/AdminLogout';

const AdminViewParent = () => {
    const [openLogout, setOpenLogout] = useState(false);
    const handleOpenLogout = () => setOpenLogout(true);
    const handleCloseLogout = () => setOpenLogout(false);

    const [parentDetails, setParentDetails] = useState([]);
    const [filteredParents, setFilteredParents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllParents = async () => {
        try {
            const token = localStorage.getItem("token");
            const allparents = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getallparents`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setParentDetails(allparents.data.allparents);
            setFilteredParents(allparents.data.allparents);
        } catch (error) {
            console.error("Error fetching parents:", error);
        }
    };

    useEffect(() => {
        fetchAllParents();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm === '') {
                setFilteredParents(parentDetails);
            } else {
                const filtered = parentDetails.filter(parent =>
                    (parent.name && parent.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (parent.email && parent.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (parent.address && parent.address.toLowerCase().includes(searchTerm.toLowerCase()))
                );
                setFilteredParents(filtered);
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, parentDetails]);

    const [parentdetail, setParentdetail] = useState({});
    const [openparent, setOpenparent] = useState(false);
    const handleParentOpen = () => setOpenparent(true);
    const handleParentClose = () => setOpenparent(false);

    const fetchParentDetail = async (parentId) => {
        try {
            const token = localStorage.getItem("token");
            const parentdetail = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getparent/${parentId}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            });
            setParentdetail(parentdetail.data.parent);
            handleParentOpen();
        } catch (error) {
            console.error("Error fetching parent details:", error);
        }
    };

    return (
        <>
            <Container maxWidth="x-lg" sx={{ background: "#F6F7F9" }}>
                <Grid container spacing={2} sx={{ height: "100vh", width: "100%" }}>
                    <Grid item xs={12} md={2} sx={{ height: "100%", background: "white", margin: "15px 0px", borderRadius: "8px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} flexDirection={'column'}>
                        <AdminSideBar />
                    </Grid>
                    <Grid item xs={12} md={10} sx={{ height: "100%", display: "flex", justifyContent: "start", alignItems: "center", gap: "30px", flexDirection: "column", padding: "15px 0px", borderRadius: "8px", flexGrow: 1 }}>
                        <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "100%" }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500", ml: '20px' }} color='primary'>Parents</Typography>
                            <Button onClick={handleOpenLogout} variant="text" color='primary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                        </Box>

                        <Box sx={{ height: "562px", width: "100%", padding: "20px 10px" }}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography variant='h4' color='primary' sx={{ fontSize: '18px', fontWeight: "600" }}> Parents List</Typography>
                                <TextField
                                    placeholder='search here...'
                                    variant="outlined"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ height: "320px" }}>
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
                                                <TableCell align="left" sx={{ color: "#1967D2" }} >Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {filteredParents.length > 0 ? (
                                            <TableBody>
                                                {filteredParents.map((parent, index) => (
                                                    <TableRow
                                                        key={parent._id || index}
                                                        sx={{
                                                            '&:last-child td, &:last-child th': {
                                                                border: 0,
                                                            },
                                                            '& td, & th': {
                                                                border: 'none',
                                                            }
                                                        }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell align="left">{
                                                            parent.profilePic?.filename ? (
                                                                <Avatar src={`${import.meta.env.VITE_SERVER_URL}/uploads/${parent.profilePic?.filename}`}></Avatar>
                                                            ) : (
                                                                <Avatar>{parent.name?.charAt(0) || ''}</Avatar>
                                                            )
                                                        }</TableCell>
                                                        <TableCell align="left">{parent.name}</TableCell>
                                                        <TableCell align="left">{parent.phone}</TableCell>
                                                        <TableCell align="left">{parent.email}</TableCell>
                                                        <TableCell align="left">{parent.address}</TableCell>
                                                        <TableCell align="left">
                                                            <Tooltip title="View Details">
                                                                <VisibilityIcon
                                                                    color="primary"
                                                                    sx={{ cursor: 'pointer' }}
                                                                    onClick={() => fetchParentDetail(parent._id)}
                                                                />
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        ) : (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                        <Typography variant="body1" color="textSecondary">
                                                            No parents found matching your search criteria
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Modal
                    open={openparent}
                    onClose={handleParentClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={openparent}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: "900px",
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            height: "600px"
                        }}>
                            <AdminViewSingleParent parentdetail={parentdetail} handleParentClose={handleParentClose} />
                        </Box>
                    </Fade>
                </Modal>
                <AdminLogout handleCloseLogout={handleCloseLogout} openLogout={openLogout} />
            </Container>
        </>
    );
}

export default AdminViewParent;
