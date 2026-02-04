import React, { useState } from 'react';
import ParentNavbarSiginIn from '../Parent/ParentNavbarSiginIn'
import { Container, Stack, Typography, Box, Checkbox, Button } from '@mui/material';
import profileFrame from "../../assets/profileFrame.png";
import background from "../../assets/Frame 12.png"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EducatorRegistration = () => {
    const textFieldStyle = {
        height: "65px",
        width: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        position: "relative"
    };

    const siginupStyle = {
        background: "white",
        boxShadow: "none"
    };

    const [checked, setChecked] = React.useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState({});
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

    const navigate = useNavigate();

    const handleChange = (event) => {
        setChecked(event.target.checked);
        if (event.target.checked) {
            setError(prevError => ({
                ...prevError,
                terms: ""
            }));
        }
    };

    const handleDataChange = (e) => {
        const { name, value } = e.target;

        // Clear any existing error for this field
        setError(prevError => ({
            ...prevError,
            [name]: ""
        }));

        // Special validation for name field (only letters and spaces)
        if (name === 'name') {
            if (/^[a-zA-Z ]*$/.test(value) || value === '') {
                setData(prev => ({ ...prev, [name]: value }));
            }
            return;
        }

        // Special validation for phone field (only numbers, max 10 digits)
        if (name === 'phone') {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setData(prev => ({ ...prev, [name]: value }));
            }
            return;
        }

        // For all other fields
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                setError(prevError => ({
                    ...prevError,
                    profilePic: "Please upload an image file"
                }));
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError(prevError => ({
                    ...prevError,
                    profilePic: "File size should be less than 2MB"
                }));
                return;
            }

            setData(prev => ({
                ...prev,
                profilePic: file
            }));

            const objectURL = URL.createObjectURL(file);
            setImagePreview(objectURL);
            setError(prevError => ({
                ...prevError,
                profilePic: ""
            }));
        }
    };

    const validation = () => {
        let isValid = true;
        let errorMessage = {};

        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Password regex (min 6 chars, at least one uppercase, one lowercase, one number, one special char)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;

        // Name validation
        if (!data.name.trim()) {
            errorMessage.name = "Name is required";
            isValid = false;
        } else if (data.name.length < 3 || data.name.length > 20) {
            errorMessage.name = "Name should be 3 to 20 characters";
            isValid = false;
        } else if (!/^[a-zA-Z ]+$/.test(data.name)) {
            errorMessage.name = "Name should contain only letters";
            isValid = false;
        }

        // Email validation
        if (!data.email.trim()) {
            errorMessage.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            errorMessage.email = "Invalid email address";
            isValid = false;
        }

        // Password validation
        if (!data.password.trim()) {
            errorMessage.password = "Password is required";
            isValid = false;
        } else if (!passwordRegex.test(data.password)) {
            errorMessage.password = "Password must contain at least one uppercase, one lowercase, one number, one special character (6-15 chars)";
            isValid = false;
        }

        // Confirm password validation
        if (!data.confirmPassword.trim()) {
            errorMessage.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (data.password !== data.confirmPassword) {
            errorMessage.confirmPassword = "Passwords do not match";
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
        } else if (data.phone.length !== 10) {
            errorMessage.phone = "Phone number must be 10 digits";
            isValid = false;
        } else if (!/^\d+$/.test(data.phone)) {
            errorMessage.phone = "Phone number should contain only digits";
            isValid = false;
        }

        // Profile picture validation
        if (!data.profilePic) {
            errorMessage.profilePic = "Profile picture is required";
            isValid = false;
        }

        // Terms and conditions validation
        if (!checked) {
            errorMessage.terms = "You must accept the terms and conditions";
            isValid = false;
        }

        setError(errorMessage);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validation();
        if (!isValid) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('confirmpassword', data.confirmPassword);
            formData.append('address', data.address);
            formData.append('phone', data.phone);
            formData.append('profilePic', data.profilePic);
            formData.append('agreed', checked);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/educator/registration`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const result = response.data;

            if (result.message === "educator already registered with this phone number") {
                toast.error("You have already registered with this phone number");
            } else if (result.message === "educator already registered with this email") {
                toast.error("You have already registered with this email");
            } else if (result.message === "educator created successfully") {
                // Reset form
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

                toast.success("Educator profile created successfully!");
                navigate("/educator/login");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <ParentNavbarSiginIn siginupStyle={siginupStyle} />
            <Container sx={{ position: "relative", mb: "50px", siginupStyle }} maxWidth="x-lg">
                <Box
                    component="img"
                    src={background}
                    sx={{
                        position: "absolute",
                        top: 110,
                        left: 0,
                        objectFit: 'cover',
                        zIndex: -1
                    }}
                />

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    {/* Profile Picture Upload */}
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Stack spacing={2} sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            marginTop: "60px"
                        }}>
                            <input
                                type="file"
                                id="profile-upload"
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                            />

                            <Typography
                                variant='h2'
                                color='primary'
                                sx={{
                                    fontSize: "32px",
                                    fontWeight: "600"
                                }}
                            >
                                Sign Up!
                            </Typography>

                            <label
                                htmlFor="profile-upload"
                                style={{
                                    cursor: "pointer",
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "15px"
                                }}
                            >
                                <Box
                                    component="img"
                                    src={imagePreview || profileFrame}
                                    alt='profilepic'
                                    sx={{
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        border: error.profilePic ? "2px solid red" : "none"
                                    }}
                                />
                                {imagePreview ? null : (
                                    <Typography
                                        variant='p'
                                        color='primary'
                                        sx={{
                                            fontSize: "12px",
                                            fontWeight: "500"
                                        }}
                                    >
                                        + add image
                                    </Typography>
                                )}
                            </label>
                            {error.profilePic && (
                                <span style={{ color: 'red', fontSize: '12px' }}>
                                    {error.profilePic}
                                </span>
                            )}
                        </Stack>
                    </Box>

                    {/* Registration Form */}
                    <Box sx={{
                        display: "flex",
                        justifyContent: 'center',
                        alignItems: "start",
                        gap: "30px",
                        height: "293px",
                        flexDirection: "column",
                        marginTop: '30px'
                    }}>
                        {/* Name and Address */}
                        <Stack direction="row" sx={{ display: "flex", gap: "25px" }}>
                            <div style={textFieldStyle}>
                                <label>Name</label>
                                <input
                                    style={{
                                        height: "40px",
                                        borderRadius: "8px",
                                        border: error.name ? "1px solid red" : "1px solid #CCCCCC",
                                        padding: '8px'
                                    }}
                                    onChange={handleDataChange}
                                    name='name'
                                    value={data.name}
                                    type='text'
                                />
                                {error.name && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        {error.name}
                                    </span>
                                )}
                            </div>

                            <div style={textFieldStyle}>
                                <label>Address</label>
                                <input
                                    style={{
                                        height: "40px",
                                        borderRadius: "8px",
                                        border: error.address ? "1px solid red" : "1px solid #CCCCCC",
                                        padding: '8px'
                                    }}
                                    onChange={handleDataChange}
                                    name='address'
                                    value={data.address}
                                />
                                {error.address && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        {error.address}
                                    </span>
                                )}
                            </div>
                        </Stack>

                        {/* Email and Password */}
                        <Stack direction={'row'} sx={{ display: "flex", gap: "25px" }}>
                            <div style={textFieldStyle}>
                                <label>Email</label>
                                <input
                                    style={{
                                        height: "40px",
                                        borderRadius: "8px",
                                        border: error.email ? "1px solid red" : "1px solid #CCCCCC",
                                        padding: '8px'
                                    }}
                                    onChange={handleDataChange}
                                    name='email'
                                    value={data.email}
                                    type='email'
                                />
                                {error.email && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        {error.email}
                                    </span>
                                )}
                            </div>

                            <div style={textFieldStyle}>
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        style={{
                                            height: "40px",
                                            width: "100%",
                                            borderRadius: "8px",
                                            border: error.password ? "1px solid red" : "1px solid #CCCCCC",
                                            padding: '8px',
                                            paddingRight: '40px'
                                        }}
                                        onChange={handleDataChange}
                                        name='password'
                                        value={data.password}
                                        type={showPassword ? "text" : "password"}
                                    />
                                    {showPassword ? (
                                        <VisibilityIcon
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                            onClick={togglePasswordVisibility}
                                        />
                                    ) : (
                                        <VisibilityOffIcon
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                            onClick={togglePasswordVisibility}
                                        />
                                    )}
                                </div>
                                {error.password && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        {error.password}
                                    </span>
                                )}
                            </div>
                        </Stack>

                        {/* Phone and Confirm Password */}
                        <Stack direction={'row'} sx={{ display: "flex", gap: "25px" }}>
                            <div style={textFieldStyle}>
                                <label>Phone Number</label>
                                <input
                                    style={{
                                        height: "40px",
                                        borderRadius: "8px",
                                        border: error.phone ? "1px solid red" : "1px solid #CCCCCC",
                                        padding: '8px'
                                    }}
                                    onChange={handleDataChange}
                                    name='phone'
                                    value={data.phone}
                                    type='tel'
                                    maxLength="10"
                                />
                                {error.phone && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        {error.phone}
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
                                            border: error.confirmPassword ? "1px solid red" : "1px solid #CCCCCC",
                                            padding: '8px',
                                            paddingRight: '40px'
                                        }}
                                        onChange={handleDataChange}
                                        name='confirmPassword'
                                        value={data.confirmPassword}
                                        type={showConfirmPassword ? "text" : "password"}
                                    />
                                    {showConfirmPassword ? (
                                        <VisibilityIcon
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                            onClick={toggleConfirmPasswordVisibility}
                                        />
                                    ) : (
                                        <VisibilityOffIcon
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                            onClick={toggleConfirmPasswordVisibility}
                                        />
                                    )}
                                </div>
                                {error.confirmPassword && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        {error.confirmPassword}
                                    </span>
                                )}
                            </div>
                        </Stack>

                        {/* Terms and Conditions */}
                        <Stack direction={'row'}>
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                <Checkbox
                                    checked={checked}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    sx={{
                                        color: error.terms ? 'red' : undefined,
                                        '&.Mui-checked': {
                                            color: error.terms ? 'red' : undefined,
                                        },
                                    }}
                                />
                                <Typography sx={{ fontSize: "14px", fontWeight: "500" }}>
                                    Agreed to <span style={{ color: "#1967D2" }}>Terms and Conditions</span>
                                </Typography>
                            </Box>
                        </Stack>
                        {error.terms && (
                            <span style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: "-30px",
                                marginLeft: "35px"
                            }}>
                                {error.terms}
                            </span>
                        )}
                    </Box>

                    {/* Submit Button */}
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}
                        sx={{ width: '253px', height: "93px", gap: '10px', marginTop: '20px' }}
                    >
                        <Button
                            variant='contained'
                            color='secondary'
                            sx={{
                                borderRadius: "25px",
                                height: "40px",
                                width: '200px',
                                padding: '10px 35px',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: '600'
                            }}
                            onClick={handleSubmit}
                        >
                            Sign up
                        </Button>

                        <Typography sx={{ fontSize: '14px' }}>
                            Already have an account?{' '}
                            <Link
                                to="/educator/login"
                                style={{
                                    textDecoration: "underline",
                                    color: '#1967D2',
                                    fontWeight: '500'
                                }}
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>

            <Footer userRole="educator" />        </>
    );
};

export default EducatorRegistration;