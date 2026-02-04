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

const EducatorLogin = () => {
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/login`, data);
            const jwtToken = response.data.token;
            const message = response.data.message;

            if (jwtToken && message === "educator logged in successfully") {
                localStorage.setItem("token", jwtToken);
                toast.success("Logged in successfully!");
                navigate("/educator/home");
            }
            else if (message === "Admin not approved you") {
                toast.error("Admin not approved you");
            }
            else {
                toast.error("Invalid email or password");
            }
        } catch (error) {
            toast.error("An error occurred during login");
            console.error("Login error:", error);
        }
    }

    return (
        <>
            <ParentNavbarSiginIn siginupStyle={{ background: "white", boxShadow: "none" }} />
            <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
                <Box sx={{
                    flex: 1,
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: { xs: 'none', md: 'block' }
                }}>
                    <Box sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(25, 118, 210, 0.8)',
                        color: 'white',
                        p: 8
                    }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="h5" sx={{ opacity: 0.9 }}>
                                Login to access your educator dashboard and continue making a difference.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4
                }}>
                    <Box sx={{ maxWidth: 400, width: '100%' }}>
                        <Typography variant="h4" color='primary' sx={{
                            fontWeight: 700,
                            mb: 4,
                            textAlign: 'center'
                        }}>
                            Educator Login
                        </Typography>

                        <Box component="form" onSubmit={handleLogin}>
                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ mb: 1, fontWeight: 500 }}>Email Address</Typography>
                                <input
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #CCCCCC',
                                        fontSize: '16px'
                                    }}
                                    onChange={handleInputChange}
                                    name='email'
                                    value={data.email}
                                    type='email'
                                    required
                                />
                            </Box>

                            <Box sx={{ mb: 2, position: 'relative' }}>
                                <Typography sx={{ mb: 1, fontWeight: 500 }}>Password</Typography>
                                <input
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px 12px 16px',
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

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3
                            }}>
                                <Link to="/educator/forgotpassword" style={{
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
                                    mb: 2
                                }}
                                type="submit"
                            >
                                Sign In
                            </Button>

                            <Typography sx={{ textAlign: 'center', mt: 3 }}>
                                New to our platform?{' '}
                                <Link to="/educator/registration" style={{
                                    textDecoration: "none",
                                    color: 'primary.main',
                                    fontWeight: 600
                                }}>
                                    Create an account
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Footer userRole="educator" />        </>
    )
}

export default EducatorLogin;