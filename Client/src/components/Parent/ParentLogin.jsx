import React, { useState } from 'react'
import ParentNavbarSiginIn from './ParentNavbarSiginIn'
import { Box, Button, Container, Typography } from '@mui/material';
import background from "../../assets/Frame 12.png"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ParentLogin = () => {
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
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/login`, data);
            const jwtToken = response.data.token;
            const message = response.data.message;

            if (message === "Parent not found with this email.") {
                toast.error("Parent not found with this email.")
            }
            if (message === "Invalid Password.") {
                toast.error("Invalid Password.")
            }

            if (jwtToken && message === "Parent logged in successfully") {
                localStorage.setItem("token", jwtToken);
                toast.success("Logged in successfully!")
                navigate("/parent/home");
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
            console.error("Login error:", error);
        }
    }

    return (
        <>
            <ParentNavbarSiginIn siginupStyle={{ background: "white", boxShadow: "none" }} />
            <Container maxWidth="xs" sx={{
                minHeight: 'calc(100vh - 120px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                py: 4
            }}>
                <Box sx={{
                    textAlign: 'center',
                    mb: 4
                }}>
                    <Typography variant="h4" color='primary' sx={{
                        fontWeight: 700,
                        mb: 1
                    }}>
                        Parent Portal
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Sign in to manage your child's progress
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleLogin}>
                    <Box sx={{ mb: 3 }}>
                        <input
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #CCCCCC',
                                fontSize: '16px',
                                marginBottom: '8px'
                            }}
                            placeholder="Email address"
                            onChange={handleInputChange}
                            name='email'
                            value={data.email}
                            type='email'
                            required
                        />
                    </Box>

                    <Box sx={{ mb: 2, position: 'relative' }}>
                        <input
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #CCCCCC',
                                fontSize: '16px',
                                marginBottom: '8px'
                            }}
                            placeholder="Password"
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
                                top: '12px',
                                cursor: 'pointer',
                                color: 'text.secondary'
                            }}
                        >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right', mb: 3 }}>
                        <Link to="/parent/forgotpassword" style={{
                            textDecoration: "none",
                            color: 'primary.main',
                            fontSize: '14px'
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
                        Don't have an account?{' '}
                        <Link to="/parent/siginin" style={{
                            textDecoration: "none",
                            color: 'primary.main',
                            fontWeight: 600
                        }}>
                            Register here
                        </Link>
                    </Typography>
                </Box>
            </Container>
            <Footer userRole="parent" />         </>
    )
}

export default ParentLogin