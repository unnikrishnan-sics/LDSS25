import React, { useEffect, useState } from 'react';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, CardContent, CardMedia, Fade, Grid, Modal, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import image68 from "../../assets/image 68.png";
import Backdrop from '@mui/material/Backdrop';
import EducatorViewParentDetails from './Common/EducatorViewParentDetails';

const EducatorAcceptedParents = () => {
    const useDummyData = true; // Or false if you want to use real data
    const [educatorDetails, setEducatorDetails] = useState({});
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Dummy data for parent requests
    const dummyParentRequests = [
        {
            _id: "request1",
            status: "accepted",
            parentId: {
                _id: "parent1",
                name: "Sarah Johnson",
                email: "sarah.johnson@example.com",
                address: "123 Main St, Springfield, IL 62704",
                phone: "+1 (555) 123-4567",
                profilePic: {
                    filename: "profile1.jpg"
                }
            }
        },
        {
            _id: "request2",
            status: "accepted",
            parentId: {
                _id: "parent2",
                name: "Michael Brown",
                email: "michael.brown@example.com",
                address: "456 Oak Ave, Springfield, IL 62704",
                phone: "+1 (555) 987-6543",
                profilePic: {
                    filename: "profile2.jpg"
                }
            }
        }
    ];

    const fetchEducator = async () => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/geteducator/${decoded.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const educatorData = response.data.educator;
        localStorage.setItem("educatorDetails", JSON.stringify(educatorData));
        setEducatorDetails(educatorData);
    }

    const [parentRequest, setParentRequest] = useState([]);
    const fetchParentsRequest = async () => {
        if (!useDummyData) {
            setParentRequest(dummyParentRequests);
        } else {
            try {
                const token = localStorage.getItem("token");
                const educatorId = JSON.parse(localStorage.getItem("educatorDetails"))._id;
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/parentsrequest/${educatorId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setParentRequest(response.data.request);
            } catch (error) {
                console.error("Failed to fetch parent requests:", error);
            }
        }
    };

    useEffect(() => {
        // Load educator details from localStorage if available
        const storedEducator = localStorage.getItem("educatorDetails");
        if (storedEducator) {
            setEducatorDetails(JSON.parse(storedEducator));
        }
        fetchEducator();
        fetchParentsRequest();
    }, []);

    const navigateToProfile = () => {
        navigate('/educator/profile');
    };

    // Modal state
    const [requestDetail, setRequestDetail] = useState({});
    const [openParent, setOpenParent] = useState(false);

    const handleParentOpen = () => {
        setOpenParent(true);
    };

    const handleParentClose = () => {
        setOpenParent(false);
    };

    const fetchParentByRequestId = async (requestId) => {
        try {
            // For dummy data
            if (useDummyData) {
                const foundRequest = dummyParentRequests.find(req => req._id === requestId);
                if (foundRequest) {
                    setRequestDetail({
                        _id: foundRequest._id,
                        parentId: foundRequest.parentId._id,
                        status: foundRequest.status
                    });
                    handleParentOpen();
                    return;
                }
            }

            // For real API
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/educator/viewrequestedparent/${requestId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.viewRequest) {
                setRequestDetail({
                    _id: response.data.viewRequest._id,
                    parentId: response.data.viewRequest.parentId,
                    status: response.data.viewRequest.status
                });
                handleParentOpen();
            }
        } catch (error) {
            console.error("Failed to fetch parent details:", error);
        }
    };

    // Filter parents based on search term with null checks
    const filteredParents = parentRequest.filter(request => {
        if (request.status !== "accepted") return false;

        const searchLower = searchTerm.toLowerCase();
        const parent = request.parentId || {};

        return (
            (parent.name && parent.name.toLowerCase().includes(searchLower)) ||
            (parent.email && parent.email.toLowerCase().includes(searchLower)) ||
            (parent.address && parent.address.toLowerCase().includes(searchLower)) ||
            (parent.phone && parent.phone.toString().toLowerCase().includes(searchLower))
        );
    });

    return (
        <>
            <EducatorNavbar educatorDetails={educatorDetails} navigateToProfile={navigateToProfile} />

            <Box sx={{ background: "white", width: "100vw" }}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color="primary" textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                        Parents
                    </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mt: "30px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} to="/educator/home">
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
                            placeholder="search here"
                            style={{ border: 0, outline: 0, height: "100%" }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                        gap: 3,
                        width: "100%",
                        maxWidth: "1200px",
                        px: 3
                    }}>
                        {filteredParents.length === 0 ?
                            (
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
                                                    image={`${import.meta.env.VITE_SERVER_URL}/uploads/${request.parentId?.profilePic?.filename || 'default-profile.jpg'}`}
                                                    alt="Profile"
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
                                                            {request.parentId?.name || 'No name'}
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: '#7F7F7F',
                                                            fontSize: "13px",
                                                            fontWeight: "500"
                                                        }}>
                                                            {request.parentId?.address || 'No address'}
                                                        </Typography>
                                                        <Typography sx={{
                                                            color: '#7F7F7F',
                                                            fontSize: "13px",
                                                            fontWeight: "500"
                                                        }}>
                                                            {request.parentId?.phone || 'No phone'}
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
                                )))
                        }
                    </Box>
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
                            <EducatorViewParentDetails
                                handleParentClose={handleParentClose}
                                requestDetail={requestDetail}
                                acceptParentrequest={() => { }}
                                rejectParentrequest={() => { }}
                            />
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </>
    );
};

export default EducatorAcceptedParents;