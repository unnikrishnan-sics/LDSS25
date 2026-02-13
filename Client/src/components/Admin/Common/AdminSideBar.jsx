import { Box,  Typography } from '@mui/material'
import adminlogo from "../../../assets/adminlogo.png"
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SchoolIcon from '@mui/icons-material/School';
import SpaIcon from '@mui/icons-material/Spa';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Link, useLocation } from 'react-router-dom';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const AdminSideBar = () => {
    const location=useLocation();
  return (
    <>
       <Box sx={{ background: "white", width: "250px", height: "100%", borderRadius: "15px" ,pl:"20px"}}>
                    <Link to={`admin/dashboard`} style={{textDecoration:'none'}}>
                    <Box sx={{ width: "122px", height: "30px", marginTop: "30px" }} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'}>
                        <Box component="img" src={adminlogo} ></Box>
                        <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>LearnHub</Typography>
                    </Box></Link>

                    <Box sx={{ height: "100%", marginTop: "20px" }}>
                    <Link to={`/admin/dashboard`} style={{textDecoration:"none"}}> 
                        <Box sx={{ height: "40px", marginBottom: "10px",background: location.pathname=== "/admin/dashboard"? "#F0F6FE":"none"}} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <DashboardIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Dashboard</Typography>
                        </Box>
                        </Link>
                        <Link to={`/admin/viewparent`} style={{textDecoration:"none"}}>
                        <Box sx={{ height: "40px", marginBottom: "10px",background: location.pathname=== "/admin/viewparent"? "#F0F6FE":"none" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <SupervisedUserCircleIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Parent</Typography>
                        </Box>
                        </Link>
                        <Link to={`/admin/viewEducator`} style={{textDecoration:"none"}}> 
                          <Box sx={{ height: "40px", marginBottom: "10px",background: location.pathname=== "/admin/viewEducator"? "#F0F6FE":"none" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                           <SchoolIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Educator</Typography>
                        </Box>
                        </Link>
                        <Link to={`/admin/viewtheraphist`} style={{textDecoration:"none"}}> 
                        <Box sx={{ height: "40px", marginBottom: "10px",background: location.pathname=== "/admin/viewtheraphist"? "#F0F6FE":"none" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <SpaIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Therapist</Typography>
                        </Box>
                        </Link>
                        
                        <Link to={`/admin/viewactivitylibrary`} style={{textDecoration:"none"}}>
                        <Box sx={{ height: "40px", marginBottom: "10px",background: location.pathname=== "/admin/viewactivitylibrary"? "#F0F6FE":"none"  }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <ListAltIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Activity Library</Typography>
                        </Box>
                        </Link>
                        {/* <Link to={`/admin/blogs`} style={{textDecoration:"none"}}>
                        <Box sx={{ height: "40px", marginBottom: "10px",background: location.pathname=== "/admin/blogs"? "#F0F6FE":"none" }} display={'flex'} justifyContent={'start'} alignItems={'center'} gap={2}>
                            <NewspaperIcon color='primary' sx={{ width: "24px" }} />
                            <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Blogs</Typography>
                        </Box>
                        </Link> */}

                    </Box>
                </Box>
    </>
  )
}

export default AdminSideBar
