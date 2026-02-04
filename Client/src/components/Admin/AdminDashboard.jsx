import {
  Avatar,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  School as SchoolIcon,
  Spa as SpaIcon,
  PeopleOutline as PeopleOutlineIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import AdminSideBar from './Common/AdminSideBar';
import AdminLogout from './Common/AdminLogout';

const AdminDashboard = () => {
  // State for logout modal
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);

  // State for data
  const [parentDetails, setParentDetails] = useState([]);
  const [child, setChild] = useState([]);
  const [educatorDetails, setEducatorDetails] = useState([]);
  const [educator, setEducator] = useState([]);
  const [therapist, setTherapist] = useState([]);
  const [therapistDetails, setTherapistDetails] = useState([]);
  const [loading, setLoading] = useState({
    parents: false,
    children: false,
    educators: false,
    therapists: false
  });

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading({
        parents: true,
        children: true,
        educators: true,
        therapists: true
      });

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Parallel API calls
      const [
        parentsRes,
        childrenRes,
        educatorsRes,
        therapistsRes
      ] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getallparents`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getallchild`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/educator/getalleducators`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/theraphist/getalltheraphist`, { headers })
      ]);

      // Process responses
      setParentDetails(parentsRes.data.allparents || []);
      setChild(childrenRes.data.child || []);

      const allEducators = educatorsRes.data.educators || [];
      setEducator(allEducators.filter(e => e.isAdminApproved === true));
      setEducatorDetails(allEducators.filter(e => e.isAdminApproved === false));

      const allTherapists = therapistsRes.data.theraphist || [];
      setTherapist(allTherapists.filter(t => t.isAdminApproved === true));
      setTherapistDetails(allTherapists.filter(t => t.isAdminApproved === false));

    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors appropriately
    } finally {
      setLoading({
        parents: false,
        children: false,
        educators: false,
        therapists: false
      });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#F6F7F9', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{
        width: '250px',
        backgroundColor: 'white',
        margin: '15px',
        borderRadius: '8px',
        position: 'sticky',
        top: '15px',
        height: 'calc(100vh - 30px)',
        overflow: 'auto'
      }}>
        <AdminSideBar />
      </Box>

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        p: '15px',
        maxWidth: 'calc(100% - 280px)'
      }}>
        {/* Header */}
        <Box sx={{
          height: "70px",
          background: "white",
          borderRadius: "8px",
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <Typography variant='h3' sx={{
            fontSize: "24px",
            fontWeight: "500",
            ml: "30px",
            color: '#1967D2'
          }}>
            Dashboard Overview
          </Typography>
          <Button
            onClick={handleOpenLogout}
            color='primary'
            sx={{
              height: "40px",
              minWidth: '120px',
              padding: '0 20px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#f0f4f9'
              }
            }}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={12} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3} >
            <StatsCard
              icon={<PeopleOutlineIcon sx={{ color: "#1967D2" }} />}
              title="Total Students"
              value={child.length}
              loading={loading.children}

            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<SchoolIcon sx={{ color: "#1967D2" }} />}
              title="Approved Educators"
              value={educator.length}
              loading={loading.educators}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<SpaIcon sx={{ color: "#1967D2" }} />}
              title="Approved Therapists"
              value={therapist.length}
              loading={loading.therapists}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<PersonIcon sx={{ color: "#1967D2" }} />}
              title="Registered Parents"
              value={parentDetails.length}
              loading={loading.parents}
            />
          </Grid>
        </Grid>

        {/* Therapist Request Table */}
        <DataTable
          title="Therapist Requests"
          data={therapistDetails}
          loading={loading.therapists}
          viewAllLink="/admin/viewtheraphist"
          columns={[
            { header: "S.NO", render: (item, index) => index + 1 },
            {
              header: "Profile",
              render: (item) => (
                <Avatar
                  src={item.profilePic?.filename ?
                    `${import.meta.env.VITE_SERVER_URL}/uploads/${item.profilePic.filename}` :
                    undefined
                  }
                  sx={{ bgcolor: '#1967D2' }}
                >
                  {item.name?.charAt(0)}
                </Avatar>
              )
            },
            { header: "Name", render: (item) => item.name || 'N/A' },
            { header: "Phone", render: (item) => item.phone || 'N/A' },
            { header: "Email", render: (item) => item.email || 'N/A' },
            { header: "Address", render: (item) => item.address || 'N/A' },
            // { 
            //   header: "Action", 
            //   render: () => (
            //     <Button 
            //       size="small" 
            //       color="secondary"
            //       startIcon={<VisibilityIcon />}
            //       sx={{ textTransform: 'none' }}
            //     >
            //       View
            //     </Button>
            //   )
            // }
          ]}
        />

        {/* Educator Request Table */}
        <DataTable
          title="Educator Requests"
          data={educatorDetails}
          loading={loading.educators}
          viewAllLink="/admin/viewEducator"
          columns={[
            { header: "S.NO", render: (item, index) => index + 1 },
            {
              header: "Profile",
              render: (item) => (
                <Avatar
                  src={item.profilePic?.filename ?
                    `${import.meta.env.VITE_SERVER_URL}/uploads/${item.profilePic.filename}` :
                    undefined
                  }
                  sx={{ bgcolor: '#1967D2' }}
                >
                  {item.name?.charAt(0)}
                </Avatar>
              )
            },
            { header: "Name", render: (item) => item.name || 'N/A' },
            { header: "Phone", render: (item) => item.phone || 'N/A' },
            { header: "Email", render: (item) => item.email || 'N/A' },
            { header: "Address", render: (item) => item.address || 'N/A' },
            // { 
            //   header: "Action", 
            //   render: () => (
            //     <Button 
            //       size="small" 
            //       color="secondary"
            //       startIcon={<VisibilityIcon />}
            //       sx={{ textTransform: 'none' }}
            //     >
            //       View
            //     </Button>
            //   )
            // }
          ]}
        />
      </Box>

      {/* Logout Modal */}
      <AdminLogout
        handleCloseLogout={handleCloseLogout}
        openLogout={openLogout}
      />
    </Box>
  );
};

// Reusable Stats Card Component
const StatsCard = ({ icon, title, value, loading }) => (
  <Box sx={{
    width: "100%",
    minHeight: "138px",
    background: "#FFFFFF",
    p: "20px",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
    }
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: '#E8F0FE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </Box>
      <Typography variant='h6' sx={{
        fontSize: "16px",
        fontWeight: "500",
        color: '#5F6368'
      }}>
        {title}
      </Typography>
    </Box>
    {loading ? (
      <Box sx={{
        width: '60%',
        height: 24,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        alignSelf: 'center'
      }} />
    ) : (
      <Typography variant='h3' sx={{
        fontSize: "28px",
        fontWeight: "600",
        color: '#1967D2',
        textAlign: 'center',
        width: '100%'
      }}>
        {value}
      </Typography>
    )}
  </Box>
);

// Reusable Data Table Component
const DataTable = ({ title, data, loading, viewAllLink, columns }) => (
  <Box sx={{
    width: "100%",
    background: "white",
    borderRadius: "15px",
    mb: 3,
    p: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
  }}>
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 2
    }}>
      <Typography variant='h4' sx={{
        fontSize: "18px",
        fontWeight: "600",
        color: '#1967D2'
      }}>
        {title}
      </Typography>
      {data.length > 0 && (
        <Link to={viewAllLink} style={{ textDecoration: "none" }}>
          <Button
            variant="text"
            color="primary"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            View All
          </Button>
        </Link>
      )}
    </Box>

    {loading ? (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 200
      }}>
        <Typography color="textSecondary">Loading data...</Typography>
      </Box>
    ) : data.length > 0 ? (
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F6F7F9' }}>
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  sx={{
                    color: "#1967D2",
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f9f9f9'
                  }
                }}
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{
                      borderBottom: '1px solid #f0f0f0',
                      py: 1.5
                    }}
                  >
                    {col.render(item, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        border: '1px dashed #e0e0e0',
        borderRadius: 1
      }}>
        <Typography color="textSecondary">No data available</Typography>
      </Box>
    )}
  </Box>
);

export default AdminDashboard;