import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography,
    styled
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import contactbg from "../../assets/vector 10.png";
import Footer from '../Footer/Footer';

const EducatorContact = () => {
    const StyledTextField = styled(TextField)({
        borderRadius: "8px",
        width: "100%",
        border: "1px solid #CCCCCC",
        '& .MuiInputBase-root': {
            height: "40px",
            '& .MuiInputBase-input': {
                padding: '10px 0px',
            }
        }
    });

    const StyledTextFieldComment = styled(TextField)({
        borderRadius: "8px",
        width: "100%",
        border: "1px solid #CCCCCC",
        '& .MuiInputBase-root': {
            height: "100px",
            '& .MuiInputBase-input': {
                padding: '10px 0px',
            }
        }
    });

    const [educatorDetails, setEducatorDetails] = useState({});
    const navigate = useNavigate();

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

    useEffect(() => {
        // Load educator details from localStorage if available
        const storedEducator = localStorage.getItem("educatorDetails");
        if (storedEducator) {
            setEducatorDetails(JSON.parse(storedEducator));
        }
        fetchEducator();
    }, []);

    const navigateToProfile = () => {
        navigate('/educator/profile');
    }

    return (
        <>
            <EducatorNavbar
                contactbg={contactbg}
                educatorDetails={educatorDetails}
                navigateToProfile={navigateToProfile}
            />

            {/* Top Section with Background Image */}
            <Box
                sx={{
                    backgroundImage: `url(${contactbg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: "500px",
                    padding: 0,
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        height: "370px",
                        gap: "35px"
                    }}
                >
                    <Typography variant='h3' color='primary' sx={{ fontSize: "24px", fontWeight: "500" }}>
                        Contact Us
                    </Typography>
                    <Typography variant='h2' color='secondary' sx={{ fontSize: "32px", fontWeight: "600" }}>
                        We're Here to Help!
                    </Typography>
                    <Typography
                        textAlign="center"
                        variant='p'
                        color='primary'
                        sx={{ fontSize: "14px", fontWeight: "500" }}
                    >
                        We'd love to hear from you! Whether it's a query, feedback, or assistance, feel free to connect with us anytime.<br />
                        Our team is here to assist you every step of the way. Reach out and let us help you!
                    </Typography>
                </Box>
            </Box>

            {/* Form and Contact Info Section */}
            <Container maxWidth="false">
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                        sx={{
                            height: "528px",
                            width: "70%",
                            gap: "100px"
                        }}
                    >
                        {/* Form */}
                        {/* <Box 
                            display="flex" 
                            flexDirection="column" 
                            justifyContent="center" 
                            alignItems="center" 
                            sx={{ 
                                gap: "15px", 
                                border: "1px solid #CCCCCC", 
                                borderRadius: "15px", 
                                padding: "20px" 
                            }}
                        >
                            <Typography variant='h3' color='primary' sx={{ fontSize: "24px", fontWeight: "500" }}>
                                Get in Touch
                            </Typography>
                            <Box sx={{ height: "65px", width: "360px" }}>
                                <label>Name</label>
                                <StyledTextField />
                            </Box>
                            <Box sx={{ height: "65px", width: "360px" }}>
                                <label>E-mail</label>
                                <StyledTextField />
                            </Box>
                            <Box sx={{ height: "125px", width: "360px" }}>
                                <label>Comments</label>
                                <StyledTextFieldComment />
                            </Box>
                            <Button 
                                variant='contained' 
                                color='secondary' 
                                sx={{ 
                                    borderRadius: "25px", 
                                    marginTop: "20px", 
                                    height: "40px", 
                                    width: '150px', 
                                    padding: '10px 35px' 
                                }}
                            >
                                Submit
                            </Button>
                        </Box> */}

                        {/* Contact Info */}
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ gap: "35px" }}
                        >
                            {/* Phone */}
                            <Box
                                display="flex"
                                justifyContent="space-evenly"
                                alignItems="center"
                                sx={{
                                    gap: "25px",
                                    border: "1px solid #CCCCCC",
                                    borderRadius: "10px",
                                    width: "360px",
                                    height: "100px"
                                }}
                            >
                                <PhoneIcon />
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="start"
                                    sx={{ gap: "15px" }}
                                >
                                    <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>
                                        +91 1234123423
                                    </Typography>
                                    <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                        Available Monday to Friday,<br />9 AM - 6 PM
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Email */}
                            <Box
                                display="flex"
                                justifyContent="space-evenly"
                                alignItems="center"
                                sx={{
                                    gap: "25px",
                                    border: "1px solid #CCCCCC",
                                    borderRadius: "10px",
                                    width: "360px",
                                    height: "100px"
                                }}
                            >
                                <MailOutlineIcon />
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="start"
                                    sx={{ gap: "15px" }}
                                >
                                    <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>
                                        Learnhub@gmail.com
                                    </Typography>
                                    <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                        We will respond within 24 hours on <br /> weekdays.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Location */}
                            <Box
                                display="flex"
                                justifyContent="space-evenly"
                                alignItems="center"
                                sx={{
                                    gap: "25px",
                                    border: "1px solid #CCCCCC",
                                    borderRadius: "10px",
                                    width: "360px",
                                    height: "100px"
                                }}
                            >
                                <LocationOnIcon />
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="start"
                                    sx={{ gap: "15px" }}
                                >
                                    <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>
                                        LearnHub Headquarters
                                    </Typography>
                                    <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                        1234 Avenue, Suite 567
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Container>

            <Footer userRole="educator" />        </>
    );
}

export default EducatorContact;