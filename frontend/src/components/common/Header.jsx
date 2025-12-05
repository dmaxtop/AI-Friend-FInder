// frontend/src/components/common/Header.jsx (Fixed & Enhanced)
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  CssBaseline
} from '@mui/material';
import {
  Favorite,
  Person,
  Analytics,
  ExitToApp,
  Explore, // ✅ Discovery icon
  Home
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

// ✅ Fixed: Proper AppBar styling to prevent cropping
const StyledAppBar = styled(AppBar)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
  backdrop-filter: blur(10px);
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1300 !important;
  
  /* ✅ Ensure no margin/padding issues */
  margin: 0 !important;
  width: 100% !important;
`;

// ✅ Fixed: Proper toolbar with gutters disabled
const StyledToolbar = styled(Toolbar)`
  min-height: 64px !important;
  padding: 0 clamp(1rem, 3vw, 2rem) !important;
  
  @media (max-width: 600px) {
    min-height: 56px !important;
    padding: 0 1rem !important;
  }
`;

const LogoSection = styled(Box)`
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-grow: 1;
  min-width: 0;
`;

const LogoText = styled(Typography)`
  font-weight: 700 !important;
  font-size: clamp(1rem, 3vw, 1.5rem) !important;
  margin-left: 0.5rem !important;
  color: white !important;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const NavSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 1vw, 0.5rem);
`;

// ✅ Enhanced: Colored icon buttons with hover effects
const ColoredNavButton = styled(IconButton)`
  padding: clamp(8px, 2vw, 12px) !important;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  backdrop-filter: blur(10px);
  
  &.home {
    background: rgba(255, 193, 7, 0.15) !important;
    color: #ffc107 !important;
    
    &:hover {
      background: rgba(255, 193, 7, 0.25) !important;
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
    }
    
    &.active {
      background: rgba(255, 193, 7, 0.3) !important;
      transform: scale(1.05);
    }
  }
  
  &.discover {
    background: rgba(76, 175, 80, 0.15) !important;
    color: #4caf50 !important;
    
    &:hover {
      background: rgba(76, 175, 80, 0.25) !important;
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    }
    
    &.active {
      background: rgba(76, 175, 80, 0.3) !important;
      transform: scale(1.05);
    }
  }
  
  &.matches {
    background: rgba(233, 30, 99, 0.15) !important;
    color: #e91e63 !important;
    
    &:hover {
      background: rgba(233, 30, 99, 0.25) !important;
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
    }
    
    &.active {
      background: rgba(233, 30, 99, 0.3) !important;
      transform: scale(1.05);
    }
  }
  
  &.analytics {
    background: rgba(197, 154, 24, 0.47) !important;
    color: #ffc107 !important;
    
    &:hover {
      background: rgba(223, 219, 3, 0.25) !important;
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(153, 160, 53, 0.3);
    }
    
    &.active {
      background: rgba(151, 149, 19, 0.3) !important;
      transform: scale(1.05);
    }
  }
  
  &.profile {
    background: rgba(255, 152, 0, 0.15) !important;
    color: #ff9800 !important;
    
    &:hover {
      background: rgba(255, 152, 0, 0.25) !important;
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
    }
    
    &.active {
      background: rgba(255, 152, 0, 0.3) !important;
      transform: scale(1.05);
    }
  }
  
  .MuiSvgIcon-root {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  }
`;

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(480));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleCloseMenu();
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // ✅ Enhanced: Navigation items with discovery icon
  const navigationItems = [
    { 
      path: '/analytics', 
      icon: <Analytics />, 
      label: 'Analytics',
      className: 'analytics'
    },
    { 
      path: '/discover', 
      icon: <Explore />, 
      label: 'Discover',
      className: 'discover'
    },
    { 
      path: '/matches', 
      icon: <Favorite />, 
      label: 'Matches',
      className: 'matches'
    },
    
    { 
      path: '/profile', 
      icon: <Person />, 
      label: 'Profile',
      className: 'profile'
    },
  ];

  return (
    <>
      {/* ✅ Fixed: Add CssBaseline to remove default margins */}
      <CssBaseline />
      
      <StyledAppBar position="fixed">
        <StyledToolbar disableGutters>
          <LogoSection onClick={() => navigate('/dashboard')}>
            <Favorite sx={{ 
              fontSize: { xs: '1.4rem', sm: '1.8rem' },
              color: '#ff6b9d',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} />
            {!isExtraSmall && (
              <LogoText variant="h6" component="div">
                {isMobile ? 'AFF' : 'AI Friend Finder'}
              </LogoText>
            )}
          </LogoSection>

          <NavSection>
            {navigationItems.map((item) => (
              <ColoredNavButton 
                key={item.path}
                className={`${item.className} ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                title={item.label}
                size={isMobile ? 'small' : 'medium'}
              >
                {item.icon}
              </ColoredNavButton>
            ))}

            <IconButton 
              onClick={handleProfileMenu} 
              sx={{ 
                ml: { xs: 0.5, sm: 1 },
                padding: { xs: '6px', sm: '8px' }
              }}
            >
              <Avatar
                src={user?.profileImage}
                alt={user?.firstName}
                sx={{ 
                  width: { xs: 32, sm: 40 }, 
                  height: { xs: 32, sm: 40 },
                  border: '3px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </NavSection>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 180,
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                mt: 1,
                '& .MuiMenuItem-root': {
                  borderRadius: 2,
                  margin: '4px 8px',
                  transition: 'all 0.2s ease'
                }
              }
            }}
          >
            <MenuItem 
              onClick={() => { navigate('/profile'); handleCloseMenu(); }}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                padding: { xs: '8px 16px', sm: '12px 20px' },
                '&:hover': {
                  background: 'rgba(255, 152, 0, 0.1)',
                  color: '#ff9800'
                }
              }}
            >
              <Person sx={{ mr: 2, color: '#ff9800', fontSize: '1.2rem' }} />
              Profile
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                padding: { xs: '8px 16px', sm: '12px 20px' },
                '&:hover': {
                  background: 'rgba(244, 67, 54, 0.1)',
                  color: '#f44336'
                }
              }}
            >
              <ExitToApp sx={{ mr: 2, color: '#f44336', fontSize: '1.2rem' }} />
              Logout
            </MenuItem>
          </Menu>
        </StyledToolbar>
      </StyledAppBar>
      
      {/* ✅ Fixed: Add proper spacing to prevent content from being hidden */}
      <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }} />
    </>
  );
};

export default Header;
