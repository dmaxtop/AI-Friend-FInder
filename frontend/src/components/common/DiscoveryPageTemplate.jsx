// Reusable template for all discovery pages
import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowBack } from '@mui/icons-material';

const PageContainer = styled(Container)`
  padding: clamp(1rem, 4vw, 3rem);
  min-height: calc(100vh - 140px);
  
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
  }
`;

const PageHeader = styled(Box)`
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 4rem);
`;

const PageTitle = styled(Typography)`
  font-size: clamp(1.8rem, 4vw, 2.5rem) !important;
  font-weight: 800 !important;
  margin-bottom: 1rem !important;
  background: ${props => props.$gradient || 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BackButton = styled(Button)`
  margin-bottom: 2rem !important;
  border-radius: 25px !important;
  text-transform: none !important;
  font-weight: 600 !important;
`;

const DiscoveryPageTemplate = ({ 
  title, 
  subtitle, 
  gradient, 
  icon: Icon,
  color,
  children 
}) => {
  const navigate = useNavigate();

  return (
    <PageContainer maxWidth="xl">
      <BackButton 
        startIcon={<ArrowBack />}
        onClick={() => navigate('/discover')}
        variant="outlined"
        sx={{ 
          borderColor: color || '#4caf50',
          color: color || '#4caf50'
        }}
      >
        Back to Discover
      </BackButton>

      <PageHeader>
        {Icon && (
          <Box sx={{ mb: 2 }}>
            <Icon sx={{ 
              fontSize: { xs: '3rem', sm: '4rem' }, 
              color: color || '#4caf50' 
            }} />
          </Box>
        )}
        
        <PageTitle $gradient={gradient}>
          {title}
        </PageTitle>
        
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            lineHeight: 1.6
          }}
        >
          {subtitle}
        </Typography>
      </PageHeader>

      {children}
    </PageContainer>
  );
};

export { DiscoveryPageTemplate as default };
