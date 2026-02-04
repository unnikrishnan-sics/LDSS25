import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar } from '@mui/material';

const AdminViewSingleParent = ({ parentdetail, handleParentClose }) => {
    return (
        <>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ p: "0px 10px" }}>
                <Typography color='primary' variant='h5' sx={{ fontSize: "18px", fontWeight: "600" }}>Parent Details </Typography>
                <CloseIcon onClick={handleParentClose} />
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} sx={{ p: "0px 10px", mt: "40px", gap: "15px" }}>
                <Avatar sx={{ height: "150px", width: "150px" }} src={`${import.meta.env.VITE_SERVER_URL}/uploads/${parentdetail.profilePic?.filename}`}></Avatar>
                <Typography color='primary' variant='h5' sx={{ fontSize: "24px", fontWeight: "500" }}>{parentdetail.name} </Typography>

            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: "60px", gap: "5px" }}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ width: "400px", height: "155px", border: "1px solid black", borderRadius: "20px", gap: "5px" }}>
                    <Box display={"flex"} alignItems={"start"} width={"100%"} flexDirection={"column"} sx={{ ml: "175px" }} >
                        <Box sx={{ m: "5px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Name </Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>{parentdetail.name} </Typography>
                        </Box>
                        <Box sx={{ m: "5px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>E-mail </Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>{parentdetail.email} </Typography>
                        </Box>
                        <Box sx={{ m: "5px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                            <Typography variant='h5' sx={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F" }}>Phone number </Typography>
                            <Typography color='primary' variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }}>{parentdetail.phone} </Typography>
                        </Box>


                    </Box>

                </Box>

            </Box>
        </>
    )
}

export default AdminViewSingleParent
