import React, { useState } from 'react'
import ParentNavbarSiginIn from './ParentNavbarSiginIn'
import { Container, Stack, Typography, Box, TextField, styled, InputAdornment, Checkbox, Button } from '@mui/material';
import profileFrame from "../../assets/profileFrame.png";
import background from "../../assets/Frame 12.png"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ParentSiginIn = () => {
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }
    const siginupStyle = { background: "white", boxShadow: "none" }

    const [checked, setChecked] = React.useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState({})
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phone: "",
        profilePic: null
    });

    const handleChange = (event) => {
        setChecked(event.target.checked);
        if (event.target.checked) {
            setError((prevError) => ({
                ...prevError,
                terms: ""
            }));
        }
    };

    const handleDataChange = (e) => {
        const { name, value } = e.target;

        // Clear error for the current field when user types
        setError((prevError) => ({
            ...prevError,
            [name]: ""
        }));

        // For name field, only allow alphabets and spaces
        if (name === 'name') {
            if (value === '' || /^[A-Za-z\s]*$/.test(value)) {
                setData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        }
        // For phone field, only allow numbers and limit to 10 digits
        else if (name === 'phone') {
            if (value === '' || (/^\d*$/.test(value) && value.length <= 10)) {
                setData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            setData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(prev => ({
                ...prev,
                profilePic: file
            }));
            const objectURL = URL.createObjectURL(file);
            setImagePreview(objectURL);
        }
    }

    const validation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
        const nameRegex = /^[A-Za-z\s]+$/;

        // Name validation
        if (!data.name.trim()) {
            errorMessage.name = "Name is required";
            isValid = false;
        } else if (!nameRegex.test(data.name)) {
            errorMessage.name = "Name should contain only alphabets";
            isValid = false;
        } else if (data.name.length < 3 || data.name.length > 20) {
            errorMessage.name = "Name should be 3-20 characters long";
            isValid = false;
        }

        // Email validation
        if (!data.email.trim()) {
            errorMessage.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            errorMessage.email = "Invalid email format";
            isValid = false;
        }

        // Password validation
        if (!data.password.trim()) {
            errorMessage.password = "Password is required";
            isValid = false;
        } else if (!passwordRegex.test(data.password)) {
            errorMessage.password = "Password must contain 6-15 chars with uppercase, lowercase, number, and special char";
            isValid = false;
        }

        // Confirm Password validation
        if (!data.confirmPassword.trim()) {
            errorMessage.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (data.password !== data.confirmPassword) {
            errorMessage.confirmPassword = "Passwords don't match";
            isValid = false;
        }

        // Address validation
        if (!data.address.trim()) {
            errorMessage.address = "Address is required";
            isValid = false;
        } else if (data.address.length < 10) {
            errorMessage.address = "Address should be at least 10 characters";
            isValid = false;
        }

        // Phone validation
        if (!data.phone.trim()) {
            errorMessage.phone = "Phone number is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(data.phone)) {
            errorMessage.phone = "Phone number must be exactly 10 digits";
            isValid = false;
        }

        // Terms validation
        if (!checked) {
            errorMessage.terms = "You must accept the terms";
            isValid = false;
        }

        setError(errorMessage);
        return isValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validation();
        if (!isValid) return;

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('confirmpassword', data.confirmPassword);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        formData.append('profilePic', data.profilePic);
        formData.append('agreed', checked);

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/registration`, formData);
            const result = response.data;

            if (result.message === "Parent already registered with this phone number") {
                toast.error("Phone number already registered");
            } else if (result.message === "Parent already registered with this email") {
                toast.error("Email already registered");
            } else if (result.message === "Parent created successfully") {
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    address: "",
                    phone: "",
                    profilePic: null
                });
                setChecked(false);
                setImagePreview(null);
                toast.success("Registration successful!");
                navigate("/parent/login");
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.");
            console.error("Registration error:", error);
        }
    }

    return (
        <>
            <ParentNavbarSiginIn siginupStyle={siginupStyle} />
            <Container sx={{ position: "relative", mb: "50px", siginupStyle }} maxWidth="x-lg">
                <Box component="img" src={background} sx={{ position: "absolute", top: 110, left: 0, objectFit: 'cover', zIndex: -1 }}></Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Stack spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "60px" }}>
                            <input
                                type="file"
                                id="profile-upload"
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                            />

                            <Typography variant='h2' color='primary' sx={{ fontSize: "32px", fontWeight: "600" }}>Sign Up!</Typography>
                            <label htmlFor="profile-upload" style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                                <Box component="img" src={imagePreview ? imagePreview : profileFrame} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%" }}></Box>
                                {imagePreview ? <Typography></Typography> : <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ add image</Typography>}
                            </label>
                        </Stack>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "293px", flexDirection: "column", marginTop: '30px' }}>
                        <Stack direction="row" sx={{ display: "flex", gap: "25px" }}>
                            <div style={textFieldStyle}>
                                <label>Name</label>
                                <input
                                    style={{ height: "40px", borderRadius: "8px", border: error.name ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='name'
                                    value={data.name}
                                    type='text'
                                    pattern="[A-Za-z\s]*"
                                    title="Only alphabets are allowed"
                                />
                                {error.name && <span style={{ color: 'red', fontSize: '12px' }}>{error.name}</span>}
                            </div>

                            <div style={textFieldStyle}>
                                <label>Address</label>
                                <input
                                    style={{ height: "40px", borderRadius: "8px", border: error.address ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='address'
                                    value={data.address}
                                />
                                {error.address && <span style={{ color: 'red', fontSize: '12px' }}>{error.address}</span>}
                            </div>
                        </Stack>
                        <Stack direction={'row'} sx={{ display: "flex", gap: "25px" }}>
                            <div style={textFieldStyle}>
                                <label>Email</label>
                                <input
                                    style={{ height: "40px", borderRadius: "8px", border: error.email ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='email'
                                    value={data.email}
                                    type='email'
                                />
                                {error.email && <span style={{ color: 'red', fontSize: '12px' }}>{error.email}</span>}
                            </div>
                            <div style={textFieldStyle}>
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        style={{
                                            height: "40px",
                                            borderRadius: "8px",
                                            border: error.password ? "1px solid red" : "1px solid #CCCCCC",
                                            padding: '8px',
                                            width: '100%'
                                        }}
                                        onChange={handleDataChange}
                                        name='password'
                                        value={data.password}
                                        type={showPassword ? "text" : "password"}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </div>
                                </div>
                                {error.password && <span style={{ color: 'red', fontSize: '12px' }}>{error.password}</span>}
                            </div>
                        </Stack>
                        <Stack direction={'row'} sx={{ display: "flex", gap: "25px" }}>
                            <div style={textFieldStyle}>
                                <label>Phone Number</label>
                                <input
                                    style={{ height: "40px", borderRadius: "8px", border: error.phone ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='phone'
                                    value={data.phone}
                                    type='tel'
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    maxLength={10}
                                    title="Please enter exactly 10 digits"
                                />
                                {error.phone && <span style={{ color: 'red', fontSize: '12px' }}>{error.phone}</span>}
                            </div>
                            <div style={textFieldStyle}>
                                <label>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        style={{
                                            height: "40px",
                                            borderRadius: "8px",
                                            border: error.confirmPassword ? "1px solid red" : "1px solid #CCCCCC",
                                            padding: '8px',
                                            width: '100%'
                                        }}
                                        onChange={handleDataChange}
                                        name='confirmPassword'
                                        value={data.confirmPassword}
                                        type={showConfirmPassword ? "text" : "password"}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </div>
                                </div>
                                {error.confirmPassword && <span style={{ color: 'red', fontSize: '12px' }}>{error.confirmPassword}</span>}
                            </div>
                        </Stack>

                        <Stack direction={'row'}>
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                <Checkbox
                                    checked={checked}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                <Typography sx={{ fontSize: "14px", fontWeight: "500" }}>
                                    Aggred to <span style={{ color: "#1967D2" }}>Terms and Conditions</span>
                                </Typography>
                            </Box>
                        </Stack>
                        {error.terms && <span style={{ color: 'red', fontSize: '12px', marginTop: "-30px" }}>{error.terms}</span>}
                    </Box>

                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px' }}>
                        <Button
                            variant='contained'
                            color='secondary'
                            sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                            onClick={handleSubmit}
                        >
                            Sign up
                        </Button>
                        <Typography>
                            Already have an account? <Link to="/parent/login"><span style={{ textDecoration: "underline" }}>Sign in</span></Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
            <Footer userRole="parent" />         </>
    )
}

export default ParentSiginIn