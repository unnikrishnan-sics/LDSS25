import React, { useEffect, useState } from 'react'
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { Box, Typography } from '@mui/material';
import aboutbg from "../../assets/about-bg.png";
import background from "../../assets/Frame 12.png"
import background2 from "../../assets/about-bg2.png";
import background3 from "../../assets/about-bg3.png";
import aboutSocial from "../../assets/social-integration-working-team 1.png";
import vector1 from "../../assets/Vector.png";
import vector2 from "../../assets/Vector1.png";
import Footer from '../Footer/Footer';
import aboutbg1 from "../../assets/aboutbg.png";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

const EducatorAbout = () => {
    const aboutBg = {
        background: "#F6F7F9"
    }

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
            <EducatorNavbar aboutBg={aboutBg} educatorDetails={educatorDetails} navigateToProfile={navigateToProfile} />
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{
                position: "relative",
                ...aboutBg
            }}>
                <Box component="img" src={background} sx={{ position: "absolute", bottom: 0, left: 0, objectFit: 'cover', zIndex: -10 }}></Box>
                <Box component="img" src={background2} sx={{ position: "absolute", top: 90, left: 100, objectFit: 'cover', zIndex: 2 }}></Box>
                <Box component="img" src={background3} sx={{ position: "absolute", bottom: 0, left: 350, objectFit: 'cover', zIndex: 2 }}></Box>
                <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} sx={{ gap: "40px", margin: "80px 70px", zIndex: 1 }}>
                    <Typography variant='h3' color='primary' sx={{ fontSize: "24px", fontWeight: "500" }}>About Us</Typography>
                    <Typography variant='h3' color='secondary' sx={{ fontSize: "32px", fontWeight: "600" }}>Empowering Every Child's <br /> Learning Journey!</Typography>
                    <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>We are dedicated to providing children with learning disabilities the support <br /> they need to thrive. By leveraging AI-driven insights, we bridge the gap <br /> between parents, educators, and therapists, creating a seamless, <br /> personalized, and inclusive learning experience.</Typography>
                </Box>
                <Box component="img" alt='bg' src={aboutbg}></Box>
            </Box>

            <Box display={"flex"} justifyContent={"space-around"} alignItems={"center"} sx={{ margin: "100px", position: "relative" }}>
                <Box component="img" src={background2} sx={{ position: "absolute", top: -25, left: 570, objectFit: 'cover', zIndex: -1 }}></Box>
                <Box component="img" src={background2} sx={{ position: "absolute", top: 310, left: 50, objectFit: 'cover', zIndex: -1 }}></Box>
                <Box component="img" src={aboutSocial} alt='img'></Box>
                <Box display={"flex"} flexDirection={"column"} alignItems={"start"} sx={{ height: "240px", gap: "25px" }}>
                    <Typography variant='h3' color='secondary' sx={{ fontSize: "32px", fontWeight: "600" }}> <span style={{ color: "#384371" }}>About Us – </span>Empowering Your <br /> Learning Journey</Typography>
                    <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>We are committed to supporting children with learning disabilities by <br /> connecting parents, educators, and therapists through AI-powered tools. Our <br /> platform ensures personalized learning, progress tracking, and expert <br /> guidance in a collaborative and secure environment.</Typography>
                </Box>
            </Box>

            <Box display={"flex"} alignItems={"center"} justifyContent={"space-around"} sx={{
                height: "700px",
                backgroundImage: `url(${aboutbg1})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"start"} flexDirection={"column"} sx={{ height: '400px', gap: "30px", margin: "0px 70px" }}>
                    <Box component="img" src={vector1} sx={{ height: "118px" }}></Box>
                    <Typography variant='h3' sx={{ fontSize: "32px", fontWeight: "600", color: "white" }}> Our Vision</Typography>
                    <Typography variant='h3' sx={{ fontSize: "14px", fontWeight: "500", color: "white", lineHeight: "25px" }}>To build a future where every child, regardless of learning challenges, <br /> has access to the right tools, guidance, and support to reach their full <br /> potential.</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"center"} alignItems={"start"} flexDirection={"column"} sx={{ height: '400px', gap: "30px", margin: "0px 70px" }}>
                    <Box sx={{ height: "118px" }}></Box>
                    <Typography variant='h3' sx={{ fontSize: "32px", fontWeight: "600", color: "white" }}> Our Mission</Typography>
                    <Typography variant='h3' sx={{ fontSize: "14px", fontWeight: "500", color: "white", lineHeight: "25px" }}>To empower children with learning disabilities by providing tailored <br /> educational support, fostering collaboration, and ensuring equal <br /> opportunities for growth and success.</Typography>
                    <Box component="img" src={vector2} sx={{ marginLeft: "300px" }}></Box>
                </Box>
            </Box>

            {/* Why Choose Us section */}
            <Box sx={{ width: '100%', mb: "100px" }} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Box sx={{ gap: "20px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                    <Typography variant='h3' color='primary' sx={{ fontSize: "32px", fontWeight: "600", marginTop: '20px' }}>Why Choose Us?</Typography>
                    <Box display={"flex"} alignItems={"start"} flexDirection={"column"} sx={{ marginLeft: '10px', gap: '25px' }}>
                        <Box display={"flex"} alignItems={"start"} flexDirection={"column"} sx={{ gap: '25px' }}>
                            <Typography variant='h3' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>1. AI-Powered Personalization:</Typography>
                            <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500", marginLeft: "10px" }}>Our intelligent system tailors learning plans based on each child's unique needs, ensuring personalized support to their progress</Typography>
                        </Box>
                        <Box display={"flex"} alignItems={"start"} flexDirection={"column"} sx={{ gap: '25px' }}>
                            <Typography variant='h3' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>2. Real-Time Progress Tracking:</Typography>
                            <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500", marginLeft: "10px" }}>Monitor your child's development with detailed insights, interactive reports, and AI-driven analytics to measure improvement over time.</Typography>
                        </Box>
                        <Box display={"flex"} alignItems={"start"} flexDirection={"column"} sx={{ gap: '25px' }}>
                            <Typography variant='h3' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>3. Expert-Guided Resources:</Typography>
                            <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500", marginLeft: "10px" }}>Gain access to a curated library of therapist-approved activities, exercises, and tools designed to enhance learning and therapy.</Typography>
                        </Box>
                        <Box display={"flex"} alignItems={"start"} flexDirection={"column"} sx={{ gap: '25px' }}>
                            <Typography variant='h3' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>4. User-Friendly & Secure:</Typography>
                            <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500", marginLeft: "10px" }}>Our platform is built with an intuitive interface, ensuring ease of use while prioritizing data security and privacy for all users.</Typography>
                        </Box>
                        <Box display={"flex"} alignItems={"start"} flexDirection={"column"} sx={{ gap: '25px' }}>
                            <Typography variant='h3' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>5. Inclusive & Supportive Community:</Typography>
                            <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500", marginLeft: "10px" }}>Join a network of professionals to empowering children with learning disabilities, fostering growth, confidence, and lifelong success.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Footer userRole="educator" />        </>
    )
}

export default EducatorAbout