// frontend/src/components/common/Footer.jsx
import React from 'react';
import styled from 'styled-components';
import { Box, Typography, Container } from '@mui/material';
import { Favorite } from '@mui/icons-material';

const StyledFooter = styled(Box)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  margin-top: auto;
`;

const Footer = () => {
  return (
    <StyledFooter component="footer">
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Favorite sx={{ mr: 1 }} />
          <Typography variant="body2">
            AI Friend Finder © 2025 - Connecting Hearts with Intelligence
          </Typography>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 1, opacity: 0.8 }}>
          Built with MERN Stack & MVC Architecture
        </Typography>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
