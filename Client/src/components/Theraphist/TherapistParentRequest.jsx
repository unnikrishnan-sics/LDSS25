import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, CardMedia, Fade, Modal, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import image68 from "../../assets/image 68.png";
import TherapistViewParentDetails from './Common/TherapistViewParentDetails';
import Backdrop from '@mui/material/Backdrop';
import TheraphistNavbar from '../Navbar/TheraphistNavbar';

const TherapistParentRequest = () => {
    const [therapistDetails, setTherapistDetails] = useState({});
    const [parentRequests, setParentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestDetail, setRequestDetail] = useState(null);
    const [openParent, setOpenParent] = useState(false);
    const navigate = useNavigate();

    const fetchTherapist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token found");

            const decoded = jwtDecode(token);
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${decoded.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data?.theraphist) {
                const therapistData = response.data.theraphist;
                localStorage.setItem("theraphistDetails", JSON.stringify(therapistData));
                setTherapistDetails(therapistData);
            }
        } catch (error) {
            console.error("Error fetching therapist:", error);
            const cachedData = localStorage.getItem("theraphistDetails");
            if (cachedData) {
                setTherapistDetails(JSON.parse(cachedData));
            }
        }
    };

    const fetchParentRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const therapistId = JSON.parse(localStorage.getItem("theraphistDetails"))?._id;

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/parentsrequest/${therapistId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setParentRequests(response.data?.request || []);
        } catch (error) {
            console.error("Error fetching parent requests:", error);
            setError("Failed to load parent requests. Please try again.");
            setParentRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const acceptParentRequest = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/acceptrequest/${requestId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            handleParentClose();
            fetchParentRequests();
        } catch (error) {
            console.error("Error accepting request:", error);
            setError("Failed to accept request. Please try again.");
        }
    };

    const rejectParentRequest = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/rejectrequest/${requestId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            handleParentClose();
            fetchParentRequests();
        } catch (error) {
            console.error("Error rejecting request:", error);
            setError("Failed to reject request. Please try again.");
        }
    };

    const fetchParentDetails = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/viewrequestedparent/${requestId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data?.viewRequest) {
                setRequestDetail(response.data.viewRequest);
                setOpenParent(true);
            }
        } catch (error) {
            console.error("Error fetching parent details:", error);
            setError("Failed to load parent details. Please try again.");
        }
    };

    const handleParentClose = () => {
        setOpenParent(false);
        setRequestDetail(null);
    };

    useEffect(() => {
        fetchTherapist();
        fetchParentRequests();
    }, []);

    const getProfileImageUrl = (profilePic) => {
        if (!profilePic?.filename) return image68;
        return `${import.meta.env.VITE_SERVER_URL}/uploads/${profilePic.filename}`;
    };

    return (
        <>
            <TheraphistNavbar
                theraphistdetails={therapistDetails}
                navigateToProfile={() => navigate('/therapist/profile')}
            />

            <Box sx={{ background: "white", width: "100vw" }}>
                <Box sx={{ height: "46px", background: "#DBE8FA", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>Parent's Request</Typography>
                </Box>

                <Box sx={{ mt: "30px", ml: "50px", mr: "50px", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} to="/therapist/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Parent Requests</Typography>
                    </Breadcrumbs>

                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                        <SearchOutlinedIcon />
                        <input placeholder='Search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }} />
                    </Box>
                </Box>

                {error && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                )}

                <Box sx={{ width: "100%", backgroundColor: "#F6F7F9", py: 4, minHeight: "calc(100vh - 200px)", display: "flex", justifyContent: "center" }}>
                    {loading ? (
                        <Typography>Loading parent requests...</Typography>
                    ) : parentRequests.filter(r => r.status === "pending").length === 0 ? (
                        <Typography sx={{ fontSize: "18px", textAlign: "center" }}>No pending requests found</Typography>
                    ) : (
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                            gap: 3,
                            width: "100%",
                            maxWidth: "1200px",
                            px: 3
                        }}>
                            {parentRequests
                                .filter(request => request.status === "pending")
                                .map((request) => (
                                    <Card key={request._id} sx={{
                                        height: "205px",
                                        borderRadius: "20px",
                                        p: "20px",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        '&:hover': {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                                        }
                                    }}>
                                        <Box sx={{ display: "flex", height: "90%" }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ height: "150px", width: "150px", borderRadius: "10px", flexShrink: 0 }}
                                                image={getProfileImageUrl(request.parentId?.profilePic)}
                                                alt="Profile"
                                                onError={(e) => { e.target.src = image68 }}
                                            />
                                            <Box sx={{ pl: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1 }}>
                                                <Box>
                                                    <Typography variant="h6" color="primary">
                                                        {request.parentId?.name || "Unknown Parent"}
                                                    </Typography>
                                                    <Typography sx={{ color: '#7F7F7F', fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {request.parentId?.address || "Address not available"}
                                                    </Typography>
                                                    <Typography sx={{ color: '#7F7F7F', fontSize: "13px" }}>
                                                        {request.parentId?.phone || "Phone not available"}
                                                    </Typography>
                                                    <Button
                                                        onClick={() => fetchParentDetails(request._id)}
                                                        sx={{
                                                            textTransform: "none",
                                                            color: '#1976d2',
                                                            p: 0,
                                                            '&:hover': { backgroundColor: "transparent", textDecoration: "underline" }
                                                        }}
                                                    >
                                                        View Child
                                                    </Button>
                                                </Box>
                                                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                                    <Button
                                                        onClick={() => rejectParentRequest(request._id)}
                                                        variant='outlined'
                                                        color='secondary'
                                                        sx={{ borderRadius: "25px", height: "35px", width: '50px' }}
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        onClick={() => acceptParentRequest(request._id)}
                                                        variant='contained'
                                                        color='secondary'
                                                        sx={{ borderRadius: "25px", height: "35px", width: '50px', padding: "10px" }}
                                                    >
                                                        Accept
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Card>
                                ))
                            }
                        </Box>
                    )}
                </Box>

                <Modal
                    open={openParent}
                    onClose={handleParentClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={openParent}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            height: "720px",
                            width: "65%",
                            borderRadius: "20px",
                            overflow: "hidden"
                        }}>
                            {requestDetail && (
                                <TherapistViewParentDetails
                                    acceptParentRequest={acceptParentRequest}
                                    rejectParentRequest={rejectParentRequest}
                                    handleParentClose={handleParentClose}
                                    requestDetail={requestDetail}
                                />
                            )}
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </>
    );
};

export default TherapistParentRequest;