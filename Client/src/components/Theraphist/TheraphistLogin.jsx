import React, { useState } from 'react';
import ParentNavbarSiginIn from '../Parent/ParentNavbarSiginIn';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import background from "../../assets/Frame 12.png"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const TheraphistLogin = () => {
    const [data, setData] = useState({
        email: "",
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
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/login`, data);
            const jwtToken = response.data.token;
            const message = response.data.message;
            if (!jwtToken) return;
            const decoded = jwtDecode(jwtToken);
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${decoded.id}`, {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });

            if (res.data.theraphist.isAdminApproved == true) {
                if (jwtToken && message === "theraphist logged in successfully" && res.data.theraphist.isAdminApproved == true) {
                    localStorage.setItem("token", jwtToken);
                    toast.success("Logged in successfully!");
                    navigate("/therapist/home");
                } else {
                    toast.error("Invalid email or password");
                }
            } else {
                toast.error("Wait for admin approval");
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
            console.error("Login error:", error);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <>
            <ParentNavbarSiginIn siginupStyle={{ background: "white", boxShadow: "none" }} />
            <Box sx={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8
            }}>
                <Container maxWidth="sm">
                    <Box sx={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
                        p: 4,
                        textAlign: 'center'
                    }}>
                        <Typography variant="h4" color='primary' sx={{
                            fontWeight: "700",
                            mb: 3,
                            position: 'relative',
                            '&:after': {
                                content: '""',
                                display: 'block',
                                width: '60px',
                                height: '4px',
                                backgroundColor: 'secondary.main',
                                margin: '10px auto 0'
                            }
                        }}>
                            Therapist Login
                        </Typography>

                        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography align="left" sx={{ mb: 1, fontWeight: 500 }}>Email</Typography>
                                <input
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #CCCCCC',
                                        fontSize: '16px',
                                        transition: 'all 0.3s',
                                        '&:focus': {
                                            outline: 'none',
                                            borderColor: 'primary.main',
                                            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                        }
                                    }}
                                    onChange={handleInputChange}
                                    name='email'
                                    value={data.email}
                                    type='email'
                                    required
                                />
                            </Box>

                            <Box sx={{ mb: 2, position: 'relative' }}>
                                <Typography align="left" sx={{ mb: 1, fontWeight: 500 }}>Password</Typography>
                                <input
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #CCCCCC',
                                        fontSize: '16px'
                                    }}
                                    onChange={handleInputChange}
                                    name='password'
                                    value={data.password}
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                />
                                <Box
                                    onClick={togglePasswordVisibility}
                                    sx={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '42px',
                                        cursor: 'pointer',
                                        color: 'text.secondary'
                                    }}
                                >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </Box>
                            </Box>

                            <Box sx={{ textAlign: 'right', mb: 3 }}>
                                <Link to="/therapist/forgotpassword" style={{
                                    textDecoration: "none",
                                    color: 'primary.main',
                                    fontSize: '14px',
                                    fontWeight: 500
                                }}>
                                    Forgot password?
                                </Link>
                            </Box>

                            <Button
                                fullWidth
                                variant='contained'
                                color='secondary'
                                sx={{
                                    borderRadius: "8px",
                                    height: "48px",
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: 'none'
                                    }
                                }}
                                type="submit"
                            >
                                Login
                            </Button>

                            <Typography sx={{ mt: 3 }}>
                                Don't have an account?{' '}
                                <Link to="/therapist/registration" style={{
                                    textDecoration: "none",
                                    color: 'primary.main',
                                    fontWeight: 600
                                }}>
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Footer userRole="therapist" />        </>
    )
}

export default TheraphistLogin;