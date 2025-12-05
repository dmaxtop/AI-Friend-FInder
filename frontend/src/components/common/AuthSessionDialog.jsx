// frontend/src/components/common/AuthSessionDialog.jsx (Fixed Material-UI props)
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import {
  Security,
  Login,
  Home
} from '@mui/icons-material';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: clamp(16px, 3vw, 24px);
    max-width: 500px;
    width: 90%;
    background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
`;

const AuthSessionDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  
  const shouldShowDialog = !isAuthenticated && 
    location.pathname !== '/login' && 
    location.pathname !== '/register' &&
    location.pathname !== '/';

  const handleLoginRedirect = () => {
    const currentPath = location.pathname !== '/login' ? location.pathname : '/dashboard';
    navigate('/login', { 
      replace: true,
      state: { from: currentPath }
    });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  if (!shouldShowDialog) {
    return null;
  }

  return (
    <AnimatePresence>
      <StyledDialog
        open={shouldShowDialog}
        aria-labelledby="auth-required-dialog-title"
        aria-describedby="auth-required-dialog-description"
        // ✅ FIXED: Removed deprecated disableBackdropClick
        // ✅ FIXED: Removed deprecated disableEscapeKeyDown
        onClose={(event, reason) => {
          // Prevent closing on backdrop click or escape key
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <DialogTitle id="auth-required-dialog-title" sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={60}
                height={60}
                borderRadius="50%"
                sx={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' }}
              >
                <Security sx={{ fontSize: '2rem', color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h5" component="h2" fontWeight="700">
                  Authentication Required
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please log in to continue
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent>
            <Alert 
              severity="info" 
              icon={<Security />}
              sx={{ 
                mb: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              You need to be logged in to access this page.
            </Alert>

            <DialogContentText 
              id="auth-required-dialog-description"
              sx={{ 
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'text.primary'
              }}
            >
              To use <strong>AI Friend Finder</strong> and discover your perfect matches, 
              please log in to your account or create a new one.
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={handleGoHome}
              startIcon={<Home />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                border: '2px solid #e5e7eb',
                color: '#6b7280'
              }}
            >
              Go Home
            </Button>
            
            <Button
              onClick={handleLoginRedirect}
              variant="contained"
              startIcon={<Login />}
              autoFocus
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a5fd8 0%, #7c3aed 100%)'
                }
              }}
            >
              Login Now
            </Button>
          </DialogActions>
        </motion.div>
      </StyledDialog>
    </AnimatePresence>
  );
};

export default AuthSessionDialog;
