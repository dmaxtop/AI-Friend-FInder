// frontend/src/components/matching/SwipeStack.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Typography, Box, Alert, Button, useTheme, useMediaQuery, Divider } from '@mui/material';
import { Groups, RestartAlt, Home, ArrowBack } from '@mui/icons-material';
import SwipeCard from './SwipeCard';
import { fetchMatches } from '../../store/slices/matchSlice';
import LoadingSpinner from '../common/LoadingSpinner';

// Debug: File is being imported
console.log('📂 [LOAD] SwipeStack.jsx file imported');

// Styled components
const ResponsiveContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Changed from center to flex-start */
  min-height: calc(100vh - 140px);
  padding: clamp(3rem, 5vw, 5rem) clamp(2rem, 4vw, 4rem) clamp(2rem, 4vw, 4rem); /* Added more top padding */
  width: 100%;
  max-width: 100% !important;
  margin-top: 2rem; /* Added explicit top margin */
`;

const SingleCardContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 800px;
  margin-top: 2rem; /* Added top margin */
  
  @media (max-width: 600px) {
    min-height: 700px;
    margin-top: 1rem;
  }
`;

const TitleSection = styled(Box)`
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  margin-top: 1rem; /* Added top margin */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ResponsiveTitle = styled(Typography)`
  font-size: clamp(1.8rem, 4.5vw, 3rem) !important;
  font-weight: 800 !important;
  background: linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem !important;
  text-align: center !important;
`;

const ResponsiveSubtitle = styled(Typography)`
  font-size: clamp(0.9rem, 2vw, 1.3rem) !important;
  color: #7b1fa2 !important;
  font-weight: 600 !important;
  max-width: 600px;
  margin: 0 auto !important;
  text-align: center !important;
`;

// ✅ NEW: Stats section with top results indicator
const StatsSection = styled(Box)`
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(106, 27, 154, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(106, 27, 154, 0.1);
  width: 100%;
  max-width: 600px;
`;

// ✅ UPDATED: Bottom navigation section
const BottomNavigationSection = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  padding: 1rem;
  width: 100%;
  max-width: 300px;
`;

const HeaderButtonsSection = styled(Box)`
  display: flex;
  justify-content: center;
  gap: clamp(16px, 4vw, 24px);
  margin-bottom: clamp(1rem, 3vw, 2rem);
  flex-wrap: wrap;
`;

const HeaderButton = styled(Button)`
  border-radius: 16px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: clamp(0.8rem, 2vw, 1rem) !important;
  padding: clamp(8px 16px, 2vw, 12px 24px) !important;
  
  &.matched {
    background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%) !important;
    color: white !important;
    
    &:hover {
      background: linear-gradient(135deg, #388e3c 0%, #2e7d32 100%) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
    }
  }
`;

// ✅ UPDATED: Single navigation button
const NavButton = styled(Button)`
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: clamp(0.85rem, 2vw, 1rem) !important;
  padding: clamp(12px 24px, 3vw, 16px 32px) !important;
  min-width: 160px;
  
  &.back-home {
    background: linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%) !important;
    color: white !important;
    &:hover {
      background: linear-gradient(135deg, #5e1a87 0%, #3e0f7a 100%) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(106, 27, 154, 0.3);
    }
  }
`;

const DailyLimitContainer = styled(Box)`
  text-align: center;
  padding: clamp(2rem, 5vw, 4rem);
  max-width: 600px;
  margin: 0 auto;
  margin-top: 2rem; /* Added top margin */
`;

const LimitMessage = styled(Typography)`
  font-size: clamp(1.5rem, 4vw, 2.2rem) !important;
  font-weight: 700 !important;
  color: #6a1b9a !important;
  margin-bottom: 1rem !important;
`;

const LimitSubMessage = styled(Typography)`
  font-size: clamp(0.9rem, 2vw, 1.2rem) !important;
  color: #7b1fa2 !important;
  margin-bottom: 2rem !important;
  line-height: 1.6;
`;

const ActionButton = styled(Button)`
  border-radius: 16px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: clamp(0.9rem, 2vw, 1.1rem) !important;
  padding: clamp(12px 20px, 3vw, 16px 32px) !important;
  margin: 0 8px !important;
  
  &.matched-friends {
    background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%) !important;
    color: white !important;
    
    &:hover {
      background: linear-gradient(135deg, #388e3c 0%, #2e7d32 100%) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
    }
  }
  
  &.secondary {
    background: transparent !important;
    border: 2px solid #9c27b0 !important;
    color: #9c27b0 !important;
    
    &:hover {
      background: rgba(156, 39, 176, 0.1) !important;
      border-color: #7b1fa2 !important;
    }
  }
`;

// Component
const SwipeStack = ({ cards = [] }) => {
  console.log('🟢 [INIT] SwipeStack component function executed', { cardsPassed: cards.length });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { matches, isLoading, error } = useSelector((state) => state.matches);
  const { user } = useSelector((state) => state.auth);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedCount, setSwipedCount] = useState(0);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);

  const DAILY_LIMIT = 999;

  // ✅ Decide the data source
  const dataSource = cards.length > 0 ? cards : matches;
  console.log('📦 [DATA SOURCE]', {
    usingCardsProp: cards.length > 0,
    cardsLength: cards.length,
    matchesLength: matches.length
  });

  // Get userId helper function
  const getUserId = () => {
    const sources = [
      user?.id,
      user?._id,
      user?.userId,
      JSON.parse(localStorage.getItem('user') || '{}')?.id,
      JSON.parse(localStorage.getItem('user') || '{}')._id
    ];
    return sources.find(id => id && typeof id === 'string' && id.length >= 12);
  };

  useEffect(() => {
    console.log('⚡ [USE EFFECT] Checking if we should fetch Redux matches');
    if (!cards.length && user) {
      console.log('📡 Dispatch fetchMatches for user.id:', user.id);
      dispatch(fetchMatches(user.id));
    }
  }, [dispatch, user, cards.length]);

  useEffect(() => {
    console.log('📅 [USE EFFECT] Initializing daily swipe data');
    const today = new Date().toDateString();
    const dailyData = JSON.parse(localStorage.getItem('dailySwipeData') || '{}');
    if (dailyData.date === today) {
      setSwipedCount(dailyData.count || 0);
      setDailyLimitReached(dailyData.count >= DAILY_LIMIT);
      console.log(`🗓 [DAILY DATA FOUND] count: ${dailyData.count}, limitReached: ${dailyData.count >= DAILY_LIMIT}`);
    } else {
      localStorage.setItem('dailySwipeData', JSON.stringify({ date: today, count: 0 }));
      setSwipedCount(0);
      setDailyLimitReached(false);
      console.log('🆕 [DAILY DATA RESET]');
    }
  }, []);

  const currentCard =
    dataSource && dataSource.length > 0 && currentIndex < dataSource.length
      ? dataSource[currentIndex]
      : null;

  const handleSwipe = async (swipedUser, action) => {
    console.log(`🤚 [SWIPE] User: ${swipedUser?.firstName} (${action})`);
    
    try {
      // ✅ Call backend to record swipe in database
      const response = await fetch(`/api/matches/${user?.id || getUserId()}/swipe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetUserId: swipedUser.id,
          action: action,
          compatibilityScore: swipedUser.compatibilityScore || 0
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ [SWIPE RECORDED]', result.message);
        
        // Check if a match was created
        if (result.data?.matchCreated) {
          console.log('🎉 [MATCH CREATED]', result.data.targetUser);
          // You can add match notification UI here
          alert(`🎉 You matched with ${result.data.targetUser.firstName}!`);
        }
      } else {
        console.error('❌ [SWIPE FAILED]', result.message);
      }

    } catch (error) {
      console.error('❌ [SWIPE API ERROR]', error);
    }

    // ✅ Update frontend state (existing code)
    const newCount = swipedCount + 1;
    setSwipedCount(newCount);
    localStorage.setItem(
      'dailySwipeData',
      JSON.stringify({ date: new Date().toDateString(), count: newCount })
    );
    
    if (newCount >= DAILY_LIMIT) {
      console.warn('🚫 [DAILY LIMIT REACHED]');
      setDailyLimitReached(true);
      return;
    }
    
    // ✅ Move to next card
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1 < dataSource.length ? prev + 1 : 0));
    }, 300);
  };

  // ✅ Navigation handler (only back to home now)
  const handleBackHome = () => {
    console.log('🏠 [ACTION] Back to Home clicked');
    navigate('/dashboard');
  };

  const handleTryTomorrow = () => {
    console.log('📅 [ACTION] Back to Dashboard clicked');
    navigate('/dashboard');
  };

  // Render paths with debug logs
  if (isLoading && !cards.length) {
    console.log('⏳ [RENDER STATE] Loading from Redux');
    return (
      <ResponsiveContainer>
        <LoadingSpinner size={isMobile ? 40 : 50} message="Finding your perfect matches..." />
      </ResponsiveContainer>
    );
  }

  if (error && !cards.length) {
    console.error('🚫 [RENDER STATE] Error:', error);
    return (
      <ResponsiveContainer>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
      </ResponsiveContainer>
    );
  }

  if (dailyLimitReached) {
    console.warn('🚧 [RENDER STATE] Daily limit reached');
    return (
      <ResponsiveContainer>
        <DailyLimitContainer>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: '4rem', mb: 2 }}>⏰</Typography>
            <LimitMessage>No More Options Available Today!</LimitMessage>
            <LimitSubMessage>
              You've reached {DAILY_LIMIT} swipes today. Come back tomorrow or check your matches.
            </LimitSubMessage>
          </Box>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="center" gap={2}>
            <ActionButton className="secondary" startIcon={<Home />} onClick={handleBackHome}>
              Back to Home
            </ActionButton>
          </Box>
        </DailyLimitContainer>
      </ResponsiveContainer>
    );
  }

  if (dataSource.length === 0) {
    console.warn('⚠️ [RENDER STATE] No matches found (empty array)');
    return (
      <ResponsiveContainer>
        <Box textAlign="center" sx={{ maxWidth: 600 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#6a1b9a', mb: 3 }}>
            ❌ No Matches Found
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            There are currently no potential friends to show. Check back later!
          </Typography>
          
          {/* ✅ UPDATED: Only back to home button at bottom */}
          <BottomNavigationSection>
            <NavButton 
              className="back-home" 
              startIcon={<Home />} 
              onClick={handleBackHome}
            >
              Back to Home
            </NavButton>
          </BottomNavigationSection>
        </Box>
      </ResponsiveContainer>
    );
  }

  if (!currentCard) {
    console.log('🎯 [RENDER STATE] Finished all cards ("All Caught Up")');
    return (
      <ResponsiveContainer>
        <Box textAlign="center" sx={{ maxWidth: 600 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#6a1b9a', mb: 3 }}>
            🎉 All Caught Up!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            You've swiped through all cards for now. Check back soon for more!
          </Typography>
          
          {/* ✅ UPDATED: Only back to home button at bottom */}
          <BottomNavigationSection>
            <NavButton 
              className="back-home" 
              startIcon={<Home />} 
              onClick={handleBackHome}
            >
              Back to Home
            </NavButton>
          </BottomNavigationSection>
        </Box>
      </ResponsiveContainer>
    );
  }

  console.log('🖌 [RENDER STATE] Main swipe UI, currentIndex:', currentIndex);
  return (
    <ResponsiveContainer>
      <TitleSection>
        <ResponsiveTitle variant="h2">Discover Your Perfect Friend</ResponsiveTitle>
        <ResponsiveSubtitle variant="h6">
          {isMobile ? 'Tap the buttons to like or pass' : 'Click love to like, pass to skip'}
        </ResponsiveSubtitle>
      </TitleSection>

      {/* ✅ Stats section showing top results */}
      <StatsSection>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#6a1b9a', 
            fontWeight: 600, 
            fontSize: '0.9rem',
            mb: 0.5
          }}
        >
          🎯 Showing Top {dataSource.length} AI-Matched Results
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#7b1fa2', 
            fontSize: '0.8rem'
          }}
        >
          Personalized recommendations based on your interests and compatibility
        </Typography>
      </StatsSection>

      <SingleCardContainer>
        <SwipeCard
          key={`${currentCard.id || currentIndex}`}
          user={currentCard}
          onSwipe={handleSwipe}
        />
      </SingleCardContainer>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#7b1fa2', fontWeight: 500 }}>
          Daily Progress: {swipedCount}/{DAILY_LIMIT} cards swiped
        </Typography>
      </Box>

      {/* ✅ UPDATED: Back to Home button at the bottom */}
      <BottomNavigationSection>
        <NavButton 
          className="back-home" 
          startIcon={<ArrowBack />} 
          onClick={handleBackHome}
        >
          Back to Home
        </NavButton>
      </BottomNavigationSection>
    </ResponsiveContainer>
  );
};

export default SwipeStack;
