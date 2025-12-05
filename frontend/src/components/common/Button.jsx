// frontend/src/components/common/Button.jsx
import React from 'react';
import styled from 'styled-components';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const StyledButton = styled(motion(MuiButton))`
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  padding: 12px 24px;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    &:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }
  }
  
  &.secondary {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    
    &:hover {
      background: linear-gradient(135deg, #e681f9 0%, #f04458 100%);
    }
  }
`;

const Button = ({ 
  children, 
  loading = false, 
  variant = "primary",
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <StyledButton
      className={variant}
      variant="contained"
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button;
