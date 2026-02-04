import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar } from '@mui/material';

const AdminViewSingleEducator = ({ handleEducatorClose, educatordetail, approve, rejectEducator }) => {

    // Helper function to display value or "Not Updated"
    const displayValue = (value) => {
        return value ? value : "Not Updated";
    }

    return (
        <>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ p: "0px 10px" }}>
                {educatordetail.isAdminApproved ? (
                    <Typography color='primary' variant='h5' sx={{ fontSize: "18px", fontWeight: "600" }}>Educator Details </Typography>
                ) : (
                    <Typography color='primary' variant='h5' sx={{ fontSize: "18px", fontWeight: "600" }}>Educator Request Details </Typography>
                )}

                <CloseIcon onClick={handleEducatorClose} />
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} sx={{ p: "0px 10px", mt: "40px", gap: "15px" }}>
                <Avatar
                    sx={{ height: "150px", width: "150px" }}
                    src={educatordetail.profilePic?.filename ?
                        `${import.meta.env.VITE_SERVER_URL}/uploads/${educatordetail.profilePic.filename}` :
                        undefined
                    }
                />
                <Typography color='primary' variant='h5' sx={{ fontSize: "24px", fontWeight: "500" }}>
                    {displayValue(educatordetail.name)}
                </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: "60px", gap: "30px" }}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"start"} sx={{ width: "400px", height: "155px", border: "1px solid black", borderRadius: "20px", gap: "10px" }}>
                    <Box display={"flex"} alignItems={"start"} gap={5} width={"100%"} flexDirection={"column"} >
                        <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Name</Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {displayValue(educatordetail.name)}
                            </Typography>
                        </Box>
                        <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Phone number</Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {displayValue(educatordetail.phone)}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display={"flex"} alignItems={"start"} gap={5} width={"100%"} flexDirection={"column"}>
                        <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>E-mail</Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {displayValue(educatordetail.email)}
                            </Typography>
                        </Box>
                        <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Language</Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {displayValue(educatordetail.languages)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"start"} sx={{ width: "400px", height: "155px", border: "1px solid black", borderRadius: "20px", gap: "10px" }}>
                    <Box display={"flex"} alignItems={"start"} gap={5} width={"100%"} flexDirection={"column"} >
                        <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Educational Qualifications</Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {displayValue(educatordetail.educationalQualification)}
                            </Typography>
                        </Box>
                        <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Availability</Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {displayValue(educatordetail.availability)}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display={"flex"} alignItems={"start"} gap={5} width={"100%"} flexDirection={"column"}>
                        <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Years Of Experience</Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {displayValue(educatordetail.yearsOfExperience)}
                            </Typography>
                        </Box>
                        <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Certifications</Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {educatordetail.certification?.originalname ?
                                    educatordetail.certification.originalname :
                                    "Not Updated"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {!educatordetail.isAdminApproved && (
                <Box display={"flex"} justifyContent={"center"} mt={2} mb={2} gap={3}>
                    <Button
                        onClick={() => rejectEducator(educatordetail._id)}
                        variant='outlined'
                        color='secondary'
                        sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={() => approve(educatordetail._id)}
                        variant='contained'
                        color='secondary'
                        sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                    >
                        Approve
                    </Button>
                </Box>
            )}
        </>
    )
}

export default AdminViewSingleEducator