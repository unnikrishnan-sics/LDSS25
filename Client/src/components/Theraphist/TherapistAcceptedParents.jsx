import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, CardContent, CardMedia, Fade, Grid, Modal, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import image68 from "../../assets/image 68.png";
import Backdrop from '@mui/material/Backdrop';
import TheraphistNavbar from '../Navbar/TheraphistNavbar';
import TherapistViewParentDetails from './Common/TherapistViewParentDetails';

const TherapistAcceptedParents = () => {
    const [therapistDetails, setTherapistDetails] = useState({});
    const [parentRequests, setParentRequests] = useState([]);
    const [filteredParents, setFilteredParents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [requestDetail, setRequestDetail] = useState({});
    const [openParent, setOpenParent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchTherapist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found");
                navigate('/login');
                return;
            }

            const decoded = jwtDecode(token);
            const storedTherapist = localStorage.getItem("theraphistDetails");

            if (storedTherapist) {
                setTherapistDetails(JSON.parse(storedTherapist));
            } else if (decoded.id) {
                // If therapist details not in localStorage, fetch from API
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/${decoded.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTherapistDetails(response.data.therapist);
                localStorage.setItem("theraphistDetails", JSON.stringify(response.data.therapist));
            }
        } catch (error) {
            console.error("Error fetching therapist:", error);
            setError("Failed to load therapist details");
        }
    };

    const fetchParentsRequest = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/login');
                return;
            }

            const storedTherapist = localStorage.getItem("theraphistDetails");
            if (!storedTherapist) {
                console.error("No therapist details found");
                return;
            }

            const therapistId = JSON.parse(storedTherapist)._id;
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/parentsrequest/${therapistId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Filter only accepted requests
            const acceptedRequests = response.data.request.filter(req => req.status === "accepted");
            setParentRequests(acceptedRequests);
            setFilteredParents(acceptedRequests);
        } catch (error) {
            console.error("Failed to fetch parent requests:", error);
            setError("Failed to load parent requests");
        } finally {
            setLoading(false);
        }
    };

    const fetchParentByRequestId = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/viewrequestedparent/${requestId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRequestDetail(response.data.viewRequest);
            handleParentOpen();
        } catch (error) {
            console.error("Failed to fetch parent details:", error);
            setError("Failed to load parent details");
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term === "") {
            setFilteredParents(parentRequests);
        } else {
            const filtered = parentRequests.filter(request => {
                // Convert all searchable fields to strings to safely use includes()
                const name = request.parentId?.name?.toString().toLowerCase() || '';
                const email = request.parentId?.email?.toString().toLowerCase() || '';
                const phone = request.parentId?.phone?.toString() || '';
                const address = request.parentId?.address?.toString().toLowerCase() || '';

                const searchLower = term.toLowerCase();

                return (
                    name.includes(searchLower) ||
                    email.includes(searchLower) ||
                    phone.includes(term) || // Keep phone search as is (numbers)
                    address.includes(searchLower)
                );
            });
            setFilteredParents(filtered);
        }
    };

    useEffect(() => {
        fetchTherapist();
        fetchParentsRequest();
    }, []);

    const handleParentOpen = () => setOpenParent(true);
    const handleParentClose = () => setOpenParent(false);

    const navigateToProfile = () => {
        navigate('/therapist/profile');
    };

    return (
        <>
            <TheraphistNavbar theraphistdetails={therapistDetails} navigateToProfile={navigateToProfile} />

            <Box sx={{ background: "white", width: "100vw" }}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color="primary" textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                        Parents
                    </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mt: "30px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} to="/therapist/home">
                            Home
                        </Link>
                        <Typography color="primary" sx={{ fontSize: "12px", fontWeight: "500" }}>
                            Parents
                        </Typography>
                    </Breadcrumbs>

                    <Box display="flex" alignItems="center" gap={1} sx={{
                        padding: "8px 15px",
                        borderRadius: "25px",
                        border: "1px solid #CCCCCC",
                        height: "40px"
                    }}>
                        <SearchOutlinedIcon />
                        <input
                            placeholder="Search by name, email, phone or address"
                            style={{ border: 0, outline: 0, height: "100%" }}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Box>
                </Box>

                {/* Parents Grid */}
                <Box sx={{
                    width: "100%",
                    backgroundColor: "#F6F7F9",
                    py: 4,
                    minHeight: "calc(100vh - 200px)",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    {loading ? (
                        <Typography sx={{ fontSize: "18px" }}>Loading...</Typography>
                    ) : error ? (
                        <Typography sx={{ fontSize: "18px", color: "error.main" }}>{error}</Typography>
                    ) : (
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                            gap: 3,
                            width: "100%",
                            maxWidth: "1200px",
                            px: 3
                        }}>
                            {filteredParents.length === 0 ? (
                                <Typography sx={{
                                    fontSize: "32px",
                                    gridColumn: "1 / -1",
                                    textAlign: "center"
                                }} color="primary">
                                    {searchTerm ? "No matching parents found" : "No parents accepted yet"}
                                </Typography>
                            ) : (
                                filteredParents.map((request, index) => (
                                    <Card key={index} sx={{
                                        height: "197px",
                                        borderRadius: "20px",
                                        p: "20px",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        '&:hover': {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                                        }
                                    }}>
                                        <Box display="flex" alignItems="center" sx={{ height: "100%" }}>
                                            <Box display="flex" sx={{
                                                height: "100%",
                                                gap: "10px",
                                                width: "100%"
                                            }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{
                                                        height: "150px",
                                                        width: "150px",
                                                        borderRadius: "10px",
                                                        flexShrink: 0
                                                    }}
                                                    image={request.parentId.profilePic?.filename
                                                        ? `${import.meta.env.VITE_SERVER_URL}/uploads/${request.parentId.profilePic.filename}`
                                                        : image68}
                                                    alt="Profile"
                                                    onError={(e) => {
                                                        e.target.src = image68;
                                                    }}
                                                />
                                                <Box sx={{
                                                    height: "100%",
                                                    overflow: "hidden",
                                                    p: "10px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                    flexGrow: 1
                                                }}>
                                                    <Box display="flex" flexDirection="column" gap={2}>
                                                        <Typography variant="h6" color="primary">
                                                            {request.parentId?.name || 'No name provided'}
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: '#7F7F7F',
                                                            fontSize: "13px",
                                                            fontWeight: "500"
                                                        }}>
                                                            {request.parentId?.email || 'No email provided'}
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: '#7F7F7F',
                                                            fontSize: "13px",
                                                            fontWeight: "500"
                                                        }}>
                                                            {request.parentId?.phone || 'No phone provided'}
                                                        </Typography>
                                                    </Box>
                                                    <Button
                                                        onClick={() => fetchParentByRequestId(request._id)}
                                                        sx={{
                                                            alignSelf: "flex-start",
                                                            textTransform: "none",
                                                            color: '#1976d2',
                                                            p: 0,
                                                            '&:hover': {
                                                                backgroundColor: "transparent",
                                                                textDecoration: "underline"
                                                            }
                                                        }}
                                                    >
                                                        View Child
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Card>
                                ))
                            )}
                        </Box>
                    )}
                </Box>

                {/* Parent Details Modal */}
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
                            <TherapistViewParentDetails
                                handleParentClose={handleParentClose}
                                requestDetail={requestDetail}
                            />
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </>
    );
};

export default TherapistAcceptedParents;