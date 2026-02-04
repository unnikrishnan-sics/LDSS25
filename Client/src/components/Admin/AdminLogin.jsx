import React, { useState } from 'react'
import ParentNavbarSiginIn from '../Parent/ParentNavbarSiginIn'
import { Box, Button, Container, InputAdornment, Stack, TextField, Typography, styled } from '@mui/material';
import background from "../../assets/Frame 12.png"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLogin = () => {
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }
    const siginupStyle = { background: "white", boxShadow: "none" };

    const [data, setData] = useState({
        userId: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/admin/login`, data);

            const jwtToken = response.data.token;
            const message = response.data.message;

            if (jwtToken && message === "Admin logged in successfully") {
                localStorage.setItem("token", jwtToken);
                toast.success("Logged in successfully!")
                navigate("/admin/dashboard");
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message;
                if (message === "Invalid password.") {
                    toast.error("Invalid password.");
                } else if (message === "Admin not found.") {
                    toast.error("Admin not found with this ID.");
                } else {
                    toast.error("Login failed. Please try again.");
                }
            } else {
                toast.error("Network error. Please try again.");
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <>
            <ParentNavbarSiginIn siginupStyle={siginupStyle} />
            <Container>
                <Box component="img" src={background} sx={{ position: "absolute", top: -50, left: 0, objectFit: 'cover', zIndex: -1 }}></Box>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} sx={{ marginTop: "80px" }}>
                    <Typography variant="h2" component="div" color='primary' sx={{ fontSize: "32px", fontWeight: "600" }}>
                        Login !
                    </Typography>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'flex-end'} >

                        <Stack>
                            <div style={textFieldStyle}>
                                <label>UserId</label>
                                <input
                                    style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleInputChange}
                                    name='userId'
                                    value={data.userId}
                                    type='text'
                                    placeholder='Enter your admin ID'
                                />
                            </div>
                            <div style={textFieldStyle}>
                                <label>Password</label>
                                <input
                                    style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px', paddingRight: '40px' }}
                                    onChange={handleInputChange}
                                    name='password'
                                    value={data.password}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Enter your password'
                                />
                                <div
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '70%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </div>
                            </div>
                        </Stack>
                    </Box>

                    <Stack sx={{ mb: "80px" }} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2} mt={2}>
                        <Button
                            variant='contained'
                            color='secondary'
                            sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </Stack>
                </Box>
            </Container>
            <Footer />
        </>
    )
}

export default AdminLogin