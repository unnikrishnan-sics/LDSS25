import React, { useState } from 'react';
import ParentNavbarSiginIn from '../Parent/ParentNavbarSiginIn'
import { Container, Stack, Typography, Box, TextField, styled, InputAdornment, Checkbox, Button, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import profileFrame from "../../assets/profileFrame.png";
import background from "../../assets/Frame 12.png"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Footer from '../Footer/Footer';
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EducatorPersonal = () => {
    const StyledTextField = styled(TextField)({
        borderRadius: "8px",
        width: "100%",
        border: "1px solid #CCCCCC",
        '& .MuiInputBase-root': {
            height: "40px",
            padding: "0px",

            '& .MuiInputBase-input': {
                padding: '10px 0px',
            } // Adjust height within the input area
        }
    });

    const StyledSelect = styled(Select)({
        borderRadius: '8px',
        width: '100%',
        border: '1px solid #CCCCCC',
        '& .MuiInputBase-root': {
            height: '40px',
            padding: '0px',

            '& .MuiSelect-select': {
                padding: '10px 0px', // Padding inside the dropdown
            },
        },
    });

    const [data, setData] = useState({
        educationalQualification: "",
        yearsOfExperience: "",
        languages: "",
        availability: "",
        certification: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
        setError({
            ...error,
            [name]: "",
        })

    };
    const [imagePreview, setImagePreview] = useState(null);
    const handlefileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(prev => {
                return { ...prev, certification: file }
            });
            const objectURL = URL.createObjectURL(file);
            setImagePreview(objectURL);
        }
        setError({
            ...error,
            certification: "",
        })
    }


    const [selectimage, setselectimage] = useState(false);
    const handleSelectImage = () => {
        setselectimage(true);
    }
    const [error, setError] = useState({})
    const validation = () => {
        let errorMessage = {};
        let isValid = false;
        if (!data.educationalQualification) {
            errorMessage.educationalQualification = "Educational qualification is required";
            isValid = true;

        }
        if (!data.yearsOfExperience) {
            errorMessage.yearsOfExperience = "Years of experience is required";
            isValid = true;
        }
        if (!data.languages) {
            errorMessage.languages = "Language is required";
            isValid = true;
        }
        if (!data.availability) {
            errorMessage.availability = "Availability is required";
            isValid = true;
        }
        if (!data.certification) {
            errorMessage.certification = "Certification is required";
            isValid = true;
        }
        setError(errorMessage);
        return isValid;

    }
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validation()) {
            return;
        }
        console.log(data);
        const formData = new FormData();
        formData.append("educationalQualification", data.educationalQualification);
        formData.append("yearsOfExperience", data.yearsOfExperience);
        formData.append("languages", data.languages);
        formData.append("availability", data.availability);
        formData.append("certification", data.certification);

        const educatorDetails = localStorage.getItem("educatorDetails");
        const educatorId = JSON.parse(educatorDetails)._id;
        const token = localStorage.getItem("token")

        const addEducatorInfo = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/addpersonal/${educatorId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,

            }
        });
        console.log(addEducatorInfo);
        if (addEducatorInfo.data.message === "educator personal details added successfully.") {
            toast.success("Educator personal details added successfully.");
            localStorage.setItem("educatorDetails", JSON.stringify(addEducatorInfo.data.educator));
            navigate("/educator/profile");
        }
    };


    return (
        <>
            <ParentNavbarSiginIn />
            <Container sx={{ position: "relative" }} maxWidth="x-lg">
                <Box component="img" src={background} sx={{ position: "absolute", top: 110, left: 0, objectFit: 'cover', zIndex: -1 }}></Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Typography variant='h2' color='primary' sx={{ fontSize: "32px", fontWeight: "600", marginTop: "100px" }}>Personal info</Typography>
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "293px", flexDirection: "column", marginTop: '10px' }}>
                        <Stack direction="row" sx={{ display: "flex", gap: "25px" }}>
                            <Box sx={{ height: '65px', width: '360px' }}>
                                <label>Educational Qualification</label>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel></InputLabel>
                                    <StyledSelect
                                        value={data.educationalQualification}
                                        onChange={handleChange}
                                        name="educationalQualification"
                                        inputProps={{ 'aria-label': 'Option' }}
                                        sx={{ height: "40px" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="literature">literature</MenuItem>
                                        <MenuItem value="Science">Science</MenuItem>
                                        <MenuItem value="Maths">Maths</MenuItem>
                                    </StyledSelect>
                                </FormControl>
                                {error.educationalQualification && <span style={{ color: 'red', fontSize: '12px' }}>{error.educationalQualification}</span>}
                            </Box>

                            <Box sx={{ height: "65px", width: "360px" }}>
                                <label>Years of Experience</label>
                                <StyledTextField type='number'
                                    name="yearsOfExperience"
                                    value={data.yearsOfExperience}
                                    onChange={handleChange}
                                    sx={{ height: "40px" }} />
                                {error.yearsOfExperience && <span style={{ color: 'red', fontSize: '12px' }}>{error.yearsOfExperience}</span>}
                            </Box>

                        </Stack>
                        <Stack direction={'row'} sx={{ display: "flex", gap: "25px" }}>
                            <Box sx={{ height: '65px', width: '360px' }}>
                                <label>Languages</label>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel></InputLabel>
                                    <StyledSelect
                                        value={data.languages}
                                        onChange={handleChange}
                                        inputProps={{ 'aria-label': 'Option' }}
                                        name="languages"
                                        sx={{ height: "40px" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="Chennai"> Tamil</MenuItem>
                                        <MenuItem value="Banglore">English</MenuItem>
                                        <MenuItem value="Delhi">Hindi</MenuItem>
                                        <MenuItem value="Mumbai"> Telugu</MenuItem>
                                    </StyledSelect>
                                </FormControl>
                                {error.languages && <span style={{ color: 'red', fontSize: '12px' }}>{error.languages}</span>}
                            </Box>

                            <Box sx={{ height: '65px', width: '360px' }}>
                                <label>Availability</label>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel></InputLabel>
                                    <StyledSelect
                                        value={data.availability}
                                        onChange={handleChange}
                                        name='availability'
                                        inputProps={{ 'aria-label': 'Option' }}
                                        sx={{ height: "40px" }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="Full time">Full time</MenuItem>
                                        <MenuItem value="Part timeout">Part timeout</MenuItem>
                                        <MenuItem value="Weekend">Weekend</MenuItem>
                                    </StyledSelect>
                                </FormControl>
                                {error.availability && <span style={{ color: 'red', fontSize: '12px' }}>{error.availability}</span>}
                            </Box>

                        </Stack>
                        <Stack direction={'row'} sx={{ display: "flex", gap: "25px" }}>
                            <Box display={"flex"} flexDirection={"column"} sx={{ height: '65px', width: '744px' }}>
                                <label>Certification</label>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    id="fileInput"
                                    name="certification"
                                    accept=".pdf, .png, .jpg, .jpeg"
                                    style={{ display: 'none', width: "100%" }}
                                    onChange={handlefileChange}
                                    onClick={handleSelectImage}
                                />

                                {/* Label triggers the input click */}
                                <label htmlFor="fileInput">
                                    <TextField
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {data.certification ? (
                                                        <Typography sx={{ fontSize: '14px', color: '#4CAF50' }}>File Selected</Typography>
                                                    ) : (
                                                        <UploadIcon sx={{ cursor: 'pointer' }} />
                                                    )}

                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </label>
                                {error.certification && <span style={{ color: 'red', fontSize: '12px' }}>{error.certification}</span>}
                            </Box>


                        </Stack>

                    </Box>
                    {/*  */}
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', gap: '10px', mb: "60px" }}>
                        <Button onClick={handleSubmit} variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "10px", height: "40px", width: '150px', padding: '10px 35px' }}>Confirm</Button>


                    </Box>
                </Box>

            </Container>
            <Footer userRole="educator" />        </>
    )
}

export default EducatorPersonal
