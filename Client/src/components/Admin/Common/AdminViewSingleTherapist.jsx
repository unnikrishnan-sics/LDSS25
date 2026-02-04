import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar } from '@mui/material';

const AdminViewSingleTherapist = ({ theraphistdetail, handleTheraphistClose, approve, rejectTheraphist }) => {

  // Helper function to display value or "Not Updated"
  const displayValue = (value) => {
    return value ? value : "Not Updated";
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ p: "0px 10px" }}>
        {theraphistdetail.isAdminApproved ? (
          <Typography color='primary' variant='h5' sx={{ fontSize: "18px", fontWeight: "600" }}>Therapist Details </Typography>
        ) : (
          <Typography color='primary' variant='h5' sx={{ fontSize: "18px", fontWeight: "600" }}>Therapist Request Details </Typography>
        )}
        <CloseIcon onClick={handleTheraphistClose} />
      </Box>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} sx={{ p: "0px 10px", mt: "40px", gap: "15px" }}>
        <Avatar
          sx={{ height: "150px", width: "150px" }}
          src={theraphistdetail.profilePic?.filename ? `${import.meta.env.VITE_SERVER_URL}/uploads/${theraphistdetail.profilePic?.filename}` : ""}
        ></Avatar>
        <Typography color='primary' variant='h5' sx={{ fontSize: "24px", fontWeight: "500" }}>
          {displayValue(theraphistdetail.name)}
        </Typography>
      </Box>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: "60px", gap: "30px" }}>
        <Box display={"flex"} alignItems={"center"} justifyContent={"start"} sx={{ width: "400px", height: "155px", border: "1px solid black", borderRadius: "20px", gap: "10px" }}>
          <Box display={"flex"} alignItems={"start"} gap={5} width={"100%"} flexDirection={"column"} >
            <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Name</Typography>
              <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                {displayValue(theraphistdetail.name)}
              </Typography>
            </Box>
            <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Phone number</Typography>
              <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                {displayValue(theraphistdetail.phone)}
              </Typography>
            </Box>
          </Box>
          <Box display={"flex"} alignItems={"start"} gap={5} width={"100%"} flexDirection={"column"}>
            <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>E-mail</Typography>
              <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                {displayValue(theraphistdetail.email)}
              </Typography>
            </Box>
            <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Language</Typography>
              <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                {displayValue(theraphistdetail.languages)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display={"flex"} alignItems={"center"} justifyContent={"start"} sx={{ width: "400px", height: "155px", border: "1px solid black", borderRadius: "20px", gap: "10px" }}>
          <Box display={"flex"} alignItems={"start"} gap={5} width={"100%"} flexDirection={"column"} >
            <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Educational Qualifications</Typography>
              <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                {displayValue(theraphistdetail.educationalQualification)}
              </Typography>
            </Box>
            <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Availability</Typography>
              <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                {displayValue(theraphistdetail.availability)}
              </Typography>
            </Box>
          </Box>
          <Box display={"flex"} alignItems={"start"} gap={5} width={"100%"} flexDirection={"column"}>
            <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Years Of Experience</Typography>
              <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                {displayValue(theraphistdetail.yearsOfExperience)}
              </Typography>
            </Box>
            <Box sx={{ m: "10px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Certifications</Typography>
              <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>
                {displayValue(theraphistdetail.certification?.originalname)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {!theraphistdetail.isAdminApproved && (
        <Box display={"flex"} justifyContent={"center"} mt={2} mb={2} gap={3}>
          <Button
            onClick={() => rejectTheraphist(theraphistdetail._id)}
            variant='outlined'
            color='secondary'
            sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
          >
            Reject
          </Button>
          <Button
            onClick={() => approve(theraphistdetail._id)}
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

export default AdminViewSingleTherapist