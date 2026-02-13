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
import MenuItem from '@mui/material/MenuItem';
import LogoHub from "../../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import { Divider, List, ListItem, ListItemText, Paper } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import axiosInstance from '../../Api_service/baseUrl';

const pages = [
    { label: 'Home', path: '/educator/home' },
    { label: 'About', path: '/educator/about' },
    { label: 'Contact', path: '/educator/contact' },
    { label: 'All students', path: '/educator/allstudents' },
    { label: 'Parents', path: '/educator/acceptedparents' },
    // { label: 'Meetings', path: '/educator/meeting' },
    // { label: 'Blogs', path: '/educator/blogs' },

];

const EducatorNavbar = ({ homebg = {}, aboutBg = {}, contactbg = {}, navigateToProfile = () => { }, profilebg = {}, educatorDetails = {} }) => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenNotificationMenu = (event) => {
        setNotificationAnchor(event.currentTarget);
        setUnreadCount(0);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseNotificationMenu = () => {
        setNotificationAnchor(null);
    };

    const location = useLocation();

    // Function to check if a meeting is upcoming
    const isMeetingUpcoming = (meeting) => {
        if (!meeting?.date || !meeting?.endTime) return false;

        const now = new Date();
        const meetingDate = new Date(meeting.date);

        // Compare dates first
        if (meetingDate.toDateString() !== now.toDateString()) {
            return meetingDate > now;
        }

        // If same date, compare end time
        const [endHours, endMinutes] = meeting.endTime.split(':').map(Number);
        const meetingEndTime = new Date(meetingDate);
        meetingEndTime.setHours(endHours, endMinutes, 0, 0);

        return meetingEndTime > now;
    };

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const educatorId = JSON.parse(localStorage.getItem("educatorDetails"))?._id;

                if (!educatorId) return;

                const response = await axiosInstance.get(`/educator/viewmeeting/${educatorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const fetchedMeetings = response.data.meetings || [];
                setMeetings(fetchedMeetings);

                // Calculate upcoming meetings
                const upcoming = fetchedMeetings.filter(meeting => isMeetingUpcoming(meeting));
                setUnreadCount(upcoming.length);
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

    // Filter upcoming meetings
    const upcomingMeetings = meetings.filter(meeting => isMeetingUpcoming(meeting));

    // Format time to 12-hour format
    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AppBar position="static" sx={{ zIndex: 100, boxShadow: "none", backgroundColor: 'transparent', backgroundImage: `url(${contactbg})`, ...homebg, ...aboutBg, ...profilebg, mt: "10px", ...contactbg }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Left side - Logo and Brand */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/educator/home">
                            <Box component="img" src={LogoHub} alt='logo' sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        </Link>
                        <Link to="/educator/home" style={{ textDecoration: "none" }}>
                            <Typography variant="h6" noWrap sx={{
                                mr: 2, display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem',
                                textDecoration: 'none', color: '#384371'
                            }}>
                                LearnHub
                            </Typography>
                        </Link>
                    </Box>

                    {/* Mobile menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon sx={{ color: "#384371" }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.label} to={page.path} onClick={handleCloseNavMenu} component={'Link'}>
                                    <Typography color='primary' sx={{ textAlign: 'center', color: '#1967D2' }}>
                                        {page.label}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Mobile logo */}
                    <Link to='/educator/home'>
                        <Box component="img" src={LogoHub} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    </Link>
                    <Link to="/educator/home" style={{ textDecoration: "none" }}>
                        <Typography
                            variant="h5"
                            color='primary'
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                textDecoration: 'none',
                            }}
                        >
                            LearnHub
                        </Typography>
                    </Link>

                    {/* Desktop menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: "40px" }}>
                        {pages.map((page) => (
                            <Link style={{ textDecoration: "none" }} key={page.label} onClick={handleCloseNavMenu} to={page.path}>
                                <Typography color='primary' sx={{
                                    my: 2, fontSize: "14px", fontWeight: "500", display: 'block', textTransform: "inherit", borderBottom: location.pathname === page.path ? "1px solid #1967D2" : "none", '&:hover': {
                                        borderBottom: "1px solid #1967D2",
                                        color: '#1967D2'
                                    }
                                }}> {page.label}</Typography>
                            </Link>
                        ))}
                    </Box>

                    {/* Right side - Icons and profile */}
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ flexGrow: 0, gap: "30px" }}>
                        {/* Chat Icon */}
                        <Link to={'/educator/chat'}>
                            <SmsOutlinedIcon color="primary" sx={{ height: '24px' }} />
                        </Link>

                        {/* Notifications */}
                        <IconButton onClick={handleOpenNotificationMenu} color="inherit">
                            <Box sx={{ position: 'relative' }}>
                                <NotificationsOutlinedIcon color="primary" sx={{ height: '24px' }} />
                                {/* {unreadCount > 0 && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -5,
                                            right: -5,
                                            backgroundColor: 'red',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {unreadCount}
                                    </Box>
                                )} */}
                            </Box>
                        </IconButton>

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
                                <Typography sx={{ p: 2 }}>Loading notifications...</Typography>
                            ) : upcomingMeetings.length === 0 ? (
                                <Typography sx={{ p: 2 }}>No upcoming meetings</Typography>
                            ) : (
                                <List>
                                    {upcomingMeetings.map((meeting, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem alignItems="flex-start">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EventIcon color="primary" sx={{ mr: 1 }} />
                                                </Box>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle1" color="text.primary">
                                                            {meeting?.meetingTitle}
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
                                                                {formatDate(meeting?.date)} | {formatTime(meeting?.startTime)} - {formatTime(meeting?.endTime)}
                                                            </Typography>
                                                            {/* <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="text.secondary"
                                                                display="block"
                                                            >
                                                                With: {meeting.parentId?.name || 'Parent'}
                                                            </Typography>
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
                                            {index < upcomingMeetings.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </Menu>

                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ gap: "30px" }}>
                            <Typography color='secondary'>Hi, {educatorDetails.name}</Typography>
                            {educatorDetails?.profilePic?.filename ? (
                                <Avatar onClick={navigateToProfile} src={`${import.meta.env.VITE_SERVER_URL}/uploads/${educatorDetails?.profilePic?.filename}`} alt={educatorDetails?.name} />
                            ) : (
                                <Avatar onClick={navigateToProfile}>{educatorDetails?.name?.charAt(0)}</Avatar>
                            )}
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default EducatorNavbar;