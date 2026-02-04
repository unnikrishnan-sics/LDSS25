import React, { useEffect, useState } from 'react'
import TheraphistNavbar from '../Navbar/TheraphistNavbar';
import { Avatar, Box, Breadcrumbs, Button, Container, Fade, Modal, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneEnabledOutlinedIcon from '@mui/icons-material/PhoneEnabledOutlined';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import background from "../../assets/Frame 12.png";
import profileFrame from "../../assets/profileFrame.png";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const TheraphistProfile = () => {
    const profilebg = {
        backgroundColor: "white"
    };
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }
    const styleLogout = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
    };
    const styleEditBox = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '840px',
        height: 'auto',
        bgcolor: 'white',
        borderRadius: "20px",
        boxShadow: 24,
        p: 4,
    };
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phone: "",
        profilePic: null
    });

    // Personal Info state
    const [personalInfo, setPersonalInfo] = useState({
        educationalQualification: "",
        yearsOfExperience: "",
        languages: "",
        availability: "",
        certification: null
    });

    const [personalInfoError, setPersonalInfoError] = useState({});

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({
            ...prev,
            [name]: value
        }));
        setPersonalInfoError(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const handlePersonalInfoFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPersonalInfo(prev => ({
                ...prev,
                certification: file
            }));
        }
    };

    const handleDataChange = (e) => {
        const { name, value } = e.target;

        // Validation for name field (only alphabets)
        if (name === 'name') {
            const regex = /^[A-Za-z\s]*$/;
            if (!regex.test(value)) return;
        }

        // Validation for phone field (only numbers)
        if (name === 'phone') {
            const regex = /^\d*$/;
            if (!regex.test(value)) return;
        }

        setError((prevError) => ({
            ...prevError,
            [name]: ""
        }));

        setData(prev => {
            return { ...prev, [name]: value }
        })
    };

    const [imagePreview, setImagePreview] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(prev => {
                return { ...prev, profilePic: file }
            });
            const objectURL = URL.createObjectURL(file);
            setImagePreview(objectURL);
        }
    };

    const [theraphistdetails, setTheraphistdetails] = useState({});

    useEffect(() => {
        const theraphistdetails = localStorage.getItem("theraphistDetails");
        if (theraphistdetails) {
            setTheraphistdetails(JSON.parse(theraphistdetails));
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("theraphistDetails") == null) {
            navigate("/");
        }
    });

    const [error, setError] = useState({})

    // Personal Info validation
    const validatePersonalInfo = () => {
        let isValid = true;
        let errorMessage = {};

        if (!personalInfo.educationalQualification.trim()) {
            errorMessage.educationalQualification = "Educational qualification is required";
            isValid = false;
        }

        if (!personalInfo.yearsOfExperience) {
            errorMessage.yearsOfExperience = "Years of experience is required";
            isValid = false;
        } else if (isNaN(personalInfo.yearsOfExperience)) {
            errorMessage.yearsOfExperience = "Years of experience must be a number";
            isValid = false;
        } else if (personalInfo.yearsOfExperience < 0) {
            errorMessage.yearsOfExperience = "Years of experience cannot be negative";
            isValid = false;
        }

        if (!personalInfo.languages.trim()) {
            errorMessage.languages = "Languages are required";
            isValid = false;
        }

        if (!personalInfo.availability.trim()) {
            errorMessage.availability = "Availability is required";
            isValid = false;
        }

        setPersonalInfoError(errorMessage);
        return isValid;
    };

    // Submit Personal Info
    const handlePersonalInfoSubmit = async (e) => {
        e.preventDefault();
        const isValid = validatePersonalInfo();
        if (!isValid) return;

        try {
            const formData = new FormData();
            formData.append('educationalQualification', personalInfo.educationalQualification);
            formData.append('yearsOfExperience', personalInfo.yearsOfExperience);
            formData.append('languages', personalInfo.languages);
            formData.append('availability', personalInfo.availability);
            if (personalInfo.certification) {
                formData.append('certification', personalInfo.certification);
            }

            const token = localStorage.getItem("token");
            const updated = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/addpersonal/${theraphistdetails._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );

            if (updated.data.message === "theraphist personal details added successfully.") {
                toast.success("Personal info updated successfully");

                // Refresh therapist details
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${theraphistdetails._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                localStorage.setItem("theraphistDetails", JSON.stringify(res.data.theraphist));
                setTheraphistdetails(res.data.theraphist);
                setPersonalInfoOpen(false);
            } else {
                toast.error("Error updating personal info");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating personal info");
        }
    };

    const validation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[A-Za-z\s]{3,20}$/;

        // Name validation
        if (!data.name.trim()) {
            errorMessage.name = "Name should not be empty";
            isValid = false;
        } else if (!nameRegex.test(data.name)) {
            errorMessage.name = "Name should contain only alphabets and be 3 to 20 characters long";
            isValid = false;
        }

        // Email validation
        if (!data.email.trim()) {
            errorMessage.email = "Email should not be empty";
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            errorMessage.email = "Invalid email address";
            isValid = false;
        }

        // Address validation
        if (!data.address.trim()) {
            errorMessage.address = "Address should not be empty";
            isValid = false;
        } else if (data.address.length < 10) {
            errorMessage.address = "Address should be at least 10 characters long";
            isValid = false;
        }

        // Phone validation
        if (!data.phone) {
            errorMessage.phone = "Phone number should not be empty";
            isValid = false;
        } else if (!/^\d{10}$/.test(data.phone)) {
            errorMessage.phone = "Phone number must be exactly 10 digits";
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

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        if (data.profilePic) {
            formData.append('profilePic', data.profilePic);
        }

        const token = localStorage.getItem("token");
        try {
            const updated = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/updatetheraphist/${theraphistdetails._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );

            if (updated.data.message === "theraphist updated successfully.") {
                toast.success("Therapist updated successfully");

                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/gettheraphist/${theraphistdetails._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                localStorage.setItem("theraphistDetails", JSON.stringify(res.data.theraphist));
                setTheraphistdetails(res.data.theraphist);
                setEditOpen(false);
            } else {
                toast.error("Error in updating therapist profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error in updating therapist profile");
        }
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditOpen = () => {
        setData({
            name: theraphistdetails.name || "",
            email: theraphistdetails.email || "",
            address: theraphistdetails.address || "",
            phone: theraphistdetails.phone || "",
            profilePic: null,
        });
        setImagePreview(theraphistdetails?.profilePic?.filename
            ? `${import.meta.env.VITE_SERVER_URL}/uploads/${theraphistdetails?.profilePic?.filename}`
            : null);
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);

    // Personal Info Modal
    const [personalInfoOpen, setPersonalInfoOpen] = React.useState(false);
    const handlePersonalInfoOpen = () => {
        setPersonalInfo({
            educationalQualification: theraphistdetails.educationalQualification || "",
            yearsOfExperience: theraphistdetails.yearsOfExperience || "",
            languages: theraphistdetails.languages || "",
            availability: theraphistdetails.availability || "",
            certification: null
        });
        setPersonalInfoOpen(true);
    };
    const handlePersonalInfoClose = () => setPersonalInfoOpen(false);

    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('theraphistDetails');
        navigate('/therapist/login');
        toast.success("You have been logged out");
    };

    return (
        <>
            <TheraphistNavbar theraphistdetails={theraphistdetails} />

            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open}>
                        <Box sx={styleLogout}>
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Logout</Typography>
                                <CloseIcon onClick={handleClose} sx={{ fontSize: "18px" }} />
                            </Box>
                            <hr />
                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                                <Typography color='primary' sx={{ fontSize: "12px", fontWeight: '500' }} variant='p'>Are you sure you want to log out?</Typography>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ gap: "10px" }}>
                                    <Button variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleLogOut}>Yes</Button>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleClose}>No</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </div>

            {/* Edit modal */}
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={editOpen}
                    onClose={handleEditClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={editOpen}>
                        <Box sx={styleEditBox}>
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit Profile</Typography>
                                <CloseIcon onClick={handleEditClose} sx={{ fontSize: "18px" }} />
                            </Box>
                            <hr />
                            <Container sx={{ position: "relative" }} maxWidth="x-lg">
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                        <Stack spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                            <input
                                                type="file"
                                                id="profile-upload"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                style={{ display: "none" }}
                                            />
                                            <label htmlFor="profile-upload" style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                                                <Box component="img" src={imagePreview ? imagePreview : profileFrame} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%" }}></Box>
                                                {imagePreview ? <Typography></Typography> : <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ Add image</Typography>}
                                            </label>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "154px", flexDirection: "column", marginTop: '30px' }}>
                                        <Stack direction="row" sx={{ display: "flex", gap: "15px" }}>
                                            <div style={textFieldStyle}>
                                                <label>Name</label>
                                                <input
                                                    style={{ height: "40px", borderRadius: "8px", border: error.name ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handleDataChange}
                                                    name='name'
                                                    value={data.name}
                                                    type='text'
                                                    placeholder="Enter your name"
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
                                                    placeholder="Enter your address"
                                                />
                                                {error.address && <span style={{ color: 'red', fontSize: '12px' }}>{error.address}</span>}
                                            </div>
                                        </Stack>
                                        <Stack direction={'row'} sx={{ display: "flex", gap: "15px" }}>
                                            <div style={textFieldStyle}>
                                                <label>Email</label>
                                                <input
                                                    style={{ height: "40px", borderRadius: "8px", border: error.email ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handleDataChange}
                                                    name='email'
                                                    value={data.email}
                                                    type="email"
                                                    placeholder="Enter your email"
                                                />
                                                {error.email && <span style={{ color: 'red', fontSize: '12px' }}>{error.email}</span>}
                                            </div>
                                            <div style={textFieldStyle}>
                                                <label>Phone Number</label>
                                                <input
                                                    style={{ height: "40px", borderRadius: "8px", border: error.phone ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handleDataChange}
                                                    name='phone'
                                                    value={data.phone}
                                                    type='tel'
                                                    maxLength="10"
                                                    placeholder="Enter 10-digit phone number"
                                                />
                                                {error.phone && <span style={{ color: 'red', fontSize: '12px' }}>{error.phone}</span>}
                                            </div>
                                        </Stack>
                                    </Box>
                                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px' }}>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                                            onClick={handleSubmit}
                                        >
                                            Confirm
                                        </Button>
                                    </Box>
                                </Box>
                            </Container>
                        </Box>
                    </Fade>
                </Modal>
            </div>

            {/* Personal Info Edit Modal */}
            <div>
                <Modal
                    aria-labelledby="personal-info-modal-title"
                    aria-describedby="personal-info-modal-description"
                    open={personalInfoOpen}
                    onClose={handlePersonalInfoClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={personalInfoOpen}>
                        <Box sx={styleEditBox}>
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit Personal Info</Typography>
                                <CloseIcon onClick={handlePersonalInfoClose} sx={{ fontSize: "18px" }} />
                            </Box>
                            <hr />
                            <Container sx={{ position: "relative" }} maxWidth="x-lg">
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "auto", flexDirection: "column", marginTop: '30px', width: '100%' }}>
                                        <Stack direction="row" sx={{ display: "flex", gap: "15px", width: '100%' }}>
                                            <div style={textFieldStyle}>
                                                <label>Educational Qualification</label>
                                                <input
                                                    style={{ height: "40px", borderRadius: "8px", border: personalInfoError.educationalQualification ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handlePersonalInfoChange}
                                                    name='educationalQualification'
                                                    value={personalInfo.educationalQualification}
                                                    type='text'
                                                    placeholder="Enter your qualifications"
                                                />
                                                {personalInfoError.educationalQualification && <span style={{ color: 'red', fontSize: '12px' }}>{personalInfoError.educationalQualification}</span>}
                                            </div>
                                            <div style={textFieldStyle}>
                                                <label>Years of Experience</label>
                                                <input
                                                    style={{ height: "40px", borderRadius: "8px", border: personalInfoError.yearsOfExperience ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handlePersonalInfoChange}
                                                    name='yearsOfExperience'
                                                    value={personalInfo.yearsOfExperience}
                                                    type='number'
                                                    min="0"
                                                    placeholder="Enter years of experience"
                                                />
                                                {personalInfoError.yearsOfExperience && <span style={{ color: 'red', fontSize: '12px' }}>{personalInfoError.yearsOfExperience}</span>}
                                            </div>
                                        </Stack>
                                        <Stack direction={'row'} sx={{ display: "flex", gap: "15px", width: '100%' }}>
                                            <div style={textFieldStyle}>
                                                <label>Languages</label>
                                                <input
                                                    style={{ height: "40px", borderRadius: "8px", border: personalInfoError.languages ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handlePersonalInfoChange}
                                                    name='languages'
                                                    value={personalInfo.languages}
                                                    placeholder="Enter languages you speak"
                                                />
                                                {personalInfoError.languages && <span style={{ color: 'red', fontSize: '12px' }}>{personalInfoError.languages}</span>}
                                            </div>
                                            <div style={textFieldStyle}>
                                                <label>Availability</label>
                                                <input
                                                    style={{ height: "40px", borderRadius: "8px", border: personalInfoError.availability ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handlePersonalInfoChange}
                                                    name='availability'
                                                    value={personalInfo.availability}
                                                    placeholder="Enter your availability"
                                                />
                                                {personalInfoError.availability && <span style={{ color: 'red', fontSize: '12px' }}>{personalInfoError.availability}</span>}
                                            </div>
                                        </Stack>
                                        <Stack direction={'row'} sx={{ display: "flex", gap: "15px", width: '100%' }}>
                                            <div style={textFieldStyle}>
                                                <label>Certification</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handlePersonalInfoFileUpload}
                                                    style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                                                />
                                                {theraphistdetails.certification?.filename && (
                                                    <Typography variant="caption" sx={{ fontSize: "12px", mt: 1 }}>
                                                        Current file: {theraphistdetails.certification.filename}
                                                    </Typography>
                                                )}
                                            </div>
                                        </Stack>
                                    </Box>
                                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px', mt: 3 }}>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }}
                                            onClick={handlePersonalInfoSubmit}
                                        >
                                            Update Personal Info
                                        </Button>
                                    </Box>
                                </Box>
                            </Container>
                        </Box>
                    </Fade>
                </Modal>
            </div>

            <Box sx={{ background: "white" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Profile</Typography>
                </Box>
                {!theraphistdetails.languages &&
                    <Button
                        variant="contained"
                        color='secondary'
                        sx={{ borderRadius: "15px", mt: "10px", p: "10px 20px", width: "100%" }}
                        onClick={handlePersonalInfoOpen}
                    >
                        Add personal details
                    </Button>
                }
                <Box display={"flex"} justifyContent={"start"} alignItems={"start"} flexDirection={"column"} sx={{ mt: "20px", ml: "50px", mr: "50px", height: '320px' }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Profile</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ height: "260px", background: '#F6F7F9', borderRadius: "20px", width: "100%", padding: "0px 60px" }}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "180px", gap: "70px" }}>
                            {
                                theraphistdetails.profilePic?.filename ? (
                                    <Avatar sx={{ height: "100%", width: "180px" }}
                                        src={`${import.meta.env.VITE_SERVER_URL}/uploads/${theraphistdetails?.profilePic?.filename}`} alt={theraphistdetails?.name}
                                    />
                                ) :
                                    (
                                        <Avatar sx={{ height: "100%", width: "180px" }}>
                                            {theraphistdetails?.name?.charAt(0)}
                                        </Avatar>
                                    )
                            }
                            <Box display={"flex"} justifyContent={"center"} alignItems={"start"} flexDirection={"column"} sx={{ gap: "40px" }} >
                                {theraphistdetails.name && <Typography color='primary' sx={{ fontSize: "32px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }} onClick={handleEditOpen}>{theraphistdetails.name}
                                    <BorderColorOutlinedIcon />
                                </Typography>}
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ gap: "100px" }}>
                                    <Box display={"flex"} justifyContent={"start"} alignItems={"start"} flexDirection={"column"} sx={{ gap: "20px" }}>
                                        {theraphistdetails.name && <Typography> <PersonOutlinedIcon /> {theraphistdetails.name}</Typography>}
                                        {theraphistdetails.email && <Typography> <MailOutlinedIcon /> {theraphistdetails.email}</Typography>}
                                    </Box>
                                    <Box display={"flex"} justifyContent={"start"} alignItems={"start"} flexDirection={"column"} sx={{ gap: "20px", borderLeft: "1px solid #CCCCCC", ml: "50px", pl: "40px" }} >
                                        {theraphistdetails.address && <Typography> <LocationOnOutlinedIcon /> {theraphistdetails.address}</Typography>}
                                        {
                                            theraphistdetails.phone && <Typography> <PhoneEnabledOutlinedIcon /> {theraphistdetails.phone}</Typography>
                                        }
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ marginBottom: "170px" }}>
                            <Button startIcon={<LogoutOutlinedIcon />} variant="text" onClick={handleOpen}>Logout</Button>
                        </Box>
                    </Box>
                </Box>

                {/* personal info */}
                {theraphistdetails.certification &&
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"start"} sx={{ height: "323px", background: '#F6F7F9', borderRadius: "20px", width: "100%", padding: "20px 60px", mt: "50px", flexDirection: "column" }}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"start"} flexDirection={"column"} sx={{ gap: "30px" }} >
                            <Box>
                                <Typography color='primary' sx={{ fontSize: "24px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                                    Personal Info
                                    <BorderColorOutlinedIcon onClick={handlePersonalInfoOpen} style={{ cursor: "pointer" }} />
                                </Typography>
                            </Box>
                            <Box sx={{ gap: "400px" }} width={"100%"} display={"flex"} justifyContent={"space-between"} alignItems={"start"}>
                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"} gap={3}>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography color='secondary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>Educational Qualifications</Typography>
                                        <Typography color='primary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>{theraphistdetails.educationalQualification}</Typography>
                                    </Box>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography color='secondary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>Language</Typography>
                                        <Typography color='primary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>{theraphistdetails.languages}</Typography>
                                    </Box>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography color='secondary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>Certification</Typography>
                                        <Typography color='primary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>{theraphistdetails.certification?.filename || "Not uploaded"}</Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"} gap={3} sx={{ borderLeft: "1px solid black" }}>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"} ml={5}>
                                        <Typography color='secondary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>Years of Experience</Typography>
                                        <Typography color='primary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>{theraphistdetails.yearsOfExperience}</Typography>
                                    </Box>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"} ml={5}>
                                        <Typography color='secondary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>Availability</Typography>
                                        <Typography color='primary' variant='p' sx={{ fontSize: "12px", fontWeight: "600" }}>{theraphistdetails.availability}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                }
            </Box>
        </>
    );
};

export default TheraphistProfile;