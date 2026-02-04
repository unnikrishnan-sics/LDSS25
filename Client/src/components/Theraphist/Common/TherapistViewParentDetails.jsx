import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Grid } from '@mui/material';
import axios from 'axios';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneEnabledOutlinedIcon from '@mui/icons-material/PhoneEnabledOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import FemaleIcon from '@mui/icons-material/Female';
import DateRangeIcon from '@mui/icons-material/DateRange';

const TherapistViewParentDetails = ({ handleParentClose, requestDetail, onAccept, onReject }) => {
    const useDummyData = false;
    // Dummy data for parent
    const dummyParent = {
        _id: 'parent1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Springfield, IL 62704',
        profilePic: {
            filename: 'profile1.jpg'
        }
    };

    // Dummy data for children
    const dummyChildren = [
        {
            _id: 'child1',
            name: 'Michael Johnson',
            schoolName: 'Springfield Elementary',
            dateOfBirth: '2012-05-15',
            gender: 'Male',
            description: 'Michael is a curious student who excels in mathematics and science.'
        },
        {
            _id: 'child2',
            name: 'Emily Johnson',
            schoolName: 'Springfield Elementary',
            dateOfBirth: '2014-08-22',
            gender: 'Female',
            description: 'Emily loves reading and creative writing. She enjoys art and music.'
        }
    ];

    const [parent, setParent] = React.useState({});
    const [children, setChildren] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const fetchChildOfParent = async () => {
        if (useDummyData) {
            setChildren(dummyChildren);
            return;
        }

        try {
            const parentId = requestDetail?.parentId?._id || requestDetail?.parentId;
            console.log("[DEBUG] fetchChildOfParent called with parentId:", parentId);

            if (!parentId) {
                console.error("Parent ID is missing");
                return;
            }

            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/parent/getallchildofparent/${parentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChildren(response.data.child || []);
            console.log("Children data:", response.data);
        } catch (error) {
            console.error("Failed to fetch children:", error);
            if (useDummyData) {
                setChildren(dummyChildren);
            }
        }
    };

    const fetchParent = async () => {
        if (useDummyData) {
            setParent(dummyParent);
            return;
        }

        try {
            const parentId = requestDetail?.parentId?._id || requestDetail?.parentId;
            if (!parentId) {
                throw new Error("Parent ID is missing");
            }

            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ldss/parent/getparent/${parentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setParent(response.data.parent || {});
        } catch (error) {
            console.error("Failed to fetch parent:", error);
            setError("Failed to load parent details");
            if (useDummyData) {
                setParent(dummyParent);
            }
        }
    };

    React.useEffect(() => {
        console.log("[ChildDetails] requestDetail changed:", requestDetail);
        if (requestDetail) {
            setLoading(true);
            Promise.all([fetchParent(), fetchChildOfParent()])
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setError("Failed to load data");
                })
                .finally(() => setLoading(false));
        }
    }, [requestDetail]);

    if (!requestDetail) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error">Parent information not available</Typography>
            </Box>
        );
    }

    if (loading) {
        return <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>;
    }

    if (error) {
        return <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>{error}</Box>;
    }


    return (
        <>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ p: "0px 10px" }}>
                <Typography color='primary' variant='h5' sx={{ fontSize: "18px", fontWeight: "600" }}>Parent Details</Typography>
                <CloseIcon onClick={handleParentClose} />
            </Box>
            <Box sx={{ border: "1px solid #CCCCCC" }} />

            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ height: "220px", borderRadius: "20px", width: "100%", padding: "0px 40px" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "180px", gap: "70px" }}>
                    {parent?.profilePic?.filename ? (
                        <Avatar
                            sx={{ height: "100%", width: "180px" }}
                            src={`${import.meta.env.VITE_SERVER_URL}/uploads/${parent?.profilePic?.filename}`}
                            alt={parent?.name}
                        />
                    ) : (
                        <Avatar sx={{ height: "100%", width: "180px" }}>
                            {parent?.name?.charAt(0)}
                        </Avatar>
                    )}

                    <Box display={"flex"} justifyContent={"center"} alignItems={"start"} flexDirection={"column"} sx={{ gap: "40px" }}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ gap: "100px" }}>
                            <Box display={"flex"} justifyContent={"start"} alignItems={"start"} flexDirection={"column"} sx={{ gap: "20px" }}>
                                <Typography><PersonOutlinedIcon /> {parent.name}</Typography>
                                <Typography><MailOutlinedIcon /> {parent.email}</Typography>
                            </Box>

                            <Box display={"flex"} justifyContent={"start"} alignItems={"start"} flexDirection={"column"} sx={{ gap: "20px", borderLeft: "1px solid #CCCCCC", ml: "50px", pl: "40px" }}>
                                <Typography><LocationOnOutlinedIcon /> {parent.address}</Typography>
                                <Typography><PhoneEnabledOutlinedIcon /> {parent.phone}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Children Section */}
            {children && children.length === 0 ? (
                <Typography textAlign={'center'} color='primary' variant='h5' sx={{ fontSize: "18px", fontWeight: "600" }}>
                    No child added yet!
                </Typography>
            ) : (
                <Grid container spacing={2} sx={{ pt: "20px", width: "100%" }}>
                    {children.map((child, index) => (
                        <Grid key={index} item xs={12} md={6}>
                            <Box sx={{
                                height: "330px",
                                background: "#F0F6FE",
                                borderRadius: "20px",
                                p: "15px 30px",
                                gap: "20px",
                                width: "100%"
                            }}>
                                <Box width={"100%"} display={"flex"} gap={5} justifyContent={"space-between"} alignItems={"center"}>
                                    <Typography sx={{ fontSize: "32px", fontWeight: "600" }} color='primary'>
                                        {child.name}
                                    </Typography>
                                </Box>
                                <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
                                    <Box sx={{ gap: "60px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
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
                                    <Box sx={{ borderLeft: "1px solid #CCCCCC", marginLeft: "30px" }}>
                                        <Box sx={{ gap: "60px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Box display={"flex"} alignItems={"start"} sx={{ gap: "10px", pl: "40px" }}>
                                                <Box sx={{ color: "#1967D2" }}><DateRangeIcon /></Box>
                                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                                    <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Date of birth</Typography>
                                                    <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{child.dateOfBirth}</Typography>
                                                </Box>
                                            </Box>
                                            <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "60px" }}>
                                                <Box sx={{ color: "#1967D2" }}><FemaleIcon /></Box>
                                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                                    <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Gender</Typography>
                                                    <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{child.gender}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"} sx={{ gap: "10px", mt: "50px" }}>
                                    <Typography variant='h5' sx={{ fontSize: "18px", fontWeight: "500" }} color='secondary'>Description</Typography>
                                    <Typography variant='p' sx={{ fontSize: "14px", fontWeight: "500" }} color='primary'>{child.description}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Action Buttons */}
            {requestDetail.status === "accepted" ? (
                <Box></Box>
            ) : (
                <Box display={"flex"} justifyContent={"center"} mt={2} mb={2} gap={3}>
                    <Button
                        onClick={() => {
                            onReject();
                            handleParentClose();
                        }}
                        variant='outlined'
                        color='secondary'
                        sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }}
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={() => {
                            onAccept();
                            handleParentClose();
                        }}
                        variant='contained'
                        color='secondary'
                        sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }}
                    >
                        Accept
                    </Button>
                </Box>
            )}
        </>
    );
};
export default TherapistViewParentDetails;
