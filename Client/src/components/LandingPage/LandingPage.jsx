import React, { useState } from 'react';
import "../../Styles/LandingPage.css";
import Navbar from '../Navbar/Navbar';
import { Box, Button, Container, Grid, Stack, Typography, Fab, Slide, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import background from "../../assets/Frame 12@2x.png";
import image68 from "../../assets/image 68.png";
import image69 from "../../assets/image 69.png";
import image70 from "../../assets/image 70.png";
import image71 from "../../assets/image 71.png";
import VerifiedIcon from '@mui/icons-material/Verified';
import AVATAR1 from "../../assets/AVATAR1.png";
import AVATAR2 from "../../assets/AVATAR2.png";
import AVATAR3 from "../../assets/AVATAR3.png";
import AVATAR4 from "../../assets/AVATAR4.png";
import user from "../../assets/user.png";
import shopping from "../../assets/Shopping list.png";
import elearning from "../../assets/Elearning.png";
import keyFeatures1 from "../../assets/image 74.png";
import keyFeatures2 from "../../assets/image 73.png";
import keyFeatures3 from "../../assets/image 75.png";
import keyFeatures4 from "../../assets/image 72.png";
import frame1 from "../../assets/Frame 48095593.png";
import frame2 from "../../assets/Frame 48095594.png";
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ChatBot from '../Chatbot/ChatBot';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const homebg = {
        backgroundColor: "#F6F7F9"
    }

    const [showChatBot, setShowChatBot] = useState(false);

    const handleToggleChatBot = () => {
        setShowChatBot(!showChatBot);
    };

    return (
        <>
            <Navbar homebg={homebg} />
            <Container maxWidth="x-lg" sx={{ ...homebg, height: '100vh', position: "relative", overflow: "hidden", zIndex: 2 }}>
                <Box component="img" src={background} alt='background'
                    sx={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", objectFit: 'cover', zIndex: -1 }}
                >
                </Box>
                <Stack direction="row" spacing={2} sx={{ padding: "80px 50px", zIndex: 1, }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                        <Box sx={{
                            position: "relative",
                            width: "262px",
                            height: "55px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid transparent",
                            borderImage: "linear-gradient(to right, #1967D2, #F6F7F9) 1",
                            borderRadius: "25px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            zIndex: 1,
                        }}>
                            <Typography variant="p" component="h6" color='primary'
                                sx={{ fontSize: "14px", fontWeight: 500, margin: "10px 0px" }}
                            >
                                <StarIcon sx={{ verticalAlign: 'middle', marginRight: 1, color: "#FFAE00" }} />
                                Welcome to learn hub
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h1" component="h1" color='primary'
                                sx={{ fontSize: "56px", fontWeight: 600, marginTop: 2, margin: "10px 0px" }}
                            >
                                Empowering Every
                            </Typography>
                            <Typography variant="h1" component="h1" color='secondary'
                                sx={{ fontSize: "56px", fontWeight: 600, marginTop: 2, margin: "10px 0px" }}
                            >
                                Child's Learning
                            </Typography>
                            <Typography variant="h1" component="h1" color='primary'
                                sx={{ fontSize: "56px", fontWeight: 600, marginTop: 2, margin: "10px 0px" }}
                            >
                                Journey
                            </Typography>
                            <Typography variant="p" component="p" color='primary'
                                sx={{ fontSize: "14px", fontWeight: 500, lineHeight: "25px", marginTop: 2, margin: "10px 0px", textAlign: "justify", marginRight: "250px" }}
                            >
                                A one-stop platform connecting parents, educators, and therapists to support children with learning disabilities through personalized learning plans, activity tracking, and seamless collaboration.
                            </Typography>
                            <Box sx={{ margin: "30px 0px", gap: "20px", display: "flex" }}>
                                <Link to="/parent/registration">
                                    <Button variant="contained"
                                        color="secondary"
                                        endIcon={<ArrowRightAltIcon />}
                                        sx={{ borderRadius: "25px" }}
                                    >
                                        Register
                                    </Button>
                                </Link>
                                <Link to="/aboutus">
                                    <Button variant="contained"
                                        endIcon={<ArrowRightAltIcon />}
                                        sx={{ borderRadius: "25px", color: "black", backgroundColor: "transparent" }}
                                    >
                                        Learn more
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Grid container spacing={1}
                            sx={{ width: "615px", height: "510px", position: "relative" }}
                        >
                            <Box sx={{ width: "264px", height: "62px", backgroundColor: 'white', borderRadius: "5px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", padding: "5px 3px", position: 'absolute', top: "30px", left: "-35px" }} >
                                <Typography variant='p' color="primary" sx={{ fontSize: "14px" }}>
                                    <VerifiedIcon color='secondary' />
                                    Thousands of Verified educators & therapist!
                                </Typography>
                            </Box>
                            <Box sx={{ width: "195px", height: "118px", backgroundColor: '#DBE8FA', borderRadius: "5px", padding: "5px 3px", position: 'absolute', bottom: "-85px", right: "-35px", display: "flex", alignItems: "center", justifyContent: "center" }} >
                                <Box sx={{ width: "165px", height: "88px", backgroundColor: 'white', borderRadius: "5px", padding: "5px 3px", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Box component="img" src={AVATAR1} alt='avatar' sx={{ width: "41px", height: "39px" }}></Box>
                                        <Box component="img" src={AVATAR2} alt='avatar' sx={{ width: "41px", height: "39px", marginLeft: "-20px" }}></Box>
                                        <Box component="img" src={AVATAR3} alt='avatar' sx={{ width: "41px", height: "39px", marginLeft: "-20px" }}></Box>
                                        <Box component="img" src={AVATAR4} alt='avatar' sx={{ width: "41px", height: "39px", marginLeft: "-20px" }}></Box>
                                    </Box>
                                    <Typography>
                                        200k+ Learning
                                    </Typography>
                                </Box>
                            </Box>
                            <Grid size={{ xs: 9 }}>
                                <Box component="img" src={image68} alt='img'
                                    sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Box component="img" src={image69} alt='img'
                                    sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 5 }}>
                                <Box component="img" src={image70} alt='img'
                                    sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 7 }}>
                                <Box component="img" src={image71} alt='img'
                                    sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Stack>
            </Container>
            <Container maxWidth="x-lg" sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", margin: "100px 0px", height: '100vh' }}>
                <Stack spacing={2} sx={{ width: "305px", height: "88px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                    <Box>
                        <Typography color='primary' variant='h3' sx={{ fontSize: "32px", fontWeight: "600" }}>
                            How it Works
                        </Typography>
                    </Box>
                    <Box>
                        <Typography color='primary' variant='p' sx={{ fontSize: "14px", fontWeight: "500" }}>
                            Find the perfect learning in just a few steps
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ height: "210px", display: "flex", alignItems: 'center', gap: "20px", marginTop: "90px" }}>
                    <Box sx={{ width: "400px", display: "flex", flexDirection: "column", alignItems: 'center', gap: "20px" }}>
                        <Box component="img" src={user} sx={{}}>
                        </Box>
                        <Box>
                            <Typography variant='h4' color='"primary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                Build Profiles
                            </Typography>
                        </Box>
                        <Box sx={{}}>
                            <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500", textAlign: 'justify' }}>
                                Parents add child details; educators & <br /> therapists set expertise.
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ width: "400px", display: "flex", flexDirection: "column", alignItems: 'center', gap: "20px" }}>
                        <Box component="img" src={elearning} sx={{}}>
                        </Box>
                        <Box>
                            <Typography variant='h4' color='"primary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                Start Learning
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500", textAlign: 'justify' }}>
                                Access personalized plans, track progress,<br />
                                and collaborate.
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ width: "400px", display: "flex", flexDirection: "column", alignItems: 'center', gap: "20px" }}>
                        <Box component="img" src={shopping} sx={{}}>
                        </Box>
                        <Box>
                            <Typography variant='h4' color='"primary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                Monitor & Improve
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500", textAlign: 'justify' }}>
                                Receive insights, expert advice, and <br />
                                ongoing support.
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Container>
            <Container maxWidth="x-lg" sx={{ backgroundColor: "#F0F6FE", padding: "50px 0px" }}>
                <Stack spacing={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ height: "88px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Typography color='primary' sx={{ fontSize: "32px", fontWeight: "600", marginTop: "20px" }}>
                            Key Features
                        </Typography>
                        <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                            An AI-powered platform that personalizes learning and tracks progress
                        </Typography>
                    </Box>
                    <Box sx={{ height: "333px", width: "1040px" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "50px", marginTop: "40px" }}>
                            <Box sx={{ height: '180px', width: '500px', display: "flex", flexDirection: 'column', alignItems: 'flex-start', gap: "20px" }}>
                                <Typography variant='h3' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                    Personalized Learning Plans
                                </Typography>
                                <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                    AI-driven learning paths tailored to each child's unique needs. Educators and therapists create customized activities that support development and track progress over time.
                                </Typography>
                                <Button color="secondary" sx={{ backgroundColor: 'transparent' }} endIcon={<ArrowRightAltIcon />}>
                                    Learn more
                                </Button>
                            </Box>
                            <Box>
                                <Box component="img" src={keyFeatures1} alt='img'
                                    sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ height: "333px", width: "1040px" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "50px", marginTop: "40px" }}>
                            <Box component="img" src={keyFeatures2} alt='img'
                                sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}>
                            </Box>
                            <Box>
                                <Box sx={{ height: '180px', width: '500px', display: "flex", flexDirection: 'column', alignItems: 'flex-start', gap: "20px" }}>
                                    <Typography variant='h3' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                        Real-Time Progress Tracking
                                    </Typography>
                                    <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                        Monitor learning milestones with interactive reports and visual analytics. Parents, educators, and therapists can access detailed insights to understand a child's growth and areas that need focus.
                                    </Typography>
                                    <Button color="secondary" sx={{ backgroundColor: 'transparent' }} endIcon={<ArrowRightAltIcon />}>
                                        Learn more
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ height: "333px", width: "1040px" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "50px", marginTop: "40px" }}>
                            <Box sx={{ height: '180px', width: '500px', display: "flex", flexDirection: 'column', alignItems: 'flex-start', gap: "20px" }}>
                                <Typography variant='h3' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                    Seamless Communication & Collaboration
                                </Typography>
                                <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                    A built-in messaging system allows parents, educators, and therapists to stay connected, share updates, and provide expert recommendations—all in one place.
                                </Typography>
                                <Button color="secondary" sx={{ backgroundColor: 'transparent' }} endIcon={<ArrowRightAltIcon />}>
                                    Learn more
                                </Button>
                            </Box>
                            <Box>
                                <Box component="img" src={keyFeatures3} alt='img'
                                    sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ height: "333px", width: "1040px" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "50px", marginTop: "40px" }}>
                            <Box component="img" src={keyFeatures4} alt='img'
                                sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}>
                            </Box>
                            <Box>
                                <Box sx={{ height: '180px', width: '500px', display: "flex", flexDirection: 'column', alignItems: 'flex-start', gap: "20px" }}>
                                    <Typography variant='h3' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                        Expert-Guided Support & Resources
                                    </Typography>
                                    <Typography variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                        Access a curated library of expert-approved activities, therapy exercises, and learning tools. Get real-time assistance from specialists to ensure every child gets the right support.
                                    </Typography>
                                    <Button color="secondary" sx={{ backgroundColor: 'transparent' }} endIcon={<ArrowRightAltIcon />}>
                                        Learn more
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            </Container>
            <Container maxWidth="x-lg" sx={{position:"relative"}}>
                <Box component="img" src={frame1} alt='background frame' sx={{position:"absolute",top:-50,left:0}}>
                </Box>
                <Box component="img" src={frame2} alt='background frame' sx={{position:"absolute",bottom:-50,right:0}}>
                </Box>
                <Stack sx={{ height: "265px", display: "flex", justifyContent:"space-evenly", alignItems: 'center', marginTop:'50px' }}>
                    <Typography sx={{ fontSize: "32px", fontWeight: "600" }} variant='h3' color='primary'>
                        Join Us Today!
                    </Typography>
                    <Typography sx={{ fontSize: "18px", fontWeight: "500" }} variant='h3' color='primary'>
                        Create an account and be a part of a collaborative learning experience that makes a difference.
                    </Typography>
                    <Link to="/parent/registration">
                    <Button variant='contained' color='secondary' endIcon={<ArrowRightAltIcon />} sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}>Register Now</Button>
                    </Link>
                </Stack>
            </Container>

            {/* Chat Bot Popup Window */}
            <Slide direction="up" in={showChatBot} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 100,
                        right: 24,
                        width: { xs: 'calc(100% - 48px)', sm: 400 },
                        height: '70vh',
                        maxHeight: 650,
                        zIndex: 1100,
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(16px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                        borderRadius: '24px',
                        border: '1px solid rgba(209, 213, 219, 0.3)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {/* Chat Window Header */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: '16px 20px',
                        background: 'linear-gradient(135deg, #1967D2 0%, #1565C0 100%)',
                        color: 'white',
                    }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: 'rgba(255,255,255,0.2)', 
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ChatIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                    LearnHub AI
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Online • Always here to help
                                </Typography>
                            </Box>
                        </Stack>
                        <IconButton
                            size="small"
                            onClick={() => setShowChatBot(false)}
                            sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                        >
                            <CloseIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Box>

                    {/* Chat Bot Content */}
                    <Box sx={{ flexGrow: 1, overflow: 'hidden', bgcolor: 'transparent' }}>
                        <ChatBot />
                    </Box>
                </Box>
            </Slide>

            {/* Floating Chat Button */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                }}
            >
                <Fab
                    aria-label="chat"
                    sx={{
                        background: 'linear-gradient(135deg, #1967D2 0%, #1565C0 100%)',
                        color: 'white',
                        width: 60,
                        height: 60,
                        boxShadow: '0 8px 24px rgba(25, 103, 210, 0.4)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                            boxShadow: '0 12px 32px rgba(25, 103, 210, 0.5)',
                        },
                        '&:active': {
                            transform: 'scale(0.95)',
                        }
                    }}
                    onClick={handleToggleChatBot}
                >
                    {showChatBot ? <CloseIcon /> : <ChatIcon />}
                </Fab>
                {!showChatBot && (
                    <Box
                        component={motion.div}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: '50%',
                            border: '2px solid #1967D2',
                            pointerEvents: 'none',
                        }}
                    />
                )}
            </Box>

            <Footer />
        </>
    );
};

export default LandingPage;