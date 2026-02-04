import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar'
import { Link, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Grid, Typography, Container, Stack } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import FemaleIcon from '@mui/icons-material/Female';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { toast } from 'react-toastify';
import QuizIcon from '@mui/icons-material/Quiz';

const addChildStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "840px",
  height: "508px",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const editChildStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "840px",
  height: "508px",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }

// Helper function to format date as MM-DD-YYYY
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

const ParentChildProfile = () => {
  const aboutBg = {
    background: "#F6F7F9"
  }
  const [parentdetails, setParentdetails] = useState({});
  useEffect(() => {
    const parentdetails = localStorage.getItem("parentDetails");
    setParentdetails(JSON.parse(parentdetails));
  }, []);

  const navigate = useNavigate();
  const navigateToProfile = () => {
    navigate('/parent/profile');
  }

  // add child modal
  const [addChildOpen, setAddChildOpen] = React.useState(false);
  const handleAddChildOpen = () => setAddChildOpen(true);
  const handleAddChildClose = () => {
    setAddChildOpen(false);
    setErrors({});
  };

  // add child details
  const [childData, setChildData] = useState({
    name: "",
    schoolName: "",
    gender: "",
    description: "",
    dateOfBirth: ""
  });

  // Validation errors
  const [errors, setErrors] = useState({
    name: "",
    schoolName: "",
    gender: "",
    dateOfBirth: ""
  });

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
  };

  const validateSchoolName = (schoolName) => {
    const regex = /^[a-zA-Z\s\-']*$/;
    return regex.test(schoolName);
  };

  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate <= today;
  };
  const handleQuizClick = (studentId) => {
    // --- START DEBUG LOGS ---
    console.log("TherapistAllStudents - handleQuizClick called with:");
    console.log("  studentId (child._id):", studentId);
    // --- END DEBUG LOGS ---

    // Basic validation before navigating
    if (!studentId) {
      console.error("Missing required chat details:", { parentId, studentId, studentName });
      alert("Could not start chat: Missing parent or student information. Please try again.");
      return;
    }

    navigate(`/parent/child/${studentId}/quizzes`, {
      state: {
        studentId: studentId,   // Pass the student's ID
      }
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation checks
    let error = "";

    if (name === "name") {
      if (!validateName(value)) {
        error = "Name should contain only alphabets";
      } else if (value.trim() === "") {
        error = "Name is required";
      }
    }

    if (name === "schoolName") {
      if (!validateSchoolName(value)) {
        error = "School name should contain only alphabets and spaces";
      } else if (value.trim() === "") {
        error = "School name is required";
      }
    }

    if (name === "dateOfBirth") {
      if (!value) {
        error = "Date of birth is required";
      } else if (!validateDate(value)) {
        error = "Date of birth cannot be in the future";
      }
    }

    if (name === "gender") {
      if (!value) {
        error = "Gender is required";
      }
    }

    setErrors({
      ...errors,
      [name]: error
    });

    setChildData({
      ...childData,
      [name]: value
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!childData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (!validateName(childData.name)) {
      newErrors.name = "Name should contain only alphabets";
      valid = false;
    }

    if (!childData.schoolName.trim()) {
      newErrors.schoolName = "School name is required";
      valid = false;
    } else if (!validateSchoolName(childData.schoolName)) {
      newErrors.schoolName = "School name should contain only alphabets and spaces";
      valid = false;
    }

    if (!childData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      valid = false;
    } else if (!validateDate(childData.dateOfBirth)) {
      newErrors.dateOfBirth = "Date of birth cannot be in the future";
      valid = false;
    }

    if (!childData.gender) {
      newErrors.gender = "Gender is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("token");
    const child = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/addchild/${parentdetails._id}`, childData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (child.data.message === "Child added successfully.") {
      toast.success("Child added successfully.");
      fetchAllChilds();
      handleAddChildClose();
      // Reset form
      setChildData({
        name: "",
        schoolName: "",
        gender: "",
        description: "",
        dateOfBirth: ""
      });
    }
  };

  // getting all child details
  const [childDetails, setChildDetails] = useState([]);
  const [filteredChildDetails, setFilteredChildDetails] = useState([]);

  const fetchAllChilds = async () => {
    const token = localStorage.getItem("token");
    const parentdetails = localStorage.getItem("parentDetails");
    const parent = JSON.parse(parentdetails);
    const child = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getallchild`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const childsbyparent = child.data.child.filter((child) => parent._id === child.parentId)
    setChildDetails(childsbyparent);
    setFilteredChildDetails(childsbyparent); // Initialize filtered list with all children
  };

  useEffect(() => {
    fetchAllChilds();
  }, [])

  // edit child modal
  const [currentChildId, setCurrentChildId] = useState("");
  const [editchild, setEditChild] = useState({
    name: "",
    schoolName: "",
    description: "",
    dateOfBirth: "",
    gender: ""
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditChild({
      ...editchild,
      [name]: value
    })
  }

  const fetchChildDetail = async (childId) => {
    handleEditChildOpen();
    setCurrentChildId(childId);
    const token = localStorage.getItem("token");
    const parentdetails = localStorage.getItem("parentDetails");
    const parent = JSON.parse(parentdetails);
    const child = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/getchild/${parent._id}/${childId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEditChild({
      name: child.data.child.name,
      schoolName: child.data.child.schoolName,
      description: child.data.child.description,
      dateOfBirth: child.data.child.dateOfBirth.split('T')[0], // Keep in YYYY-MM-DD format for the input
      gender: child.data.child.gender
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const parentdetails = localStorage.getItem("parentDetails");
    const parent = JSON.parse(parentdetails);
    const child = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/updatechild/${parent._id}/${currentChildId}`, editchild, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (child.data.message === "Child updated successfully.") {
      toast.success("Child updated successfully.");
      fetchAllChilds();
      handleEditChildClose();
    }
  }

  const [editChildOpen, setEditChildOpen] = React.useState(false);
  const handleEditChildOpen = () => {
    setEditChildOpen(true);
  }
  const handleEditChildClose = () => setEditChildOpen(false);

  // delete child 
  const handleDeleteChild = async (childId) => {
    const token = localStorage.getItem("token");
    const parentdetails = localStorage.getItem("parentDetails");
    const parent = JSON.parse(parentdetails);
    const child = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/ldss/parent/deletechild/${parent._id}/${childId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (child.data.message === "Child deleted successfully.") {
      toast.success("Child deleted successfully.");
      fetchAllChilds();
    }
  }

  // filter child by their name
  const [searchChild, setSearchChild] = useState("");

  const handleSearchChild = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchChild(searchTerm);

    if (searchTerm === "") {
      setFilteredChildDetails(childDetails);
    } else {
      const filtered = childDetails.filter(child =>
        child.name.toLowerCase().includes(searchTerm)
      );
      setFilteredChildDetails(filtered);
    }
  }

  // Get today's date in YYYY-MM-DD format for date input max attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <ParentNavbar aboutBg={aboutBg} parentdetails={parentdetails} navigateToProfile={navigateToProfile} />
      <Box sx={{ background: "white" }}>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
          <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Child</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ marginTop: "20px", ml: "50px", mr: "50px" }}>
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/">
              Home
            </Link>
            <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Child</Typography>
          </Breadcrumbs>
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3}>
            <Button
              endIcon={<AddOutlinedIcon />}
              variant='contained'
              color='secondary'
              sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }}
              onClick={handleAddChildOpen}
            >Add Child</Button>
          </Box>
        </Box>
      </Box>
      <Grid sx={{ pt: "30px", pl: "50px", pr: "50px", width: "100%" }} container spacing={2}>
        {filteredChildDetails.length > 0 ? (
          filteredChildDetails.map((child, index) => {
            return (
              <Grid key={index} item xs={12} md={6} width={"49%"}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"start"} sx={{ p: "50px 30px", height: "400px", background: "#F6F7F9", borderRadius: "25px", gap: "20px", width: "100%" }}>
                  <Box width={"100%"} display={"flex"} gap={5} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography sx={{ fontSize: "32px", fontWeight: "600" }} color='primary'
                      onClick={() => { fetchChildDetail(child._id) }}
                    >{child.name} <BorderColorOutlinedIcon /></Typography>
                    <Typography sx={{ color: "#E52323" }}>
                      <DeleteOutlinedIcon
                        onClick={() => handleDeleteChild(child._id)}
                      />
                    </Typography>
                  </Box>
                  <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
                    <Box sx={{ gap: "20px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                      <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                        <Box sx={{ color: "#1967D2" }}><PersonOutlinedIcon /></Box>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                          <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Name</Typography>
                          <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{child.name}</Typography>
                        </Box>
                      </Box>
                      <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                        <Box sx={{ color: "#1967D2" }}><ApartmentOutlinedIcon /></Box>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                          <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>School name</Typography>
                          <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{child.schoolName}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ gap: "20px", pr: "250px", borderLeft: "1px solid #CCCCCC" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                      <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "50px" }}>
                        <Box sx={{ color: "#1967D2" }}><DateRangeIcon /></Box>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                          <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Date of birth</Typography>
                          <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{formatDate(child.dateOfBirth)}</Typography>
                        </Box>
                      </Box>
                      <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "50px" }}>
                        <Box sx={{ color: "#1967D2" }}><FemaleIcon /></Box>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                          <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Gender</Typography>
                          <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{child.gender}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                    <Typography variant='h5' sx={{ fontSize: "18px", fontWeight: "500" }} color='secondary'>Description</Typography>
                    <Typography variant='p' sx={{ fontSize: "14px", fontWeight: "500" }} color='primary'>{child.description}</Typography>
                  </Box>

                  <Button
                    startIcon={<QuizIcon />}
                    variant='outlined'
                    color='secondary'
                    sx={{
                      borderRadius: "25px",
                      height: "45px",
                      minWidth: '120px',
                      fontSize: "14px",
                      fontWeight: "500",
                      mr: 2
                    }}
                    // MODIFIED: Pass all required data to handleChatClick
                    onClick={() => handleQuizClick(child._id)}
                    // Disable the button if critical data is missing
                    disabled={!child._id}
                  >
                    Quiz
                  </Button>
                </Box>

              </Grid>
            )
          })
        ) : (
          <Box sx={{ width: "100%", textAlign: "center", p: 4 }}>
            <Typography variant="h6" color="textSecondary">
              {searchChild ? "No matching children found" : "No children added yet"}
            </Typography>
          </Box>
        )}
      </Grid>

      {/* add child modal start */}
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={addChildOpen}
          onClose={handleAddChildClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={addChildOpen}>
            <Box sx={addChildStyle}>
              <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Add Child</Typography>
                <CloseIcon onClick={handleAddChildClose} sx={{ fontSize: "18px" }} />
              </Box>
              <hr />
              <Container sx={{ position: "relative", mt: "50px" }} maxWidth="x-lg">
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                  <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "154px", flexDirection: "column", marginTop: '30px' }}>
                    <Stack direction="row" sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
                      <div style={textFieldStyle}>
                        <label>Name*</label>
                        <input
                          style={{ height: "40px", borderRadius: "8px", border: errors.name ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                          name='name'
                          type='text'
                          value={childData.name}
                          onChange={handleChange}
                        />
                        {errors.name && <Typography color="error" sx={{ fontSize: "12px", mt: 1 }}>{errors.name}</Typography>}
                      </div>
                      <div style={{ ...textFieldStyle, width: "360px" }}>
                        <label>Gender*</label>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '8px' }}>
                          <label>
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              onChange={handleChange}
                              checked={childData.gender === "male"}
                            /> Male
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              onChange={handleChange}
                              checked={childData.gender === "female"}
                            /> Female
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="gender"
                              value="others"
                              onChange={handleChange}
                              checked={childData.gender === "others"}
                            /> Others
                          </label>
                        </div>
                        {errors.gender && <Typography color="error" sx={{ fontSize: "12px", mt: 1 }}>{errors.gender}</Typography>}
                      </div>
                    </Stack>
                    <Stack direction={'row'} sx={{ display: "flex", gap: "15px" }}>
                      <div style={textFieldStyle}>
                        <label>School Name*</label>
                        <input
                          style={{ height: "40px", borderRadius: "8px", border: errors.schoolName ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                          name='schoolName'
                          value={childData.schoolName}
                          onChange={handleChange}
                        />
                        {errors.schoolName && <Typography color="error" sx={{ fontSize: "12px", mt: 1 }}>{errors.schoolName}</Typography>}
                      </div>
                      <div style={textFieldStyle}>
                        <label>Date Of Birth*</label>
                        <input
                          style={{ height: "40px", borderRadius: "8px", border: errors.dateOfBirth ? "1px solid red" : "1px solid #CCCCCC", padding: '8px' }}
                          name='dateOfBirth'
                          type='date'
                          value={childData.dateOfBirth}
                          onChange={handleChange}
                          max={getTodayDate()}
                        />
                        {errors.dateOfBirth && <Typography color="error" sx={{ fontSize: "12px", mt: 1 }}>{errors.dateOfBirth}</Typography>}
                      </div>
                    </Stack>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
                      <label>Description</label>
                      <textarea
                        style={{ height: "70px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                        name='description'
                        value={childData.description}
                        onChange={handleChange}
                      />
                    </Box>
                  </Box>
                  <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px', mt: "70px" }}>
                    <Button
                      variant='contained'
                      color='secondary'
                      sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                      onClick={handleSubmit}
                    >Confirm</Button>
                  </Box>
                </Box>
              </Container>
            </Box>
          </Fade>
        </Modal>
      </div>
      {/* add child modal ends */}

      {/* edit child modal start */}
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={editChildOpen}
          onClose={handleEditChildClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={editChildOpen}>
            <Box sx={editChildStyle}>
              <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit Child</Typography>
                <CloseIcon onClick={handleEditChildClose} sx={{ fontSize: "18px" }} />
              </Box>
              <hr />
              <Container sx={{ position: "relative", mt: "50px" }} maxWidth="x-lg">
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                  <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "154px", flexDirection: "column", marginTop: '30px' }}>
                    <Stack direction="row" sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
                      <div style={textFieldStyle}>
                        <label>Name</label>
                        <input
                          style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                          name='name'
                          type='text'
                          value={editchild.name}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '20px', textFieldStyle }}>
                        <label style={{}}>Gender:</label>
                        <label>
                          <input type="radio" name="gender" value="male" onChange={handleEditChange} checked={editchild.gender === "male"} /> Male
                        </label>
                        <label>
                          <input type="radio" name="gender" value="female" onChange={handleEditChange} checked={editchild.gender === "female"} /> Female
                        </label>
                        <label>
                          <input type="radio" name="gender" value="others" onChange={handleEditChange} checked={editchild.gender === "others"} /> Others
                        </label>
                      </div>
                    </Stack>
                    <Stack direction={'row'} sx={{ display: "flex", gap: "15px" }}>
                      <div style={textFieldStyle}>
                        <label>School Name</label>
                        <input
                          style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                          name='schoolName'
                          onChange={handleEditChange}
                          value={editchild.schoolName}
                        />
                      </div>
                      <div style={textFieldStyle}>
                        <label>Date Of Birth</label>
                        <input
                          style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                          name='dateOfBirth'
                          type='date'
                          onChange={handleEditChange}
                          value={editchild.dateOfBirth}
                          max={getTodayDate()}
                        />
                      </div>
                    </Stack>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
                      <label>Description</label>
                      <textarea
                        style={{ height: "70px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                        name='description'
                        onChange={handleEditChange}
                        value={editchild.description}
                      />
                    </Box>
                  </Box>
                  <Box display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{ width: '253px', height: "93px", gap: '10px', mt: "70px" }}>
                    <Button
                      variant='outlined'
                      color='secondary'
                      sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                      onClick={handleEditChildClose}
                    >Cancel</Button>
                    <Button
                      variant='contained'
                      color='secondary'
                      sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                      onClick={handleEditSubmit}
                    >Update</Button>
                  </Box>
                </Box>
              </Container>
            </Box>
          </Fade>
        </Modal>
      </div>
      {/* edit child modal ends */}
    </>
  )
}

export default ParentChildProfile