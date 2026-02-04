import React, { useState } from 'react';
import ParentNavbarSiginIn from '../Parent/ParentNavbarSiginIn';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import background from "../../assets/Frame 12.png";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from '../Footer/Footer';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const TheraphistRest = () => {
    const textFieldStyle = {
        height: "65px",
        width: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        position: "relative"
    };
    const siginupStyle = { background: "white", boxShadow: "none" };

    const { email } = useParams();

    const [data, setData] = useState({
        password: "",
        confirmpassword: ""
    });

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmpassword: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const [error, setError] = useState({});

    const validation = () => {
        let isValid = true;
        let errormessage = {};
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;

        if (!data.password.trim()) {
            errormessage.password = "Password is required";
            isValid = false;
        }
        else if (!passwordRegex.test(data.password)) {
            errormessage.password = "Password should have at least one uppercase, lowercase, special character and should be 6 to 15 characters long";
            isValid = false;
        }

        if (!data.confirmpassword.trim()) {
            errormessage.confirmpassword = "Confirm Password is required";
            isValid = false;
        }
        else if (data.confirmpassword.length < 8 || data.confirmpassword.length > 20) {
            errormessage.confirmpassword = "Confirm Password must be 8-20 characters long";
            isValid = false;
        }

        if (data.password !== data.confirmpassword) {
            errormessage.confirmpassword = "Password and Confirm Password must be same";
            isValid = false;
        }

        setError(errormessage);
        return isValid;
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validation();
        if (!isValid) {
            return;
        }

        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/resetpassword/${email}`, data);
            console.log(result);

            if (result.data.message === "No theraphist found with this email.") {
                toast.error("No theraphist found with this email.");
                return;
            }
            if (result.data.message === "Password reset successfully.") {
                toast.success("Password reset successfully.");
                navigate("/therapist/login");
            }
        } catch (error) {
            toast.error("An error occurred while resetting password.");
            console.error(error);
        }
    };

    return (
        <>
            <ParentNavbarSiginIn siginupStyle={siginupStyle} />
            <Container maxWidth="x-lg">
                <Box
                    component="img"
                    src={background}
                    sx={{
                        position: "absolute",
                        top: -50,
                        left: 0,
                        objectFit: 'cover',
                        zIndex: -1
                    }}
                />
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={"center"}
                    gap={2}
                    mt={5}
                >
                    <Stack
                        sx={{ width: "360px", height: "368px" }}
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={"center"}
                        gap={2}
                        mt={2}
                    >
                        <Typography
                            color='primary'
                            variant='h2'
                            sx={{ fontSize: "32px", fontWeight: "600" }}
                        >
                            Reset Password!
                        </Typography>
                        <Typography
                            textAlign={"center"}
                            color='primary'
                            variant='p'
                            sx={{ fontSize: "14px", fontWeight: "500" }}
                        >
                            Enter your new password to reset.
                        </Typography>

                        <div style={textFieldStyle}>
                            <label>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    style={{
                                        height: "40px",
                                        width: "100%",
                                        borderRadius: "8px",
                                        border: "1px solid #CCCCCC",
                                        padding: '8px 40px 8px 8px'
                                    }}
                                    onChange={handleChange}
                                    name='password'
                                    value={data.password}
                                    type={showPassword.password ? "text" : "password"}
                                />
                                <div
                                    onClick={() => togglePasswordVisibility('password')}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showPassword.password ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </div>
                            </div>
                            {error.password && (
                                <span style={{ color: 'red', fontSize: '12px' }}>
                                    {error.password}
                                </span>
                            )}
                        </div>

                        <div style={textFieldStyle}>
                            <label>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    style={{
                                        height: "40px",
                                        width: "100%",
                                        borderRadius: "8px",
                                        border: "1px solid #CCCCCC",
                                        padding: '8px 40px 8px 8px'
                                    }}
                                    onChange={handleChange}
                                    name='confirmpassword'
                                    value={data.confirmpassword}
                                    type={showPassword.confirmpassword ? "text" : "password"}
                                />
                                <div
                                    onClick={() => togglePasswordVisibility('confirmpassword')}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showPassword.confirmpassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </div>
                            </div>
                            {error.confirmpassword && (
                                <span style={{ color: 'red', fontSize: '12px' }}>
                                    {error.confirmpassword}
                                </span>
                            )}
                        </div>

                        <Button
                            variant='contained'
                            color='secondary'
                            sx={{
                                borderRadius: "25px",
                                marginTop: "20px",
                                height: "40px",
                                width: '200px',
                                padding: '10px 35px'
                            }}
                            onClick={handleSubmit}
                        >
                            Confirm
                        </Button>
                    </Stack>
                </Box>
            </Container>
            <Footer userRole="therapist" />        </>
    );
};

export default TheraphistRest;