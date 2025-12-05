// frontend/src/components/matching/SwipeCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Avatar,
  LinearProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  useMediaQuery,
  ImageList,
  ImageListItem,
  Paper,
  Rating,
  Tooltip
} from '@mui/material';
import {
  Favorite,
  Close,
  LocationOn,
  Work,
  School,
  Visibility,
  ThumbUp,
  TrendingUp,
  PhotoLibrary,
  ArrowBackIos,
  ArrowForwardIos,
  Star,
  Interests,
  PersonPin,
  Timeline,
  EmojiEvents,
  Schedule,
  Verified
} from '@mui/icons-material';
import { getProfileImage, getCoverPhoto, getAllUserImages, getImagePlaceholder } from '../../utils/imageUtils';

const CardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
`;

const SwipeContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 750px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active { cursor: grabbing; }
  @media (max-width: 600px) { height: 650px; }
`;

const StyledCard = styled(Card)`
  width: 100%;
  height: 100%;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
`;

const ProfileImageContainer = styled.div`
  width: 100%;
  height: 320px;
  position: relative;
  overflow: hidden;
`;

const ProfileImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.$bgImage ? `url(${props.$bgImage})` : props.$placeholder};
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => !props.$bgImage && `
    color: white;
    font-size: 4rem;
    font-weight: bold;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `}
`;

const ImageCarouselButton = styled(IconButton)`
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  background: rgba(255,255,255,0.9) !important;
  color: #6a1b9a !important;
  width: 40px !important;
  height: 40px !important;
  z-index: 2 !important;
  &:hover { background: rgba(255,255,255,1) !important; transform: translateY(-50%) scale(1.1) !important; }
  &.left { left: 10px !important; }
  &.right { right: 10px !important; }
`;

const ImageIndicators = styled(Box)`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
`;

const ImageIndicator = styled(Box)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { background: rgba(255,255,255,0.8); transform: scale(1.2); }
`;

const CompatibilityBadge = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${props =>
    props.$score >= 80 ? 'linear-gradient(135deg, #4caf50, #388e3c)' :
    props.$score >= 60 ? 'linear-gradient(135deg, #ff9800, #f57c00)' :
    'linear-gradient(135deg, #f44336, #d32f2f)'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  z-index: 2;
`;

const PhotoCountBadge = styled(Box)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
`;

const ViewMoreSection = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 8px;
  width: 100%;
`;

const ViewMoreButton = styled(Button)`
  border-radius: 20px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  padding: 10px 20px !important;
  background: linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%) !important;
  color: white !important;
  box-shadow: 0 6px 20px rgba(106,27,154,0.3) !important;
  &:hover {
    background: linear-gradient(135deg, #5e1a87 0%, #3e0f7a 100%) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(106,27,154,0.4) !important;
  }
`;

const ActionButtonsContainer = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  padding: 0 25px;
`;

const ActionButton = styled(motion(IconButton))`
  width: 80px !important;
  height: 80px !important;
  border-radius: 50% !important;
  box-shadow: 0 12px 35px rgba(0,0,0,0.3) !important;
  &.reject { background: linear-gradient(135deg, #f44336, #d32f2f) !important; color: white !important; }
  &.reject:hover { background: linear-gradient(135deg, #d32f2f, #b71c1c) !important; box-shadow: 0 16px 45px rgba(244,67,54,0.5) !important; }
  &.like { background: linear-gradient(135deg, #4caf50, #388e3c) !important; color: white !important; }
  &.like:hover { background: linear-gradient(135deg, #388e3c, #2e7d32) !important; box-shadow: 0 16px 45px rgba(76,175,80,0.5) !important; }
  .MuiSvgIcon-root { font-size: 2.4rem; }
`;

const InterestChip = styled(Chip)`
  margin: 2px !important;
  font-size: 0.8rem !important;
  height: 28px !important;
  border-radius: 14px !important;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb) !important;
  color: #1565c0 !important;
  font-weight: 600 !important;
`;

const BioSection = styled(Box)`
  background: rgba(106,27,154,0.05);
  border-radius: 12px;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid rgba(106,27,154,0.1);
`;

const DetailSection = styled(Box)`
  background: rgba(106,27,154,0.03);
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
  border: 1px solid rgba(106,27,154,0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled(Typography)`
  color: #6a1b9a !important;
  font-weight: 700 !important;
  font-size: 1.4rem !important;
  margin-bottom: 16px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
`;

const FavoriteChip = styled(Chip)`
  margin: 4px !important;
  font-size: 0.9rem !important;
  height: 36px !important;
  border-radius: 18px !important;
  font-weight: 600 !important;
  &.like { background: linear-gradient(135deg, #4caf50, #388e3c) !important; color: white !important; }
  &.dislike { background: linear-gradient(135deg, #f44336, #d32f2f) !important; color: white !important; }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover { transform: scale(1.02); }
`;

const DynamicInfoCard = styled(Paper)`
  padding: 20px;
  border-radius: 16px;
  background: ${props => props.$gradient || 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'};
  border: 1px solid ${props => props.$borderColor || 'rgba(106, 27, 154, 0.1)'};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.15); }
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: rotate(45deg);
    transition: all 0.5s;
    opacity: 0;
  }
  &:hover::before { opacity: 1; transform: rotate(45deg) translate(50%, 50%); }
`;

const IconWrapper = styled(Box)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  backdrop-filter: blur(10px);
`;

const ScoreDisplay = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 8px 0;
`;

const SwipeCard = ({ user, onSwipe }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [exitX, setExitX] = useState(0);
  const [exitDirection, setExitDirection] = useState(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const cardAnimationDuration = 1.5;

  // Normalize shape: support both flat and nested user payloads
  const rawUser = user?.user ? { ...(user.user || {}), ...user } : user;

  // Media
  const profileImage = getProfileImage(rawUser);
  const coverPhoto = getCoverPhoto(rawUser);
  const allImages = getAllUserImages(rawUser);
  const imagePlaceholder = getImagePlaceholder(rawUser);
  const displayImage = coverPhoto || profileImage;
  const displayImages = allImages.length > 0 ? allImages : [];

  // Five metrics (0..1) -> percentages (0..100)
  const interestSimPct   = Math.round(Number(rawUser?.interestSimilarity ?? rawUser?.similarityBreakdown?.interests ?? 0) * 100);
  const locationSimPct   = Math.round(Number(rawUser?.locationSimilarity ?? rawUser?.similarityBreakdown?.location ?? 0) * 100);
  const ageCompPct       = Math.round(Number(rawUser?.ageCompatibility ?? rawUser?.similarityBreakdown?.age ?? 0) * 100);
  const occupationSimPct = Math.round(Number(rawUser?.occupationSimilarity ?? rawUser?.similarityBreakdown?.occupation ?? 0) * 100);
  const bioSimPct        = Math.round(Number(rawUser?.bioSimilarity ?? rawUser?.similarityBreakdown?.bio ?? 0) * 100);

  // Five AI similarity cards (only dynamic, no hard-coded types)
  const aiSimilarityAspects = [
    {
      aspect: 'Interest Similarity',
      score: interestSimPct,
      description: rawUser?.sharedInterests?.length
        ? `Shared interests: ${rawUser.sharedInterests.slice(0, 2).join(', ')}`
        : 'Overlap in interests'
    },
    {
      aspect: 'Location Proximity',
      score: locationSimPct,
      description: 'Geographic closeness or same city'
    },
    {
      aspect: 'Age Compatibility',
      score: ageCompPct,
      description: 'Age difference fit'
    },
    {
      aspect: 'Occupation Alignment',
      score: occupationSimPct,
      description: 'Similar industries or roles'
    },
    {
      aspect: 'Bio Similarity',
      score: bioSimPct,
      description: 'Similar themes in bios'
    }
  ];

  // Build enhanced user (no placeholder favorites, dynamic matchingAspects only)
  const enhancedUser = {
    ...rawUser,
    profileImage: displayImage,
    allImages: displayImages,
    hasMultipleImages: displayImages.length > 1,
    favorites: {
      likes: Array.isArray(rawUser?.thingsILove) ? rawUser.thingsILove : [],
      dislikes: Array.isArray(rawUser?.notMyThing) ? rawUser.notMyThing : []
    },
    matchingAspects: aiSimilarityAspects
  };

  const handleAction = (action) => {
    if (exitX !== 0) return;
    setExitDirection(action);
    setExitX(action === 'like' || action === 'love' ? 1200 : -1200);
  };

  const handleViewMore = () => setShowDetailedView(true);
  const handleCloseDetailedView = () => setShowDetailedView(false);

  const nextImage = () => {
    if (displayImages.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % displayImages.length);
    }
  };
  const prevImage = () => {
    if (displayImages.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + displayImages.length) % displayImages.length);
    }
  };
  const goToImage = (index) => setCurrentImageIndex(index);

  return (
    <>
      <CardContainer>
        <SwipeContainer
          animate={{
            x: exitX,
            rotate: exitX ? (exitX > 0 ? 20 : -20) : 0,
            scale: exitX ? 0.8 : 1,
            opacity: exitX ? 0 : 1
          }}
          transition={{ duration: cardAnimationDuration, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (exitX !== 0) {
              onSwipe(enhancedUser, exitDirection === 'like' ? 'like' : 'pass');
            }
          }}
        >
          <StyledCard>
            <ProfileImageContainer>
              <ProfileImage
                $bgImage={displayImages.length > 0 ? displayImages[currentImageIndex]?.url : displayImage}
                $placeholder={imagePlaceholder}
              >
                {!displayImage && !displayImages.length && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontSize: '3rem', mb: 1 }}>
                      {rawUser?.firstName?.charAt(0) || '?'}
                    </Typography>
                    <Typography variant="body1">
                      No Photo
                    </Typography>
                  </Box>
                )}
              </ProfileImage>

              {enhancedUser.hasMultipleImages && (
                <>
                  <ImageCarouselButton className="left" onClick={prevImage}>
                    <ArrowBackIos />
                  </ImageCarouselButton>
                  <ImageCarouselButton className="right" onClick={nextImage}>
                    <ArrowForwardIos />
                  </ImageCarouselButton>
                </>
              )}

              {displayImages.length > 1 && (
                <ImageIndicators>
                  {displayImages.map((_, index) => (
                    <ImageIndicator
                      key={index}
                      $active={index === currentImageIndex}
                      onClick={() => goToImage(index)}
                    />
                  ))}
                </ImageIndicators>
              )}

              {displayImages.length > 0 && (
                <PhotoCountBadge>
                  <PhotoLibrary fontSize="small" />
                  {displayImages.length}
                </PhotoCountBadge>
              )}

              <CompatibilityBadge
                $score={Math.round(Number(enhancedUser.compatibilityScore ?? 0))}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {Math.round(Number(enhancedUser.compatibilityScore ?? 0))}% Compatible
              </CompatibilityBadge>
            </ProfileImageContainer>

            <CardContent sx={{ padding: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={profileImage}
                  alt={enhancedUser.firstName}
                  sx={{
                    width: 70,
                    height: 70,
                    mr: 2,
                    border: '3px solid rgba(103, 58, 183, 0.2)',
                    background: !profileImage ? imagePlaceholder : 'transparent'
                  }}
                >
                  {!profileImage && enhancedUser.firstName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    fontWeight="bold"
                    sx={{ color: '#4a148c', fontSize: { xs: '1.6rem', sm: '2rem' }, mb: 0.5 }}
                  >
                    {enhancedUser.firstName}, {enhancedUser.age}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <LocationOn fontSize="medium" sx={{ color: '#7b1fa2', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#7b1fa2', fontSize: '1.1rem', fontWeight: 600 }}>
                      {enhancedUser.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <BioSection>
                <Typography variant="h6" gutterBottom sx={{ color: '#6a1b9a', fontWeight: 700, fontSize: '1rem' }}>
                  About Me
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a148c', fontSize: '0.9rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                  {enhancedUser.bio || 'I love meeting new people and exploring new adventures! Looking forward to making meaningful connections and sharing great experiences together. 🌟'}
                </Typography>
              </BioSection>

              {enhancedUser.occupation && (
                <Box display="flex" alignItems="center" mb={1}>
                  <Work fontSize="small" sx={{ color: '#9c27b0', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#9c27b0', fontSize: '0.95rem', fontWeight: 600 }}>
                    {enhancedUser.occupation}
                  </Typography>
                </Box>
              )}

              <Box mb={2}>
                <Typography variant="h6" gutterBottom sx={{ color: '#6a1b9a', fontWeight: 700, fontSize: '1rem' }}>
                  Interests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(enhancedUser.interests || []).slice(0, isMobile ? 3 : 5).map((interest, idx) => (
                    <InterestChip key={idx} label={interest} />
                  ))}
                  {(enhancedUser.interests || []).length > (isMobile ? 3 : 5) && (
                    <InterestChip
                      label={`+${(enhancedUser.interests || []).length - (isMobile ? 3 : 5)}`}
                      sx={{ background: 'linear-gradient(135deg, #7b1fa2, #4a148c) !important', color: 'white !important' }}
                    />
                  )}
                </Box>
              </Box>

              {enhancedUser.favorites.likes.length > 0 && (
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#4caf50', fontWeight: 700, fontSize: '1rem' }}>
                    Things I Love
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {enhancedUser.favorites.likes.slice(0, isMobile ? 2 : 3).map((like, idx) => (
                      <Chip
                        key={idx}
                        label={like}
                        size="small"
                        sx={{ background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9) !important', color: '#2e7d32 !important', fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    ))}
                    {enhancedUser.favorites.likes.length > (isMobile ? 2 : 3) && (
                      <Chip
                        label={`+${enhancedUser.favorites.likes.length - (isMobile ? 2 : 3)}`}
                        size="small"
                        sx={{ background: 'linear-gradient(135deg, #4caf50, #388e3c) !important', color: 'white !important', fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </Box>
              )}

              <Box sx={{ mt: 'auto' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#6a1b9a', fontWeight: 700, fontSize: '1rem' }}>
                  Compatibility
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" sx={{ color: '#4a148c', fontWeight: 700, fontSize: '1.1rem' }}>
                    {Math.round(Number(enhancedUser.compatibilityScore ?? 0))}% Match
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.round(Number(enhancedUser.compatibilityScore ?? 0))}
                    sx={{
                      flexGrow: 1,
                      ml: 2,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#e1bee7',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: Math.round(Number(enhancedUser.compatibilityScore ?? 0)) >= 70
                          ? 'linear-gradient(90deg, #4caf50, #388e3c)'
                          : 'linear-gradient(90deg, #ff9800, #f57c00)'
                      }
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </SwipeContainer>

        <ViewMoreSection>
          <ViewMoreButton startIcon={<Visibility />} onClick={handleViewMore}>
            View More Details
          </ViewMoreButton>
        </ViewMoreSection>

        <ActionButtonsContainer>
          <ActionButton className="reject" onClick={() => handleAction('pass')} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
            <Close fontSize="large" />
          </ActionButton>
          <ActionButton className="like" onClick={() => handleAction('like')} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
            <Favorite fontSize="large" />
          </ActionButton>
        </ActionButtonsContainer>
      </CardContainer>

      <Dialog
        open={showDetailedView}
        onClose={handleCloseDetailedView}
        maxWidth={false}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              maxHeight: '95vh',
              width: { xs: '95vw', sm: '90vw', md: '85vw', lg: '1200px', xl: '1400px' },
              maxWidth: 'none',
              overflow: 'hidden',
              margin: 'auto',
              background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
            }
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 3, pt: 4, background: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)' }} />
          <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.03)' }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Avatar
              src={profileImage}
              alt={enhancedUser.firstName}
              sx={{ width: 140, height: 140, margin: '0 auto 20px', border: '5px solid rgba(255, 255, 255, 0.8)', background: !profileImage ? imagePlaceholder : 'transparent', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}
            >
              {!profileImage && enhancedUser.firstName?.charAt(0)}
            </Avatar>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {enhancedUser.firstName} {enhancedUser.lastName}
              <Verified sx={{ ml: 1, color: '#00bcd4' }} />
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
              {enhancedUser.age} years old • {enhancedUser.location}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                  {Math.round(Number(enhancedUser.compatibilityScore ?? 0))}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Compatible
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800' }}>
                  {(enhancedUser.interests || []).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Interests
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#e91e63' }}>
                  {displayImages.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Photos
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '30px', padding: '12px 24px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Star sx={{ color: '#ffd700', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>
                {Math.round(Number(enhancedUser.compatibilityScore ?? 0))}% Perfect Match
              </Typography>
              <Rating value={Math.round(Number(enhancedUser.compatibilityScore ?? 0)) / 20} readOnly size="small" />
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ maxHeight: '70vh', overflow: 'auto', p: 4, background: '#fafafa' }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h3" sx={{ color: '#6a1b9a', fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                  Profile Overview
                </Typography>
                <Box sx={{ width: 80, height: 4, background: 'linear-gradient(90deg, #6a1b9a, #4a148c)', margin: '0 auto', borderRadius: 2 }} />
              </Box>

              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={3}>
                  <DynamicInfoCard elevation={0} $gradient="linear-gradient(135deg, #1976d2 0%, #1565c0 100%)" $borderColor="rgba(25,118,210,0.3)" sx={{ minHeight: 180 }}>
                    <IconWrapper><LocationOn sx={{ fontSize: '2.2rem', color: '#1f06afff' }} /></IconWrapper>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2924adff', mb: 1.5 }}>
                      Location
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#195364ff', fontWeight: 600, textAlign: 'center', mb: 1 }}>
                      {enhancedUser.location || 'Not specified'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
                      <PersonPin sx={{ fontSize: '1rem', mr: 0.5, color: '#192297ff' }} />
                      <Typography variant="caption" sx={{ color: '#0e2e68ff' }}>
                        Current City
                      </Typography>
                    </Box>
                  </DynamicInfoCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DynamicInfoCard elevation={0} $gradient="linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)" $borderColor="rgba(123,31,162,0.3)" sx={{ minHeight: 180 }}>
                    <IconWrapper><Work sx={{ fontSize: '2.2rem', color: '#b925a6ff' }} /></IconWrapper>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#74148bff', mb: 1.5 }}>
                      Profession
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#842497ff', fontWeight: 600, textAlign: 'center', mb: 1 }}>
                      {enhancedUser.occupation || 'Not specified'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
                      <EmojiEvents sx={{ fontSize: '1rem', mr: 0.5, color: '#53106dff' }} />
                      <Typography variant="caption" sx={{ color: '#9f31adff' }}>
                        Career Focus
                      </Typography>
                    </Box>
                  </DynamicInfoCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DynamicInfoCard elevation={0} $gradient="linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)" $borderColor="rgba(56,142,60,0.3)" sx={{ minHeight: 180 }}>
                    <IconWrapper><School sx={{ fontSize: '2.2rem', color: '#249b59ff' }} /></IconWrapper>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#247a2bff', mb: 1.5 }}>
                      Education
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#1d6108ff', fontWeight: 600, textAlign: 'center', mb: 1 }}>
                      {enhancedUser.education || 'Not specified'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
                      <Timeline sx={{ fontSize: '1rem', mr: 0.5, color: '#3e9e56ff' }} />
                      <Typography variant="caption" sx={{ color: '#176e38ff' }}>
                        Academic Background
                      </Typography>
                    </Box>
                  </DynamicInfoCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DynamicInfoCard elevation={0} $gradient="linear-gradient(135deg, #d84315 0%, #bf360c 100%)" $borderColor="rgba(216,67,21,0.3)" sx={{ minHeight: 180 }}>
                    <IconWrapper><Favorite sx={{ fontSize: '2.2rem', color: '#d34343ff' }} /></IconWrapper>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#a70d0dff', mb: 1.5 }}>
                      Match Score
                    </Typography>
                    <ScoreDisplay>
                      <Typography variant="h4" sx={{ color: '#923131ff', fontWeight: 800 }}>
                        {Math.round(Number(enhancedUser.compatibilityScore ?? 0))}%
                      </Typography>
                      <Star sx={{ color: '#e6e20cff', fontSize: '1.5rem', ml: 0.5 }} />
                    </ScoreDisplay>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
                      <Schedule sx={{ fontSize: '1rem', mr: 0.5, color: '#a6b116ff' }} />
                      <Typography variant="caption" sx={{ color: '#58180fff' }}>
                        AI Calculated
                      </Typography>
                    </Box>
                  </DynamicInfoCard>
                </Grid>
              </Grid>
            </Grid>

            {/* Bio */}
            <Grid item xs={12}>
              <DetailSection sx={{ background: 'linear-gradient(135deg,#fff 0%,#f8f9fa 100%)', border: '2px solid rgba(106,27,154,0.1)', boxShadow: '0 8px 32px rgba(106,27,154,0.1)' }}>
                <SectionTitle><Interests />About {enhancedUser.firstName}</SectionTitle>
                <Box sx={{ background: 'linear-gradient(135deg,rgba(106,27,154,0.08) 0%,rgba(106,27,154,0.03) 100%)', borderRadius: 3, p: 4, border: '1px solid rgba(106,27,154,0.15)', position: 'relative', overflow: 'hidden' }}>
                  <Typography variant="body1" sx={{ color: '#4a148c', fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic', position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.6)', padding: 3, borderRadius: 2, border: '1px solid rgba(106,27,154,0.1)' }}>
                    "{enhancedUser.bio || 'I love meeting new people and exploring new adventures! Looking forward to making meaningful connections and sharing great experiences together. Life is about creating beautiful memories with amazing people! 🌟✨'}"
                  </Typography>
                </Box>
              </DetailSection>
            </Grid>

            {/* Interests */}
            <Grid item xs={12}>
              <DetailSection sx={{ background: 'linear-gradient(135deg,#fff 0%,#f0f8ff 100%)', border: '2px solid rgba(33,150,243,0.1)' }}>
                <SectionTitle><TrendingUp />Interests & Passions {(enhancedUser.interests || []).length}</SectionTitle>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
                    Things that spark {enhancedUser.firstName}'s curiosity:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {(enhancedUser.interests || []).map((interest, idx) => (
                      <Tooltip key={idx} title={`${enhancedUser.firstName} loves ${interest}`} arrow>
                        <Box sx={{
                          background: idx % 4 === 0
                            ? 'linear-gradient(135deg,#e3f2fd,#bbdefb)'
                            : idx % 4 === 1
                            ? 'linear-gradient(135deg,#e8f5e8,#c8e6c9)'
                            : idx % 4 === 2
                            ? 'linear-gradient(135deg,#fff3e0,#ffe0b2)'
                            : 'linear-gradient(135deg,#fce4ec,#f8bbd9)',
                          color: idx % 4 === 0 ? '#1565c0' : idx % 4 === 1 ? '#2e7d32' : idx % 4 === 2 ? '#ef6c00' : '#c2185b',
                          padding: '12px 20px',
                          borderRadius: '25px',
                          fontWeight: 700,
                          fontSize: '1rem',
                          border: `2px solid ${idx % 4 === 0 ? 'rgba(33,150,243,0.3)' : idx % 4 === 1 ? 'rgba(76,175,80,0.3)' : idx % 4 === 2 ? 'rgba(255,152,0,0.3)' : 'rgba(194,24,91,0.3)'}`,
                          transition: 'all .3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Star sx={{ fontSize: '1rem' }} />
                          {interest}
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              </DetailSection>
            </Grid>

            {/* Photo gallery */}
            {displayImages.length > 0 && (
              <Grid item xs={12}>
                <DetailSection>
                  <SectionTitle><PhotoLibrary />Photo Gallery ({displayImages.length} photos)</SectionTitle>
                  <ImageList variant="masonry" cols={isMobile ? 2 : 4} gap={12} sx={{ maxHeight: 500, overflow: 'auto' }}>
                    {displayImages.map((image, index) => (
                      <ImageListItem key={index}>
                        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                          <GalleryImage
                            src={image.url}
                            alt={`${enhancedUser.firstName} photo ${index + 1}`}
                            loading="lazy"
                            onError={(e) => { e.target.style.display = 'none'; }}
                            style={{ borderRadius: '8px' }}
                          />
                          <Box sx={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '12px', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {index + 1}
                          </Box>
                        </Box>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </DetailSection>
              </Grid>
            )}

            {/* Favorites */}
            <Grid item xs={12}>
              <DetailSection>
                <SectionTitle><ThumbUp />Favorites</SectionTitle>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box mb={3}>
                      <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600, mb: 2, fontSize: '1.2rem' }}>
                        Things I Love ❤️
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {enhancedUser.favorites.likes.length > 0
                          ? enhancedUser.favorites.likes.map((like, idx) => <FavoriteChip key={idx} label={like} className="like" />)
                          : <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>No favorites specified yet</Typography>}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 600, mb: 2, fontSize: '1.2rem' }}>
                        Not My Thing 😅
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {enhancedUser.favorites.dislikes.length > 0
                          ? enhancedUser.favorites.dislikes.map((dislike, idx) => <FavoriteChip key={idx} label={dislike} className="dislike" />)
                          : <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>No dislikes specified yet</Typography>}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </DetailSection>
            </Grid>

            {/* Why you're compatible (driven by five real metrics) */}
            <Grid item xs={12}>
              <DetailSection>
                <SectionTitle><TrendingUp />Why You're Compatible</SectionTitle>
                <Grid container spacing={3}>
                  {(enhancedUser.matchingAspects || []).map((aspect, idx) => (
                    <Grid item xs={12} sm={6} lg={3} key={idx}>
                      <Box sx={{
                        p: 3,
                        border: '1px solid rgba(106, 27, 154, 0.2)',
                        borderRadius: 3,
                        background: 'rgba(106, 27, 154, 0.02)',
                        height: '100%',
                        textAlign: 'center',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(106, 27, 154, 0.15)' }
                      }}>
                        <Typography variant="h4" sx={{
                          color: Math.round(aspect.score) >= 80 ? '#4caf50' :
                                 Math.round(aspect.score) >= 60 ? '#ff9800' : '#f44336',
                          fontWeight: 700,
                          mb: 1
                        }}>
                          {Math.round(aspect.score)}%
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#6a1b9a', mb: 2 }}>
                          {aspect.aspect}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.round(aspect.score)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(106, 27, 154, 0.1)',
                            mb: 2,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: Math.round(aspect.score) >= 80
                                ? 'linear-gradient(90deg, #4caf50, #388e3c)'
                                : Math.round(aspect.score) >= 60
                                ? 'linear-gradient(90deg, #ff9800, #f57c00)'
                                : 'linear-gradient(90deg, #f44336, #d32f2f)'
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '.85rem' }}>
                          {aspect.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </DetailSection>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 4, justifyContent: 'center', background: 'linear-gradient(135deg, rgba(106, 27, 154, 0.05) 0%, rgba(106, 27, 154, 0.02) 100%)', borderTop: '1px solid rgba(106, 27, 154, 0.1)' }}>
          <Button
            onClick={handleCloseDetailedView}
            variant="outlined"
            size="large"
            sx={{ mr: 3, borderRadius: 3, textTransform: 'none', borderColor: '#9c27b0', color: '#9c27b0', fontWeight: 600, padding: '12px 32px', '&:hover': { background: 'rgba(156, 39, 176, 0.1)' } }}
          >
            Close Profile
          </Button>
          <Button
            onClick={() => { handleCloseDetailedView(); handleAction('like'); }}
            variant="contained"
            size="large"
            startIcon={<Favorite />}
            sx={{ borderRadius: 3, textTransform: 'none', background: 'linear-gradient(135deg, #4caf50, #388e3c)', fontWeight: 700, padding: '12px 40px', fontSize: '1.1rem', '&:hover': { background: 'linear-gradient(135deg, #388e3c, #2e7d32)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)' } }}
          >
            Connect with {enhancedUser.firstName}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SwipeCard;
