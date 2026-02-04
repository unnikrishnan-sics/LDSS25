import {
  Box, Button, Typography, MenuItem, Select,
  FormControl
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AdminSideBar from './Common/AdminSideBar';
import LogoutIcon from '@mui/icons-material/Logout';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLogout from './Common/AdminLogout';
import { Tooltip } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AdminEditActivity = () => {
  const textFieldStyle = {
    height: "65px", width: "360px", display: "flex",
    flexDirection: "column", justifyContent: "start", position: "relative"
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [fileName, setFileName] = useState('No file chosen');
  const [photo, setPhoto] = useState(null);
  const [openLogout, setOpenLogout] = useState(false);

  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);

  const categories = [
    'Communication & Cognitive Skills', 'Language & Creativity', 'STEM Learning',
    'Mathematical Thinking', 'Social Studies', 'Visual Arts', 'Science & Nature',
    'Communication Skills', 'Social Skills', 'Performing Arts',
    'Digital Literacy', 'Social-Emotional Learning'
  ];

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/admin/activity/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = res.data.activity;
        setActivityName(data.activityName || '');
        setDescription(data.description || '');
        setCategory(data.category || '');
        setFileName(data.activityPhoto || 'No file chosen');
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };
    fetchActivity();
  }, [id]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async () => {
    if (!activityName || !description || !category) {
      toast.warning("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append('activityName', activityName);
    formData.append('description', description);
    formData.append('category', category);
    if (photo) formData.append('activityPhoto', photo);

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/ldss/admin/activities/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Activity updated successfully!');
      setTimeout(() => navigate('/admin/viewactivitylibrary'), 1500);
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity');
    }
  };

  return (
    <Box display={"flex"} sx={{ background: "#F6F7F9", p: "13px", height: "100vh", width: "100%", overflowY: "hidden" }}>
      <AdminSideBar />

      <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "start", padding: "0px 15px", borderRadius: "8px", flexGrow: 1 }}>
        <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "100%" }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500", ml: "30px" }} color='primary'>Edit Activity</Typography>
          <Button onClick={handleOpenLogout} variant="text" color='primary' sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
        </Box>

        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} sx={{ mt: "20px", background: "white", borderRadius: "8px", width: "100%", p: "30px", gap: "15px" }}>
          <Typography variant='h3' sx={{ fontSize: "18px", fontWeight: "600" }} color='primary'>Edit Activity</Typography>

          <Box mt={4} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={3}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
              <div style={textFieldStyle}>
                <label>Activity name</label>
                <input
                  style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                  name='activityName'
                  type='text'
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                />
              </div>

              <div style={textFieldStyle}>
                <label>Photo</label>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #CCCCCC',
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 8px'
                }}>
                  <Tooltip title={fileName}>
                    <Typography
                      variant="body1"
                      sx={{
                        flexGrow: 1,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        color: fileName === 'No file chosen' ? '#999' : 'inherit',
                        maxWidth: '200px' // Adjust as needed to control the visible width
                      }}
                    >
                      {fileName}
                    </Typography>
                  </Tooltip>

                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    name='activityPhoto'
                  />
                  <label htmlFor="file-upload">
                    <Button component="span" sx={{ minWidth: 'auto', p: '8px', color: 'primary.main' }}>
                      <DriveFolderUploadIcon />
                    </Button>
                  </label>
                </Box>
              </div>
            </Box>

            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
              <div style={textFieldStyle}>
                <label>Description</label>
                <input
                  style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                  name='description'
                  type='text'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={textFieldStyle}>
                <label>Activity Category</label>
                <FormControl fullWidth>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid #CCCCCC",
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                  >
                    <MenuItem value="" disabled>Select category</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Box>
          </Box>

          <Button
            variant='contained'
            color='secondary'
            sx={{ mt: "20px", borderRadius: "25px", height: "45px", width: '150px', padding: '20px 35px' }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <AdminLogout handleCloseLogout={handleCloseLogout} openLogout={openLogout} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Box>
  );
};

export default AdminEditActivity;
