import {
    Business as BusinessIcon,
    Chat as ChatIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Home as HomeIcon,
    Settings as SettingsIcon,
  } from "@mui/icons-material";
  import {
    AppBar,
    Avatar,
    Box,
    Button,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Divider,
    Badge,
  } from "@mui/material";
  import React from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import { useAuth } from "../context/AuthContext";
  
  const Header = ({ onChatbotToggle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = () => {
      logout();
      navigate("/signin");
      handleMenuClose();
    };
  
    const handleNavigation = (path) => {
      navigate(path);
      handleMenuClose();
    };
  
    const handleChatbotToggle = () => {
      if (onChatbotToggle) {
        onChatbotToggle();
      }
    };

    const isActiveRoute = (path) => {
      return location.pathname === path;
    };
  
    if (!user) {
      return null;
    }
  
    return (
      <AppBar position="static" elevation={1} sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar sx={{ px: { xs: 1, md: 3 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
            onClick={() => navigate('/dashboard')}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: "bold",
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              🚗 Car Services
            </Typography>
          </Box>
  
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: 4 }}>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                backgroundColor: isActiveRoute('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<BusinessIcon />}
              onClick={() => navigate("/service-stations")}
              sx={{
                backgroundColor: isActiveRoute('/service-stations') ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }
              }}
            >
              Service Stations
            </Button>
            <Button
              color="inherit"
              startIcon={<ScheduleIcon />}
              onClick={() => navigate("/appointments")}
              sx={{
                backgroundColor: isActiveRoute('/appointments') ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }
              }}
            >
              Appointments
            </Button>
            <Button
              color="inherit"
              startIcon={<ChatIcon />}
              onClick={handleChatbotToggle}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }
              }}
            >
              Chat Support
            </Button>
          </Box>
  
          {/* User Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
            <Chip
              label={user.role || "User"}
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '& .MuiChip-label': {
                  color: 'white',
                }
              }}
            />
            <IconButton 
              color="inherit" 
              onClick={handleMenuOpen} 
              sx={{ 
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'success.main',
                      border: '2px solid white',
                    }}
                  />
                }
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                  <PersonIcon />
                </Avatar>
              </Badge>
            </IconButton>
          </Box>
  
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            sx={{ 
              display: { xs: "flex", md: "none" },
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
  
          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ 
              display: { xs: "block", md: "none" },
              '& .MuiPaper-root': {
                minWidth: 200,
                mt: 1,
              }
            }}
          >
            <MenuItem onClick={() => handleNavigation("/dashboard")}>
              <DashboardIcon sx={{ mr: 2, color: isActiveRoute('/dashboard') ? 'primary.main' : 'inherit' }} />
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/service-stations")}>
              <BusinessIcon sx={{ mr: 2, color: isActiveRoute('/service-stations') ? 'primary.main' : 'inherit' }} />
              Service Stations
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/appointments")}>
              <ScheduleIcon sx={{ mr: 2, color: isActiveRoute('/appointments') ? 'primary.main' : 'inherit' }} />
              Appointments
            </MenuItem>
            <MenuItem onClick={handleChatbotToggle}>
              <ChatIcon sx={{ mr: 2 }} />
              Chat Support
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Header;
