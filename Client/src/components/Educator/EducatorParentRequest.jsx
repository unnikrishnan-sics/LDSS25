import React, { useEffect, useState } from 'react'
import EducatorNavbar from '../Navbar/EducatorNavbar'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, CardContent, CardMedia, Fade, Grid, Modal, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import image68 from "../../assets/image 68.png";
import EducatorViewParentDetails from './Common/EducatorViewParentDetails';
import Backdrop from '@mui/material/Backdrop';

const EducatorParentRequest = () => {
    const [useDummyData, setUseDummyData] = useState(false);
    const [educator, setEducator] = useState({});
    const [parentRequest, setParentRequest] = useState([]);
    const [requestDetail, setRequestDetail] = useState({});
    const [openParent, setOpenParent] = useState(false);
    const navigate = useNavigate();

    const dummyEducator = {
        _id: "educator1",
        name: "John Smith",
        email: "john.smith@example.com",
        profilePic: {
            filename: "educator-profile.jpg"
        }
    };

    const dummyParentRequests = [
        {
            _id: "request1",
            status: "pending",
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
            status: "pending",
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
        },
        {
            _id: "request3",
            status: "pending",
            parentId: {
                _id: "parent3",
                name: "Emily Davis",
                email: "emily.davis@example.com",
                address: "789 Pine Rd, Springfield, IL 62704",
                phone: "+1 (555) 456-7890",
                profilePic: {
                    filename: "profile3.jpg"
                }
            }
        }
    ];

    const fetchEducator = async () => {
        if (useDummyData) {
            localStorage.setItem("educatorDetails", JSON.stringify(dummyEducator));
            setEducator(dummyEducator);
        } else {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const educator = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/geteducator/${decoded.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                localStorage.setItem("educatorDetails", JSON.stringify(educator.data.educator));
                setEducator(educator.data.educator);
            } catch (error) {
                console.error("Error fetching educator:", error);
            }
        }
    }

    const fetchParentsRequest = async () => {
        if (useDummyData) {
            setParentRequest(dummyParentRequests);
        } else {
            try {
                const token = localStorage.getItem("token");
                const educatorId = JSON.parse(localStorage.getItem("educatorDetails"))?._id;
                if (!educatorId) {
                    console.error("Educator ID not found");
                    return;
                }
                const request = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/parentsrequest/${educatorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setParentRequest(request.data?.request || []);
                console.log(request);

            } catch (error) {
                console.error("Error fetching parent requests:", error);
                setParentRequest([]);
            }
        }
    };

    const acceptParentrequest = async (requestId) => {
        if (useDummyData) {
            setParentRequest(prev => prev.map(req =>
                req._id === requestId ? { ...req, status: "accepted" } : req
            ));
            handleParentClose();
        } else {
            try {
                const token = localStorage.getItem("token");
                await axios.put(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/acceptsrequest/${requestId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                handleParentClose();
                fetchParentsRequest();
            } catch (error) {
                console.error("Error accepting request:", error);
            }
        }
    };

    const rejectParentrequest = async (requestId) => {
        if (useDummyData) {
            setParentRequest(prev => prev.filter(req => req._id !== requestId));
            handleParentClose();
        } else {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/rejectparent/${requestId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                handleParentClose();
                fetchParentsRequest();
            } catch (error) {
                console.error("Error rejecting request:", error);
            }
        }
    };

    const handleParentOpen = () => setOpenParent(true);
    const handleParentClose = () => setOpenParent(false);

    const fetchParentByRequestId = async (requestId) => {
        if (useDummyData) {
            const foundRequest = dummyParentRequests.find(req => req._id === requestId);
            if (foundRequest) {
                setRequestDetail(foundRequest);
                handleParentOpen();
            }
        } else {
            try {
                const token = localStorage.getItem("token");
                const parent = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/viewrequestedparent/${requestId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRequestDetail(parent.data?.viewRequest || {});
                handleParentOpen();
            } catch (error) {
                console.error("Error fetching parent details:", error);
            }
        }
    }

    const navigateToProfile = () => {
        navigate('/educator/profile');
    };

    useEffect(() => {
        const storedEducator = localStorage.getItem("educatorDetails");
        if (storedEducator) {
            setEducator(JSON.parse(storedEducator));
        }
        fetchEducator();
        fetchParentsRequest();
    }, []);

    const pendingRequests = Array.isArray(parentRequest) ? parentRequest.filter(request => request?.status === "pending") : [];

    return (
        <>
            <EducatorNavbar educatorDetails={educator} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white", width: "100vw" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Parent's Request</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"start"} sx={{ mt: "30px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/educator/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Parent Requests</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                        <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                        <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
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
                        {pendingRequests.length === 0 ?
                            (<Typography sx={{
                                fontSize: "32px",
                                gridColumn: "1 / -1",
                                textAlign: "center"
                            }} color='primary'>No request found</Typography>)
                            :
                            (pendingRequests.map((request, index) => (
                                <Card key={index} sx={{
                                    height: "205px",
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
                                            gap: "1px",
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
                                                image={useDummyData ? image68 : request.parentId?.profilePic?.filename ? `${import.meta.env.VITE_SERVER_URL}/uploads/${request.parentId.profilePic.filename}` : image68}
                                                alt="Profile"
                                            />
                                            <Box sx={{
                                                height: "100%",
                                                overflow: "hidden",
                                                pl: "10px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                flexGrow: 1
                                            }}>
                                                <Box display="flex" flexDirection="column" gap={1}>
                                                    <Typography variant="h6" color="primary">
                                                        {request.parentId?.name || "Unknown Parent"}
                                                    </Typography>
                                                    <Typography sx={{
                                                        color: '#7F7F7F',
                                                        fontSize: "13px",
                                                        fontWeight: "500",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "100%"
                                                    }}>
                                                        {request.parentId?.address || "Address not available"}
                                                    </Typography>

                                                    <Typography sx={{
                                                        color: '#7F7F7F',
                                                        fontSize: "13px",
                                                        fontWeight: "500"
                                                    }}>
                                                        {request.parentId?.phone || "Phone not available"}
                                                    </Typography>
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
                                                <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                                                    <Button
                                                        onClick={() => rejectParentrequest(request._id)}
                                                        variant='outlined'
                                                        color='secondary'
                                                        sx={{
                                                            borderRadius: "25px",
                                                            height: "35px",
                                                            width: '100px',
                                                            padding: '10px 35px',
                                                            mt: "10px",
                                                            border: "1px solid #1967D2"
                                                        }}
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        onClick={() => acceptParentrequest(request._id)}
                                                        variant='contained'
                                                        color='secondary'
                                                        sx={{
                                                            borderRadius: "25px",
                                                            height: "35px",
                                                            width: '100px',
                                                            padding: '10px 35px',
                                                            mt: "10px"
                                                        }}
                                                    >
                                                        Accept
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            )))
                        }
                    </Box>
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
                            <EducatorViewParentDetails
                                acceptParentrequest={acceptParentrequest}
                                rejectParentrequest={rejectParentrequest}
                                handleParentClose={handleParentClose}
                                requestDetail={requestDetail}
                                useDummyData={useDummyData}
                            />
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </>
    )
}

export default EducatorParentRequest