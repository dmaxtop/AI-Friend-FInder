// frontend/src/components/common/LoadingSpinner.jsx
import React from 'react';
import styled from 'styled-components';
import { CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const SpinnerContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
`;

const StyledProgress = styled(CircularProgress)`
  margin-bottom: 1rem;
  
  & .MuiCircularProgress-circle {
    stroke: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  }
`;

const LoadingSpinner = ({ 
  size = 40, 
  message = "Loading...", 
  color = "primary",
  showMessage = true 
}) => {
  return (
    <SpinnerContainer
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <StyledProgress 
          size={size} 
          color={color}
          thickness={4}
        />
        {showMessage && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;

