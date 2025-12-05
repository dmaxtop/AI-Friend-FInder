import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, CardContent, LinearProgress, Button, Chip, Avatar } from '@mui/material';
import { Psychology, TrendingUp } from '@mui/icons-material';
import DiscoveryPageTemplate from '../components/common/DiscoveryPageTemplate';
import { getPotentialMatches } from '../services/api';

const PersonalityMatch = () => {
  const [personalityMatches, setPersonalityMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPersonalityMatches();
  }, []);

  const fetchPersonalityMatches = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      const response = await getPotentialMatches(userId, { limit: 15, minScore: 0.4 });
      setPersonalityMatches(response.matches || []);
    } catch (error) {
      console.error('Error fetching personality matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilityColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <DiscoveryPageTemplate
      title="AI Personality Matching"
      subtitle="Find friends with compatible personalities using advanced psychological profiling"
      icon={Psychology}
      color="#2196f3"
      gradient="linear-gradient(135deg, #2196f3 0%, #1565c0 100%)"
    >
      {/* Your Personality Profile Card */}
      <Card sx={{ 
        mb: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
        border: '1px solid rgba(33, 150, 243, 0.2)'
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#1565c0', fontWeight: 600 }}>
            Your Personality Profile Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Based on your profile analysis, we match you with compatible personalities
          </Typography>
          <Grid container spacing={2}>
            {[
              { trait: 'Openness', score: 75 },
              { trait: 'Conscientiousness', score: 68 },
              { trait: 'Extraversion', score: 82 },
              { trait: 'Agreeableness', score: 91 },
              { trait: 'Emotional Stability', score: 73 }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item.trait}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.trait}</Typography>
                    <Typography variant="body2" sx={{ color: '#1565c0', fontWeight: 600 }}>
                      {item.score}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.score} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #2196f3, #1565c0)'
                      }
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Personality Matches Grid */}
      <Grid container spacing={3}>
        {personalityMatches.map((match, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)' 
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ width: 50, height: 50, mr: 2 }}
                    src={match.user?.profileImages?.[0]?.url}
                  >
                    {match.user?.firstName?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{match.user?.firstName}, {match.user?.age}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {match.user?.location}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${Math.round(match.similarityScore * 100)}% Compatible`}
                    sx={{ 
                      background: `linear-gradient(135deg, ${getCompatibilityColor(match.similarityScore * 100)}, ${getCompatibilityColor(match.similarityScore * 100)}aa)`,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>

                <Typography variant="subtitle2" gutterBottom sx={{ color: '#2196f3', mb: 2 }}>
                  Personality Compatibility Breakdown
                </Typography>

                {match.matchingAspects?.slice(0, 4).map((aspect, idx) => (
                  <Box key={idx} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">
                        {aspect.aspect}
                      </Typography>
                      <Typography variant="body2" sx={{ color: getCompatibilityColor(aspect.score), fontWeight: 600 }}>
                        {aspect.score}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={aspect.score} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': { 
                          backgroundColor: getCompatibilityColor(aspect.score) 
                        }
                      }}
                    />
                  </Box>
                ))}

                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Common Interests:</Typography>
                  <Box>
                    {match.sharedInterests?.slice(0, 3).map((interest, idx) => (
                      <Chip 
                        key={idx} 
                        label={interest} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5, fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                </Box>

                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2196f3, #1565c0)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1976d2, #0d47a1)'
                    }
                  }}
                >
                  Connect Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {personalityMatches.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No personality matches found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete your personality assessment in your profile to get better matches.
          </Typography>
        </Box>
      )}
    </DiscoveryPageTemplate>
  );
};

export default PersonalityMatch;
