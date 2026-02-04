import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LogoHub from "../../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import Badge from '@mui/material/Badge';
import axiosInstance from '../../Api_service/baseUrl';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';

const pages = [
    { label: 'Home', path: '/parent/home' },
    { label: 'About', path: '/parent/about' },
    { label: 'Contact', path: '/parent/contact' },
    { label: 'Child', path: '/parent/childprofile' },
    { label: 'Learning', path: '/parent/learningplan' },
    { label: 'Meetings', path: '/parent/meeting' },
    { label: 'Activities', path: '/parent/activities' },
    { label: 'Blogs', path: '/parent/blogs' },
];

const ParentNavbar = ({ homebg = {}, aboutBg = {}, profilebg = {}, navigateToProfile = () => { }, parentdetails = {}, contactbg = {} }) => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [notificationAnchor, setNotificationAnchor] = React.useState(null);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications separately

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenNotificationMenu = (event) => {
        setNotificationAnchor(event.currentTarget);
        // Reset unread count when notifications are opened
        setUnreadCount(0);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseNotificationMenu = () => {
        setNotificationAnchor(null);
    };

    const location = useLocation();

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const parentId = (JSON.parse(localStorage.getItem("parentDetails"))?._id);

                if (!parentId) {
                    console.log("No parent ID found");
                    return;
                }

                const response = await axiosInstance.get(`/parent/getallmeeting/${parentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // console.log("API Response:", response.data); // Debug log

                if (!response.data || !response.data.meetings) {
                    // console.log("No meetings data in response");
                    setMeetings([]);
                    setUnreadCount(0);
                    return;
                }

                const currentDateTime = new Date();
                const upcomingMeetings = response.data.meetings.filter(meeting => {
                    if (!meeting.date || !meeting.endTime) return false;

                    const meetingDate = new Date(meeting.date);
                    const [hours, minutes] = meeting.endTime.split(':');

                    const meetingEndDateTime = new Date(
                        meetingDate.getFullYear(),
                        meetingDate.getMonth(),
                        meetingDate.getDate(),
                        parseInt(hours, 10),
                        parseInt(minutes, 10)
                    );

                    return meetingEndDateTime > currentDateTime;
                });

                // console.log("Upcoming meetings:", upcomingMeetings); // Debug log
                setMeetings(upcomingMeetings);
                setUnreadCount(upcomingMeetings.length);
            } catch (error) {
                console.error("Error fetching meetings:", error);
                setMeetings([]);
                setUnreadCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, []);

    // Filter upcoming meetings (within the next 7 days)
    const upcomingMeetings = meetings.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return meetingDate >= today && meetingDate <= nextWeek;
    });

    // Format time to 12-hour format
    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Get meeting participant name and icon
    const getMeetingParticipant = (meeting) => {
        if (meeting?.educatorId?._id) {
            return {
                name: meeting.educatorId.name,
                icon: <SchoolIcon color="primary" sx={{ mr: 1 }} />,
                role: 'educator'
            };
        } else if (meeting?.therapistId?._id) {
            return {
                name: meeting.therapistId.name,
                icon: <MedicalServicesIcon color="primary" sx={{ mr: 1 }} />,
                role: 'theraphist'
            };
        }
        return {
            name: 'Staff Member',
            icon: <PersonIcon color="primary" sx={{ mr: 1 }} />,
            role: 'Staff'
        };
    };

    return (
        <AppBar position="static" sx={{
            backgroundColor: 'transparent',
            boxShadow: "none",
            backgroundImage: `url(${contactbg})`,
            ...profilebg,
            ...aboutBg,
            ...homebg,
            zIndex: 100
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* Left side - Logo and Brand */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Link to="/parent/home">
                            <Box component="img" src={LogoHub} alt='logo'
                                sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        </Link>
                        <Link to="/parent/home" style={{ textDecoration: "none" }}>
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: '#384371',
                                    textDecoration: 'none',
                                }}
                            >
                                LearnHub
                            </Typography>
                        </Link>
                    </Box>

                    {/* Mobile Menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon sx={{ color: "#384371" }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                    <Link to={page.path} style={{ textDecoration: 'none', color: '#1967D2' }}>
                                        <Typography textAlign="center">{page.label}</Typography>
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Mobile Logo and Brand */}
                    <Link to='/parent/home'>
                        <Box component="img" src={LogoHub} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    </Link>
                    <Link to="/parent/home" style={{ textDecoration: "none" }}>
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: '#384371',
                                textDecoration: 'none',
                            }}
                        >
                            LearnHub
                        </Typography>
                    </Link>

                    {/* Desktop Navigation */}
                    <Box sx={{
                        flexGrow: 1,
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        gap: "40px"
                    }}>
                        {pages.map((page) => (
                            <Link
                                style={{ textDecoration: "none" }}
                                key={page.label}
                                to={page.path}
                            >
                                <Typography
                                    sx={{
                                        my: 2,
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        display: 'block',
                                        textTransform: "inherit",
                                        borderBottom: location.pathname === page.path ? "1px solid #1967D2" : "none",
                                        '&:hover': {
                                            borderBottom: "1px solid #1967D2",
                                            color: '#1967D2'
                                        },
                                        color: location.pathname === page.path ? '#1967D2' : 'inherit'
                                    }}
                                >
                                    {page.label}
                                </Typography>
                            </Link>
                        ))}
                    </Box>

                    {/* Right side - Icons and User Menu */}
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 0, gap: "30px" }}>
                        {/* Chat Icon */}
                        {/* <Tooltip title="Messages">
                            <Link to={'/parent/chat'}>
                                <SmsOutlinedIcon color="primary" sx={{ height: '24px' }} />
                            </Link>
                        </Tooltip> */}

                        {/* Notifications */}
                        <Tooltip title="Notifications">
                            <IconButton onClick={handleOpenNotificationMenu} color="inherit">
                                <NotificationsOutlinedIcon color="primary" sx={{ height: '24px' }} />
                            </IconButton>
                        </Tooltip>

                        {/* Notifications Dropdown */}
                        <Menu
                            anchorEl={notificationAnchor}
                            open={Boolean(notificationAnchor)}
                            onClose={handleCloseNotificationMenu}
                            PaperProps={{
                                style: {
                                    width: '350px',
                                    maxHeight: '400px',
                                    padding: '10px'
                                },
                            }}
                        >
                            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', color: '#1967D2' }}>
                                Upcoming Meetings
                            </Typography>
                            <Divider />
                            {loading ? (
                                <Typography sx={{ p: 2 }}>Loading meetings...</Typography>
                            ) : meetings.length === 0 ? (
                                <Typography sx={{ p: 2 }}>No upcoming meetings scheduled</Typography>
                            ) : (
                                <List>
                                    {meetings.map((meeting, index) => {
                                        const participant = getMeetingParticipant(meeting);
                                        return (
                                            <React.Fragment key={index}>
                                                <ListItem alignItems="flex-start">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <EventIcon color="primary" sx={{ mr: 1 }} />
                                                    </Box>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="subtitle1" color="text.primary">
                                                                {meeting.meetingTitle || "Meeting"}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                    display="block"
                                                                >
                                                                    {meeting.date ? new Date(meeting.date).toLocaleDateString() : "No date"} |
                                                                    {meeting.startTime ? formatTime(meeting.startTime) : "No start time"} -
                                                                    {meeting.endTime ? formatTime(meeting.endTime) : "No end time"}
                                                                </Typography>
                                                                {/* {participant && (
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                                display="block"
                                            >
                                                With: {participant.name} ({participant.role})
                                            </Typography>
                                        )}
                                        {meeting.childId?.name && (
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                                display="block"
                                            >
                                                Child: {meeting.childId.name}
                                            </Typography>
                                        )} */}
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                                {index < meetings.length - 1 && <Divider variant="inset" component="li" />}
                                            </React.Fragment>
                                        );
                                    })}
                                </List>
                            )}
                        </Menu>

                        {/* User Profile */}
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ gap: "15px" }}>
                            <Typography color="text.primary" sx={{ display: { xs: 'none', md: 'block' } }}>
                                Hi, {parentdetails?.name}
                            </Typography>
                            <Tooltip title="Profile">
                                <IconButton onClick={navigateToProfile} sx={{ p: 0 }}>
                                    {parentdetails?.profilePic?.filename ? (
                                        <Avatar
                                            src={`${import.meta.env.VITE_SERVER_URL}/uploads/${parentdetails.profilePic.filename}`}
                                            alt={parentdetails.name}
                                        />
                                    ) : (
                                        <Avatar>{parentdetails?.name?.charAt(0)}</Avatar>
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default ParentNavbar;