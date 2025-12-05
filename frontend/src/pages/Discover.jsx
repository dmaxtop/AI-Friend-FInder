// frontend/src/pages/Discover.jsx (Fixed with proper default export)
import React from 'react';
import { Typography, Container, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Explore, People, LocationOn, Psychology, Groups, Event } from '@mui/icons-material';

const DiscoverContainer = styled(Container)`
  padding: clamp(1rem, 4vw, 3rem);
  min-height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
    min-height: calc(100vh - 120px);
  }
`;

const DiscoverTitle = styled(Typography)`
  font-size: clamp(1.8rem, 5vw, 3rem) !important;
  font-weight: 800 !important;
  text-align: center !important;
  margin-bottom: clamp(1rem, 3vw, 2rem) !important;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DiscoverSubtitle = styled(Typography)`
  font-size: clamp(1rem, 2.5vw, 1.5rem) !important;
  text-align: center !important;
  margin-bottom: clamp(2rem, 5vw, 4rem) !important;
  max-width: 800px;
  margin-left: auto !important;
  margin-right: auto !important;
  line-height: 1.6;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  min-height: clamp(250px, 30vh, 320px);
  border-radius: clamp(12px, 2vw, 20px) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(clamp(-4px, -1vw, -8px));
    box-shadow: 0 clamp(8px, 2vw, 15px) clamp(25px, 5vw, 40px) rgba(76, 175, 80, 0.2) !important;
  }
`;

const IconWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-bottom: clamp(0.5rem, 2vw, 1rem);
  
  .MuiSvgIcon-root {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    transition: all 0.3s ease;
  }
  
  &:hover .MuiSvgIcon-root {
    transform: scale(1.1);
  }
`;

// ✅ CRITICAL: Discover component with proper default export
const Discover = () => {
  const navigate = useNavigate();

  // In your discoveryFeatures array, update the actions:
const discoveryFeatures = [
  {
    icon: <People />,
    title: 'Find People Nearby',
    description: 'Discover potential friends in your local area with advanced location-based AI matching algorithms.',
    color: '#4caf50',
    action: () => navigate('/discover/nearby')
  },
  {
    icon: <Psychology />,
    title: 'AI Personality Match',
    description: 'Our advanced AI analyzes personality traits and interests to find your most compatible friends.',
    color: '#2196f3',
    action: () => navigate('/discover/personality')
  },
  {
    icon: <LocationOn />,
    title: 'Local Events & Activities',
    description: 'Find local events, meetups, and activities where you can meet like-minded people in person.',
    color: '#ff9800',
    action: () => navigate('/discover/events')
  },
  {
    icon: <Groups />,
    title: 'Interest Groups',
    description: 'Join groups based on your hobbies and interests to connect with people who share your passions.',
    color: '#9c27b0',
    action: () => navigate('/discover/groups')
  },
  {
    icon: <Explore />,
    title: 'Explore New Interests',
    description: 'Discover new hobbies and activities to expand your social circle and meet diverse friends.',
    color: '#f44336',
    action: () => navigate('/discover/interests')
  },
  {
    icon: <Event />,
    title: 'Friendship Events',
    description: 'Attend curated friendship events and social gatherings designed for meaningful connections.',
    color: '#00bcd4',
    action: () => navigate('/discover/friendship-events')
  }
];



  return (
    <DiscoverContainer maxWidth="xl">
      <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 6 } }}>
        <DiscoverTitle variant="h2" component="h1">
          Discover Your Perfect Friends
        </DiscoverTitle>
        <DiscoverSubtitle variant="h6" color="text.secondary">
          Use our AI-powered discovery tools to find compatible friends based on interests, location, personality, and shared activities
        </DiscoverSubtitle>
      </Box>

      <Grid 
        container 
        spacing={{ xs: 2, sm: 3, md: 4 }} 
        justifyContent="center"
        sx={{ maxWidth: '1400px', margin: '0 auto' }}
      >
        {discoveryFeatures.map((feature, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
            <FeatureCard>
              <CardContent sx={{ 
                textAlign: 'center', 
                padding: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <IconWrapper>
                  <Box sx={{ color: feature.color }}>
                    {feature.icon}
                  </Box>
                </IconWrapper>
                
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                    fontWeight: 600,
                    color: feature.color,
                    mb: 2
                  }}
                >
                  {feature.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    flexGrow: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.6,
                    mb: 3
                  }}
                >
                  {feature.description}
                </Typography>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={feature.action}
                  sx={{ 
                    mt: 'auto',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    padding: { xs: '12px', sm: '14px', md: '16px' },
                    background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}aa 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${feature.color}dd 0%, ${feature.color}88 100%)`,
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  Explore Now
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: { xs: 4, sm: 5, md: 6 } }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/matches')}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 600,
            padding: { xs: '12px 24px', sm: '16px 32px' },
            borderColor: '#4caf50',
            color: '#4caf50',
            '&:hover': {
              borderColor: '#2e7d32',
              backgroundColor: 'rgba(76, 175, 80, 0.1)'
            }
          }}
        >
          Start Finding Friends
        </Button>
      </Box>
    </DiscoverContainer>
  );
};

// ✅ CRITICAL: Proper default export (this was missing!)
export default Discover;
