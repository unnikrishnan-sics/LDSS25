import React, { useEffect, useState } from 'react';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  SearchOutlined,
  PersonOutlined,
  ApartmentOutlined,
  Female,
  DateRange,
  Chat,
  Add,
  Assignment
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Meeting from './Common/Meeting';
import ViewStudentActivity from './Common/ViewStudentActivity';

const EducatorAllStudents = () => {
  const [educatorDetails, setEducatorDetails] = useState({});
  const [allChildren, setAllChildren] = useState([]);
  const [useDummyData, setUseDummyData] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchEducator = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ldss/educator/geteducator/${decoded.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const educatorData = response.data.educator;
      localStorage.setItem("educatorDetails", JSON.stringify(educatorData));
      setEducatorDetails(educatorData);
    } catch (error) {
      console.error("Error fetching educator:", error);
    }
  };

  useEffect(() => {
    const storedEducator = localStorage.getItem("educatorDetails");
    if (storedEducator) {
      setEducatorDetails(JSON.parse(storedEducator));
    }
    fetchEducator();
    fetchAllChildren();
  }, []);

  const navigateToProfile = () => {
    navigate('/educator/profile');
  };

  const fetchAllChildren = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const educatorId = JSON.parse(localStorage.getItem("educatorDetails"))?._id;

      const childrenResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ldss/educator/getchildrenofallapprovedparents/${educatorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const childrenWithProgress = await Promise.all(
        childrenResponse.data.children.map(async (child) => {
          try {
            const planResponse = await axios.get(
              `${import.meta.env.VITE_SERVER_URL}/ldss/educator/getstudentplan/${educatorId}/${child._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const learningPlan = planResponse.data.data?.[0];
            let progress = 0;
            let weeks = 0;

            if (learningPlan) {
              weeks = learningPlan.planDuration || 0;
              console.log(`Learning Plan for child ${child.name}:`, learningPlan); // DEBUG

              // Calculate completed weeks (all activities in week must be completed)
              const completedWeeks = learningPlan.weeks?.filter(week => {
                if (!week.activities || week.activities.length === 0) return false; // Skip weeks with no activities

                const allActivitiesCompleted = week.activities.every(activity => activity.status === "completed");
                console.log(`Week activities for child ${child.name}:`, week.activities); // DEBUG
                console.log(`All activities completed for the weeks for ${child.name}:`, allActivitiesCompleted); // DEBUG

                return allActivitiesCompleted;
              }).length || 0;
              console.log(`Completed Weeks for child ${child.name}:`, completedWeeks); // DEBUG


              progress = weeks > 0 ? Math.round((completedWeeks / weeks) * 100) : 0;
            }

            return {
              ...child,
              hasLearningPlan: !!learningPlan,
              progress,
              weeks,
              learningPlan
            };
          } catch (error) {
            console.error(`Error processing child ${child._id}:`, error);
            return {
              ...child,
              hasLearningPlan: false,
              progress: 0,
              weeks: 0
            };
          }
        })
      );

      setAllChildren(childrenWithProgress);
    } catch (error) {
      console.error("Failed to fetch children:", error);
      setAllChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Meeting modal state
  const [openMeeting, setOpenMeeting] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Activities modal state
  const [openActivity, setOpenActivity] = useState(false);
  const [selectedChildIdForActivity, setSelectedChildIdForActivity] = useState(null);

  const handleMeetingOpen = (childId) => {
    setOpenMeeting(true);
    setSelectedChildId(childId);
  };

  const handleMeetingClose = () => {
    setOpenMeeting(false);
    setSelectedChildId(null);
  };

  const handleActivityOpen = (childId) => {
    setOpenActivity(true);
    setSelectedChildIdForActivity(childId);
  };

  const handleActivityClose = () => {
    setOpenActivity(false);
    setSelectedChildIdForActivity(null);
  };

  const handleChatClick = (parentId) => {
    navigate(`/educator/chat/${parentId}`);
  };

  const handleLearningPlanClick = (childId, hasLearningPlan) => {
    if (hasLearningPlan) {
      navigate(`/educator/editlearningplan/${childId}`);
    } else {
      navigate(`/educator/addlearningplan/${childId}`);
    }
  };

  return (
    <>
      <EducatorNavbar educatorDetails={educatorDetails} navigateToProfile={navigateToProfile} />

      <Box sx={{ background: "white" }}>
        {/* Header Section */}
        <Box display="flex" justifyContent="center" alignItems="center" sx={{
          height: "46px",
          background: "#DBE8FA"
        }}>
          <Typography color='primary' textAlign="center" sx={{
            fontSize: "18px",
            fontWeight: "600"
          }}>
            All Students
          </Typography>
        </Box>

        {/* Breadcrumbs and Search */}
        <Box display="flex" justifyContent="space-between" alignItems="start" sx={{
          mt: "30px",
          ml: "50px",
          mr: "50px"
        }}>
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <Link style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#7F7F7F",
              textDecoration: "none"
            }} to="/educator/home">
              Home
            </Link>
            <Typography color='primary' sx={{
              fontSize: "12px",
              fontWeight: "500"
            }}>
              All Students
            </Typography>
          </Breadcrumbs>

          <Box display="flex" alignItems="center" gap={1} sx={{
            padding: "8px 15px",
            borderRadius: "25px",
            border: "1px solid #CCCCCC",
            height: "40px"
          }}>
            <SearchOutlined />
            <input
              placeholder='Search here'
              style={{
                border: 0,
                outline: 0,
                height: "100%",
                width: "200px"
              }}
            />
          </Box>
        </Box>

        {/* Students Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "300px" }}>
            <Typography>Loading students...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{
            pt: "30px",
            pl: "50px",
            pr: "50px",
            width: "100%",
            pb: "50px",
            justifyContent: "center",
          }}>
            {allChildren.length > 0 ? (
              allChildren.map((child, index) => (
                <Grid item xs={12} md={6} key={index} sx={{ height: "400px" }}>
                  {/* Student Card */}
                  <Box display="flex" flexDirection="column" alignItems="start" sx={{
                    p: "30px",
                    background: "#F6F7F9",
                    borderRadius: "25px",
                    gap: "20px",
                    width: "100%",
                    height: "100%"
                  }}>
                    {/* Student Name and Buttons */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" gap={2}>
                      <Link to={child.hasLearningPlan ? `/educator/editlearningplan/${child._id}` : `/educator/addlearningplan/${child._id}`} style={{ textDecoration: "none" }}>
                        <Typography sx={{
                          fontSize: "24px",
                          fontWeight: "600"
                        }} color='primary'>
                          {child.name}
                        </Typography>
                      </Link>

                      <Box display="flex" alignItems="center" gap="10px">
                        <Button
                          startIcon={child.hasLearningPlan ? <Assignment /> : <Add />}
                          variant='outlined'
                          color='secondary'
                          sx={{
                            borderRadius: "25px",
                            height: "45px",
                            minWidth: '350px',
                            fontSize: "14px",
                            fontWeight: "500"
                          }}
                          onClick={() => handleLearningPlanClick(child._id, child.hasLearningPlan)}
                        >
                          {child.hasLearningPlan ? "Learning Plan" : "Add Learning Plan"}
                        </Button>
                      </Box>
                    </Box>

                    {/* Student Details */}
                    <Box display="flex" justifyContent="space-between" width="100%">
                      {/* Left Column */}
                      <Box display="flex" flexDirection="column" gap="20px">
                        <Box display="flex" alignItems="center" gap="15px">
                          <PersonOutlined sx={{ color: "#1967D2" }} />
                          <Box>
                            <Typography sx={{
                              fontSize: "12px",
                              fontWeight: "500"
                            }} color='secondary'>
                              Parent Name
                            </Typography>
                            <Typography sx={{
                              fontSize: "14px",
                              fontWeight: "500"
                            }} color='primary'>
                              {child.parentId.name}
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap="15px">
                          <ApartmentOutlined sx={{ color: "#1967D2" }} />
                          <Box>
                            <Typography sx={{
                              fontSize: "12px",
                              fontWeight: "500"
                            }} color='secondary'>
                              School Name
                            </Typography>
                            <Typography sx={{
                              fontSize: "14px",
                              fontWeight: "500"
                            }} color='primary'>
                              {child.schoolName}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Right Column */}
                      <Box display="flex" flexDirection="column" gap="20px" sx={{
                        pl: "50px",
                        borderLeft: "1px solid #CCCCCC"
                      }}>
                        <Box display="flex" alignItems="center" gap="15px">
                          <DateRange sx={{ color: "#1967D2" }} />
                          <Box>
                            <Typography sx={{
                              fontSize: "12px",
                              fontWeight: "500"
                            }} color='secondary'>
                              Date of Birth
                            </Typography>
                            <Typography sx={{
                              fontSize: "14px",
                              fontWeight: "500"
                            }} color='primary'>
                              {formatDate(child.dateOfBirth)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap="15px">
                          <Female sx={{ color: "#1967D2" }} />
                          <Box>
                            <Typography sx={{
                              fontSize: "12px",
                              fontWeight: "500"
                            }} color='secondary'>
                              Gender
                            </Typography>
                            <Typography sx={{
                              fontSize: "14px",
                              fontWeight: "500"
                            }} color='primary'>
                              {child.gender}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Box>
                      <Typography sx={{
                        fontSize: "16px",
                        fontWeight: "500"
                      }} color='secondary'>
                        Description
                      </Typography>
                      <Typography sx={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "1.5"
                      }} color='primary'>
                        {child.description}
                      </Typography>
                    </Box>

                    {/* Progress Bar - Only show if student has learning plan */}
                    {/* {child.hasLearningPlan && (
                      <Box width="100%">
                        <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                          <Typography sx={{
                            fontSize: "16px",
                            fontWeight: "600"
                          }} color='secondary'>
                            Progress
                          </Typography>
                          <Typography sx={{
                            fontSize: "14px",
                            fontWeight: "500"
                          }} color='secondary'>
                            {child.weeks} Weeks
                          </Typography>
                        </Box>

                        <Box sx={{
                          background: "#DBE8FA",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          borderRadius: "25px",
                          height: "15px"
                        }}>
                          <LinearProgress
                            variant="determinate"
                            value={child.progress}
                            sx={{
                              height: "100%",
                              borderRadius: "25px",
                              backgroundColor: "transparent",
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#1967D2',
                                borderRadius: "25px"
                              },
                              width: `${child.progress}%`,
                            }}
                          />
                        </Box>
                      </Box>
                    )} */}

                    {/* Action Buttons */}
                    <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={2}>
                      <Button
                        onClick={() => handleMeetingOpen(child._id)}
                        variant='contained'
                        color='secondary'
                        sx={{
                          borderRadius: "25px",
                          height: "45px",
                          width: '48%',
                          fontSize: "14px",
                          fontWeight: "500"
                        }}
                      >
                        Meeting
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px"
              }}>
                <Typography variant="h6" color="textSecondary">
                  No students found
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Meeting Modal */}
      <Meeting
        childId={selectedChildId}
        openMeeting={openMeeting}
        handleMeetingClose={handleMeetingClose}
      />

      {/* Activities Modal */}
      <ViewStudentActivity
        childId={selectedChildIdForActivity}
        openActivity={openActivity}
        handleActivityClose={handleActivityClose}
      />
    </>
  );
};

export default EducatorAllStudents;