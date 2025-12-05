// frontend/src/pages/Dashboard.jsx (Fixed Subtitle Centering)
import React from 'react';
import { Typography, Container, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Analytics, Person, Favorite } from '@mui/icons-material';

const DashboardContainer = styled(Container)`
  padding: clamp(1rem, 4vw, 3rem);
  min-height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 100% !important;
  
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
    min-height: calc(100vh - 120px);
  }
`;

const ResponsiveTitle = styled(Typography)`
  font-size: clamp(1.8rem, 5vw, 3.5rem) !important;
  font-weight: 800 !important;
  margin-bottom: clamp(0.5rem, 2vw, 1rem) !important;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center !important;
  display: block;
  width: 100%;
`;

// ✅ FIXED: Enhanced subtitle centering with multiple fallback methods
const ResponsiveSubtitle = styled(Typography)`
  font-size: clamp(1rem, 2.5vw, 1.5rem) !important;
  margin-bottom: clamp(2rem, 5vw, 4rem) !important;
  
  /* ✅ Multiple centering approaches for maximum compatibility */
  text-align: center !important;
  margin-left: auto !important;
  margin-right: auto !important;
  display: block !important;
  width: 100% !important;
  max-width: 800px !important; /* Increased max-width for better centering */
  
  /* ✅ Additional centering insurance */
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  
  /* ✅ Flexbox fallback for centering */
  @supports (display: flex) {
    position: static;
    left: auto;
    transform: none;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    flex-direction: column;
  }
  
  @media (max-width: 600px) {
    font-size: clamp(0.9rem, 3vw, 1.2rem) !important;
    margin-bottom: clamp(1.5rem, 4vw, 2.5rem) !important;
    padding: 0 1rem;
  }
`;

// ✅ Centered container for title section
const TitleSection = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  margin-bottom: clamp(2rem, 5vw, 4rem);
`;

const StyledCard = styled(Card)`
  height: 100%;
  min-height: clamp(250px, 30vh, 350px);
  display: flex;
  flex-direction: column;
  border-radius: clamp(12px, 2vw, 20px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(clamp(-4px, -1vw, -12px));
    box-shadow: 0 clamp(8px, 2vw, 25px) clamp(20px, 5vw, 50px) rgba(0,0,0,0.15);
  }
`;

const IconWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-bottom: clamp(0.5rem, 2vw, 1.5rem);
  
  .MuiSvgIcon-root {
    font-size: clamp(2rem, 6vw, 4rem);
    color: #6366f1;
    transition: all 0.3s ease;
  }
  
  &:hover .MuiSvgIcon-root {
    transform: scale(1.1);
    color: #5a5fd8;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      icon: <Person />,
      title: 'Your Profile',
      description: 'Complete your profile to get better AI matches based on your interests and personality traits.',
      action: () => navigate('/profile'),
      buttonText: 'Edit Profile',
      color: '#6366f1'
    },
    {
      icon: <Favorite />,
      title: 'AI Matches',
      description: 'Discover friends with AI-powered compatibility scoring and intelligent recommendations.',
      action: () => navigate('/matches'),
      buttonText: 'Find Friends',
      color: '#ec4899'
    },
    {
      icon: <Analytics />,
      title: 'Compatibility Analytics',
      description: 'Analyze detailed compatibility metrics and friendship potential with advanced AI insights.',
      action: () => navigate('/analytics'),
      buttonText: 'Coming Soon',
      color: '#8b5cf6',
      disabled: true
    }
  ];

  return (
    <DashboardContainer maxWidth={false}>
      {/* ✅ FIXED: Wrapped title and subtitle in centered container */}
      <TitleSection>
        <ResponsiveTitle variant="h2" component="h1">
          AI Friend Finder Dashboard
        </ResponsiveTitle>
        <ResponsiveSubtitle variant="h6" color="text.secondary">
          Welcome to your personalized friend discovery experience powered by artificial intelligence
        </ResponsiveSubtitle>
      </TitleSection>
      
      <Grid 
        container 
        spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }} 
        justifyContent="center"
        sx={{ maxWidth: '1400px', margin: '0 auto' }}
      >
        {cardData.map((card, index) => (
          <Grid 
            key={index}
            size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}
            sx={{ display: 'flex' }}
          >
            <StyledCard sx={{ width: '100%' }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                padding: { xs: 2, sm: 3, md: 4 },
                textAlign: 'center'
              }}>
                <IconWrapper>
                  {card.icon}
                </IconWrapper>
                
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                    fontWeight: 600,
                    color: card.color
                  }}
                >
                  {card.title}
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
                  {card.description}
                </Typography>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  disabled={card.disabled}
                  onClick={card.action}
                  sx={{ 
                    mt: 'auto',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    padding: { xs: '12px', sm: '14px', md: '16px' },
                    background: card.disabled 
                      ? undefined 
                      : `linear-gradient(135deg, ${card.color} 0%, ${card.color}aa 100%)`,
                    '&:hover': card.disabled ? {} : {
                      background: `linear-gradient(135deg, ${card.color}dd 0%, ${card.color}88 100%)`,
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  {card.buttonText}
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;
