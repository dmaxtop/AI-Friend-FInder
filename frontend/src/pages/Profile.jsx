// frontend/src/pages/Profile.jsx (Fixed Complete Version)
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateUser } from '../store/slices/authslice'; 
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  Chip,
  TextField,
  Alert,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormLabel,
  Slider,
  Stack,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  LocationOn,
  Work,
  School,
  Email,
  Phone,
  Cake,
  Visibility,
  Security,
  Notifications,
  Settings,
  Delete,
  Add,
  ExpandMore,
  PhotoCamera,
  CloudUpload,
  CheckCircle,
  Warning,
  Error,
  Info,
  TrendingUp,
  Schedule,
  Block,
  VerifiedUser,
  Star,
  LocalFireDepartment,
  Psychology,
  Language,
  Favorite,
  Height,
  FitnessCenter,
  SmokingRooms,
  LocalBar,
  Pets,
  ChildCare,
  ThumbUp,
  ThumbDown,
  Chat,
  Balance,
  Group
} from '@mui/icons-material';

const ProfileContainer = styled(Container)`
  padding: clamp(1rem, 4vw, 3rem);
  min-height: calc(100vh - 140px);
  
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
  }
`;

const ProfileCard = styled(Card)`
  border-radius: clamp(12px, 2vw, 20px) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
  margin-bottom: 2rem;
  overflow: visible;
`;

const ProfileHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: clamp(12px, 2vw, 20px) clamp(12px, 2vw, 20px) 0 0;
  position: relative;
`;

const StyledAvatar = styled(Avatar)`
  width: clamp(100px, 20vw, 140px) !important;
  height: clamp(100px, 20vw, 140px) !important;
  margin-bottom: 1.5rem !important;
  border: 5px solid rgba(255,255,255,0.3) !important;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
`;

const PhotoUploadButton = styled(IconButton)`
  position: absolute !important;
  bottom: -5px !important;
  right: -5px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  color: #667eea !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
  
  &:hover {
    background: white !important;
    transform: scale(1.1);
  }
`;

const StatusIndicator = styled(Box)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 20px;
  background: ${props => 
    props.$status === 'online' ? 'linear-gradient(135deg, #4caf50, #388e3c)' :
    props.$status === 'busy' ? 'linear-gradient(135deg, #ff9800, #f57c00)' :
    props.$status === 'away' ? 'linear-gradient(135deg, #ffeb3b, #f57f17)' :
    props.$status === 'invisible' ? 'linear-gradient(135deg, #9e9e9e, #616161)' :
    'linear-gradient(135deg, #f44336, #d32f2f)'
  };
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: capitalize;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const SectionCard = styled(Paper)`
  padding: 2rem !important;
  margin-bottom: 1.5rem !important;
  border-radius: 16px !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
    transform: translateY(-2px);
  }
`;

const InterestChipContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const DynamicField = styled(Box)`
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.$isEmpty ? 'rgba(255, 193, 7, 0.1)' : 'rgba(76, 175, 80, 0.05)'};
  border: 1px solid ${props => props.$isEmpty ? 'rgba(255, 193, 7, 0.3)' : 'rgba(76, 175, 80, 0.3)'};
  position: relative;
`;

const CompletionBadge = styled(Box)`
  position: absolute;
  top: -8px;
  right: 12px;
  background: ${props => 
    props.$completion >= 80 ? 'linear-gradient(135deg, #4caf50, #388e3c)' :
    props.$completion >= 50 ? 'linear-gradient(135deg, #ff9800, #f57c00)' :
    'linear-gradient(135deg, #f44336, #d32f2f)'
  };
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth || {});
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [newInterest, setNewInterest] = useState('');
  const [newThingILove, setNewThingILove] = useState('');
  const [newNotMyThing, setNewNotMyThing] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [originalData, setOriginalData] = useState({});

  // Enhanced profile data with all new fields
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    location: '',
    occupation: '',
    education: '',
    bio: '',
    height: '',
    bodyType: '',
    smokingStatus: 'never',
    drinkingStatus: 'socially',
    hasKids: false,
    wantsKids: '',
    hasPets: false,
    petPreference: '',
    languages: [],
    relationshipType: '',
    lookingFor: [],
    dealBreakers: [],
    interests: [],
    hobbies: [],
    thingsILove: [],
    notMyThing: [],
    communicationStyle: '',
    workLifeBalance: 0.5,
    socialEngagementPreference: 5,
    primaryProfileImage: '',
    coverPhoto: '',
    profileImages: [],
    activityStatus: 'online',
    profileVisibility: 'public',
    lastSeen: new Date(),
    notificationSettings: {
      newMatches: true,
      messages: true,
      profileViews: true,
      friendRequests: true,
      events: true,
      marketing: false
    },
    privacySettings: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowMessageRequests: true,
      showLastSeen: true,
      discoverableByEmail: false,
      discoverableByPhone: false
    },
    security: {
      twoFactorEnabled: false
    },
    isActive: true,
    isVerified: false
  });

  // ✅ FIXED: Create stable handlers using useCallback
  const handleFieldChange = useCallback((fieldName) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setProfileData(prev => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleNestedFieldChange = useCallback((parentField, childField) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setProfileData(prev => ({
      ...prev,
      [parentField]: { ...prev[parentField], [childField]: value }
    }));
  }, []);

  // Define field configurations for dynamic rendering
  const basicInfoFields = [
    {
      key: 'firstName',
      label: 'First Name',
      icon: Person,
      type: 'text',
      required: true,
      section: 'personal'
    },
    {
      key: 'lastName',
      label: 'Last Name',
      icon: Person,
      type: 'text',
      required: true,
      section: 'personal'
    },
    {
      key: 'email',
      label: 'Email',
      icon: Email,
      type: 'email',
      editable: false,
      section: 'contact'
    },
    {
      key: 'age',
      label: 'Age',
      icon: Cake,
      type: 'number',
      required: true,
      section: 'personal'
    },
    {
      key: 'location',
      label: 'Location',
      icon: LocationOn,
      type: 'text',
      required: true,
      section: 'contact'
    },
    {
      key: 'occupation',
      label: 'Occupation',
      icon: Work,
      type: 'text',
      section: 'professional'
    },
    {
      key: 'education',
      label: 'Education',
      icon: School,
      type: 'text',
      section: 'professional'
    },
    {
      key: 'height',
      label: 'Height (cm)',
      icon: Height,
      type: 'number',
      section: 'physical'
    },
    {
      key: 'bodyType',
      label: 'Body Type',
      icon: FitnessCenter,
      type: 'select',
      options: ['slim', 'athletic', 'average', 'curvy', 'plus-size'],
      section: 'physical'
    }
  ];

  const lifestyleFields = [
    {
      key: 'smokingStatus',
      label: 'Smoking',
      icon: SmokingRooms,
      type: 'select',
      options: ['never', 'socially', 'regularly', 'trying-to-quit'],
      section: 'lifestyle'
    },
    {
      key: 'drinkingStatus',
      label: 'Drinking',
      icon: LocalBar,
      type: 'select',
      options: ['never', 'socially', 'regularly', 'occasionally'],
      section: 'lifestyle'
    },
    {
      key: 'relationshipType',
      label: 'Looking For',
      icon: Favorite,
      type: 'select',
      options: ['casual', 'serious', 'marriage', 'friendship', 'open'],
      section: 'relationship'
    },
    {
      key: 'communicationStyle',
      label: 'Communication Style',
      icon: Chat,
      type: 'select',
      options: ['direct', 'diplomatic', 'casual', 'formal', 'humorous', 'deep-thinker', 'good-listener', 'storyteller'],
      section: 'communication'
    }
  ];

  const statusOptions = [
    { value: 'online', label: 'Online', color: '#4caf50', icon: '🟢' },
    { value: 'busy', label: 'Busy', color: '#ff9800', icon: '🟡' },
    { value: 'away', label: 'Away', color: '#ffeb3b', icon: '🟠' },
    { value: 'invisible', label: 'Invisible', color: '#9e9e9e', icon: '⚫' },
    { value: 'offline', label: 'Offline', color: '#f44336', icon: '🔴' }
  ];

  // API call function for updating profile
  const updateUserProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message || 'Update failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Calculate profile completion
  useEffect(() => {
    const calculateCompletion = () => {
      const requiredFields = ['firstName', 'lastName', 'age', 'location', 'bio'];
      const optionalFields = ['occupation', 'education', 'height', 'smokingStatus', 'drinkingStatus'];
      
      let completed = 0;
      let total = requiredFields.length + optionalFields.length;
      
      requiredFields.forEach(field => {
        if (profileData[field] && profileData[field].toString().trim()) completed += 1;
      });
      
      optionalFields.forEach(field => {
        if (profileData[field] && profileData[field].toString().trim()) completed += 0.5;
      });
      
      if (profileData.interests && profileData.interests.length > 0) completed += 1;
      if (profileData.primaryProfileImage) completed += 1;
      if (profileData.thingsILove && profileData.thingsILove.length > 0) completed += 0.5;
      if (profileData.communicationStyle) completed += 0.5;
      
      total += 3; // interests, photo, thingsILove, communicationStyle
      
      setProfileCompletion(Math.round((completed / total) * 100));
    };

    calculateCompletion();
  }, [profileData]);

  // Load user data on component mount and when user changes
  useEffect(() => {
    if (user) {
      console.log('Loading user data:', user);
      const userData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        age: user.age || '',
        location: user.location || '',
        occupation: user.occupation || '',
        education: user.education || '',
        bio: user.bio || '',
        height: user.height || '',
        bodyType: user.bodyType || '',
        smokingStatus: user.smokingStatus || 'never',
        drinkingStatus: user.drinkingStatus || 'socially',
        hasKids: user.hasKids || false,
        wantsKids: user.wantsKids || '',
        hasPets: user.hasPets || false,
        petPreference: user.petPreference || '',
        languages: user.languages || [],
        relationshipType: user.relationshipType || '',
        lookingFor: user.lookingFor || [],
        dealBreakers: user.dealBreakers || [],
        interests: Array.isArray(user.interests) ? user.interests : [],
        hobbies: user.hobbies || [],
        thingsILove: Array.isArray(user.thingsILove) ? user.thingsILove : [],
        notMyThing: Array.isArray(user.notMyThing) ? user.notMyThing : [],
        communicationStyle: user.communicationStyle || '',
        workLifeBalance: user.workLifeBalance !== undefined ? user.workLifeBalance : 0.5,
        socialEngagementPreference: user.socialEngagementPreference !== undefined ? user.socialEngagementPreference : 5,
        primaryProfileImage: user.primaryProfileImage || '',
        coverPhoto: user.coverPhoto || '',
        profileImages: user.profileImages || [],
        activityStatus: user.activityStatus || 'online',
        profileVisibility: user.profileVisibility || 'public',
        lastSeen: user.lastSeen || new Date(),
        notificationSettings: user.notificationSettings || {
          newMatches: true,
          messages: true,
          profileViews: true,
          friendRequests: true,
          events: true,
          marketing: false
        },
        privacySettings: user.privacySettings || {
          profileVisibility: 'public',
          showOnlineStatus: true,
          allowMessageRequests: true,
          showLastSeen: true,
          discoverableByEmail: false,
          discoverableByPhone: false
        },
        security: user.security || {
          twoFactorEnabled: false
        },
        isActive: user.isActive !== undefined ? user.isActive : true,
        isVerified: user.isVerified || false
      };
      
      setProfileData(userData);
      setOriginalData(JSON.parse(JSON.stringify(userData)));
    }
  }, [user]);

  const handleEdit = () => {
    console.log('Edit button clicked');
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log('Save button clicked');
    console.log('Profile data to save:', profileData);
    
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      const result = await updateUserProfile(profileData);
      
      console.log('Save result:', result);
      
      if (result.success) {
        dispatch(updateUser(result.user));
        setOriginalData(JSON.parse(JSON.stringify(profileData)));
        setIsEditing(false);
        setShowSuccessMessage(true);
        console.log('Profile saved successfully');
      } else {
        setErrorMessage(result.error || 'Failed to update profile');
        setShowErrorMessage(true);
        console.error('Save failed:', result.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('An unexpected error occurred while saving');
      setShowErrorMessage(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancel button clicked');
    setProfileData(JSON.parse(JSON.stringify(originalData)));
    setIsEditing(false);
  };

  // ✅ FIXED: Bio field handler
  const handleBioChange = useCallback((event) => {
    setProfileData(prev => ({ ...prev, bio: event.target.value }));
  }, []);

  // ✅ FIXED: Switch handlers
  const handleHasKidsChange = useCallback((event) => {
    setProfileData(prev => ({ ...prev, hasKids: event.target.checked }));
  }, []);

  const handleHasPetsChange = useCallback((event) => {
    setProfileData(prev => ({ ...prev, hasPets: event.target.checked }));
  }, []);

  // ✅ FIXED: Slider handlers
  const handleWorkLifeBalanceChange = useCallback((event, newValue) => {
    setProfileData(prev => ({ ...prev, workLifeBalance: newValue }));
  }, []);

  const handleSocialEngagementChange = useCallback((event, newValue) => {
    setProfileData(prev => ({ ...prev, socialEngagementPreference: newValue }));
  }, []);

  const handleStatusChange = (newStatus) => {
    console.log('Status change:', newStatus);
    setProfileData(prev => ({ ...prev, activityStatus: newStatus }));
    setShowStatusDialog(false);
  };

  const handleAddInterest = () => {
    console.log('Add interest:', newInterest);
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    console.log('Remove interest:', interestToRemove);
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleAddThingILove = () => {
    if (newThingILove.trim() && profileData.thingsILove.length < 4 && !profileData.thingsILove.includes(newThingILove.trim())) {
      setProfileData(prev => ({
        ...prev,
        thingsILove: [...prev.thingsILove, newThingILove.trim()]
      }));
      setNewThingILove('');
    }
  };

  const handleRemoveThingILove = (item) => {
    setProfileData(prev => ({
      ...prev,
      thingsILove: prev.thingsILove.filter(thing => thing !== item)
    }));
  };

  const handleAddNotMyThing = () => {
    if (newNotMyThing.trim() && profileData.notMyThing.length < 4 && !profileData.notMyThing.includes(newNotMyThing.trim())) {
      setProfileData(prev => ({
        ...prev,
        notMyThing: [...prev.notMyThing, newNotMyThing.trim()]
      }));
      setNewNotMyThing('');
    }
  };

  const handleRemoveNotMyThing = (item) => {
    setProfileData(prev => ({
      ...prev,
      notMyThing: prev.notMyThing.filter(thing => thing !== item)
    }));
  };

  const handleTabChange = (event, newValue) => {
    console.log('Tab change:', newValue);
    setCurrentTab(newValue);
  };

  // ✅ FIXED: Memoized render function with stable onChange handlers
  const renderDynamicField = useCallback((fieldConfig) => {
    const { key, label, icon: Icon, type, options, editable = true, required = false } = fieldConfig;
    const value = profileData[key];
    const isEmpty = !value || (typeof value === 'string' && !value.trim());

    // ✅ Create stable onChange handler for this specific field
    const handleChange = handleFieldChange(key);

    return (
      <DynamicField key={key} $isEmpty={isEmpty && required}>
        <Box display="flex" alignItems="center" mb={1}>
          <Icon sx={{ mr: 1, color: isEmpty && required ? '#ff9800' : 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {label} {required && '*'}
          </Typography>
          {!isEmpty && (
            <CheckCircle sx={{ ml: 'auto', color: '#4caf50', fontSize: '1rem' }} />
          )}
        </Box>
        
        {isEditing && editable ? (
          type === 'select' ? (
            <FormControl fullWidth size="small">
              <Select
                value={value || ''}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select {label}</em>
                </MenuItem>
                {options?.map(option => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              size="small"
              label={label}
              type={type}
              value={value || ''}
              onChange={handleChange}
              variant="outlined"
              error={isEmpty && required}
              helperText={isEmpty && required ? `${label} is required` : ''}
            />
          )
        ) : (
          <Typography 
            variant="h6" 
            sx={{ 
              color: isEmpty ? '#ff9800' : 'text.primary',
              fontStyle: isEmpty ? 'italic' : 'normal'
            }}
          >
            {value ? (
              typeof value === 'string' && options ? 
                value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ') : 
                value
            ) : (
              'Not specified'
            )}
          </Typography>
        )}
      </DynamicField>
    );
  }, [profileData, isEditing, handleFieldChange]);

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  if (!user) {
    return (
      <ProfileContainer maxWidth="lg">
        <Alert severity="error" sx={{ mb: 2 }}>
          No user data available. Please log in again.
        </Alert>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer maxWidth="lg">
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ 
          fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
          fontWeight: 700,
          mb: 4
        }}
      >
        Your Profile
      </Typography>

      <ProfileCard>
        <ProfileHeader>
          <StatusIndicator 
            $status={profileData.activityStatus}
            onClick={() => setShowStatusDialog(true)}
          >
            {statusOptions.find(s => s.value === profileData.activityStatus)?.icon} {' '}
            {statusOptions.find(s => s.value === profileData.activityStatus)?.label}
          </StatusIndicator>

          <CompletionBadge $completion={profileCompletion}>
            {profileCompletion}% Complete
          </CompletionBadge>

          <Box position="relative">
            <StyledAvatar
              src={profileData.primaryProfileImage}
              alt={`${profileData.firstName} ${profileData.lastName}`}
            >
              <Person sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' } }} />
            </StyledAvatar>
            {isEditing && (
              <PhotoUploadButton component="label">
                <PhotoCamera />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => console.log('Photo upload:', e.target.files[0])}
                />
              </PhotoUploadButton>
            )}
          </Box>
          
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            {profileData.firstName} {profileData.lastName}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {profileData.age} years old • {profileData.location}
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {profileData.isVerified && (
              <Chip 
                icon={<VerifiedUser />} 
                label="Verified" 
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  '& .MuiSvgIcon-root': { color: 'white' }
                }} 
              />
            )}
            <Chip 
              label={profileData.activityStatus.charAt(0).toUpperCase() + profileData.activityStatus.slice(1)} 
              onClick={() => setShowStatusDialog(true)}
              sx={{ 
                background: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                cursor: 'pointer'
              }}
            />
          </Box>

          <Box sx={{ width: '100%', mt: 3, maxWidth: 300 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Profile Completion</Typography>
              <Typography variant="body2">{profileCompletion}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={profileCompletion} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: profileCompletion >= 80 
                    ? 'linear-gradient(90deg, #4caf50, #388e3c)'
                    : profileCompletion >= 50 
                    ? 'linear-gradient(90deg, #ff9800, #f57c00)'
                    : 'linear-gradient(90deg, #f44336, #d32f2f)'
                }
              }}
            />
          </Box>
        </ProfileHeader>

        <CardContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange} centered>
              <Tab label="Basic Info" />
              <Tab label="Lifestyle" />
              <Tab label="Preferences" />
              <Tab label="Privacy & Security" />
              <Tab label="Notifications" />
              <Tab label="Account" />
            </Tabs>
          </Box>

          {/* Basic Information Tab */}
          <TabPanel value={currentTab} index={0}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h3">
                  Profile Information
                </Typography>
                
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: '#667eea',
                      '&:hover': {
                        backgroundColor: '#5a6fd8'
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <Save />}
                      onClick={handleSave}
                      disabled={isSaving}
                      sx={{ 
                        borderRadius: 2,
                        backgroundColor: '#4caf50',
                        '&:hover': {
                          backgroundColor: '#388e3c'
                        }
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={isSaving}
                      sx={{ borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Personal Information Section */}
              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  {basicInfoFields.filter(f => f.section === 'personal').map(field => (
                    <Grid item xs={12} sm={6} key={field.key}>
                      {renderDynamicField(field)}
                    </Grid>
                  ))}
                </Grid>
              </SectionCard>

              {/* Contact Information Section */}
              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <Email sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Contact Information
                </Typography>
                <Grid container spacing={3}>
                  {basicInfoFields.filter(f => f.section === 'contact').map(field => (
                    <Grid item xs={12} sm={6} key={field.key}>
                      {renderDynamicField(field)}
                    </Grid>
                  ))}
                </Grid>
              </SectionCard>

              {/* Professional Information Section */}
              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Professional Information
                </Typography>
                <Grid container spacing={3}>
                  {basicInfoFields.filter(f => f.section === 'professional').map(field => (
                    <Grid item xs={12} sm={6} key={field.key}>
                      {renderDynamicField(field)}
                    </Grid>
                  ))}
                </Grid>
              </SectionCard>

              {/* Physical Information Section */}
              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Physical Information
                </Typography>
                <Grid container spacing={3}>
                  {basicInfoFields.filter(f => f.section === 'physical').map(field => (
                    <Grid item xs={12} sm={6} key={field.key}>
                      {renderDynamicField(field)}
                    </Grid>
                  ))}
                </Grid>
              </SectionCard>

              {/* Bio Section */}
              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
                  About Me
                </Typography>
                <DynamicField $isEmpty={!profileData.bio}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Tell us about yourself"
                      value={profileData.bio}
                      onChange={handleBioChange}
                      variant="outlined"
                      placeholder="Share your story, what makes you unique, your passions..."
                    />
                  ) : (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontStyle: profileData.bio ? 'normal' : 'italic',
                        color: profileData.bio ? 'text.primary' : '#ff9800'
                      }}
                    >
                      {profileData.bio || 'No bio provided - tell people about yourself!'}
                    </Typography>
                  )}
                </DynamicField>
              </SectionCard>

              {/* Interests Section */}
              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Interests & Hobbies
                </Typography>
                
                {isEditing && (
                  <Box display="flex" gap={1} mb={2}>
                    <TextField
                      size="small"
                      label="Add Interest"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddInterest}
                      disabled={!newInterest.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                )}

                <InterestChipContainer>
                  {profileData.interests && profileData.interests.length > 0 ? (
                    profileData.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        variant="outlined"
                        color="primary"
                        sx={{ borderRadius: 2 }}
                        onDelete={isEditing ? () => handleRemoveInterest(interest) : undefined}
                      />
                    ))
                  ) : (
                    <Typography variant="body1" color="#ff9800" sx={{ fontStyle: 'italic' }}>
                      No interests specified - add some to help others connect with you!
                    </Typography>
                  )}
                </InterestChipContainer>
              </SectionCard>
            </Box>
          </TabPanel>

          {/* Lifestyle Tab */}
          <TabPanel value={currentTab} index={1}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" gutterBottom>
                  Lifestyle & Preferences
                </Typography>
                
                {!isEditing && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: '#667eea',
                      '&:hover': {
                        backgroundColor: '#5a6fd8'
                      }
                    }}
                  >
                    Edit Lifestyle
                  </Button>
                )}
              </Box>

              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <LocalFireDepartment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Lifestyle Choices
                </Typography>
                <Grid container spacing={3}>
                  {lifestyleFields.map(field => (
                    <Grid item xs={12} sm={6} key={field.key}>
                      {renderDynamicField(field)}
                    </Grid>
                  ))}
                </Grid>
              </SectionCard>

              {/* Family & Pets Section */}
              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <ChildCare sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Family & Pets
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.hasKids}
                          onChange={handleHasKidsChange}
                          disabled={!isEditing}
                        />
                      }
                      label="Has Children"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.hasPets}
                          onChange={handleHasPetsChange}
                          disabled={!isEditing}
                        />
                      }
                      label="Has Pets"
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </Box>
          </TabPanel>

          {/* Preferences Tab */}
          <TabPanel value={currentTab} index={2}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" gutterBottom>
                  Personal Preferences
                </Typography>
                
                {!isEditing && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: '#667eea',
                      '&:hover': {
                        backgroundColor: '#5a6fd8'
                      }
                    }}
                  >
                    Edit Preferences
                  </Button>
                )}
              </Box>

              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <ThumbUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Things I Love (Max 4)
                </Typography>
                
                {isEditing && (
                  <Box display="flex" gap={1} mb={2}>
                    <TextField
                      size="small"
                      label="Add Thing I Love"
                      value={newThingILove}
                      onChange={(e) => setNewThingILove(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddThingILove()}
                      sx={{ flexGrow: 1 }}
                      disabled={profileData.thingsILove.length >= 4}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddThingILove}
                      disabled={!newThingILove.trim() || profileData.thingsILove.length >= 4}
                    >
                      Add
                    </Button>
                  </Box>
                )}

                <InterestChipContainer>
                  {profileData.thingsILove && profileData.thingsILove.length > 0 ? (
                    profileData.thingsILove.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        variant="outlined"
                        color="success"
                        sx={{ borderRadius: 2 }}
                        onDelete={isEditing ? () => handleRemoveThingILove(item) : undefined}
                      />
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Share up to 4 things you absolutely love!
                    </Typography>
                  )}
                </InterestChipContainer>
              </SectionCard>

              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <ThumbDown sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Not My Thing (Max 4)
                </Typography>
                
                {isEditing && (
                  <Box display="flex" gap={1} mb={2}>
                    <TextField
                      size="small"
                      label="Add Not My Thing"
                      value={newNotMyThing}
                      onChange={(e) => setNewNotMyThing(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNotMyThing()}
                      sx={{ flexGrow: 1 }}
                      disabled={profileData.notMyThing.length >= 4}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddNotMyThing}
                      disabled={!newNotMyThing.trim() || profileData.notMyThing.length >= 4}
                    >
                      Add
                    </Button>
                  </Box>
                )}

                <InterestChipContainer>
                  {profileData.notMyThing && profileData.notMyThing.length > 0 ? (
                    profileData.notMyThing.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        variant="outlined"
                        color="error"
                        sx={{ borderRadius: 2 }}
                        onDelete={isEditing ? () => handleRemoveNotMyThing(item) : undefined}
                      />
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Share up to 4 things that aren't your cup of tea.
                    </Typography>
                  )}
                </InterestChipContainer>
              </SectionCard>

              {/* Work-Life Balance Slider */}
              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <Balance sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Work-Life Balance
                </Typography>
                
                <Box sx={{ px: 2, py: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current: {
                      profileData.workLifeBalance <= 0.2 ? 'Work-focused' :
                      profileData.workLifeBalance <= 0.4 ? 'Work-leaning' :
                      profileData.workLifeBalance <= 0.6 ? 'Balanced' :
                      profileData.workLifeBalance <= 0.8 ? 'Life-leaning' : 'Life-focused'
                    }
                  </Typography>
                  
                  <Slider
                    value={profileData.workLifeBalance}
                    onChange={handleWorkLifeBalanceChange}
                    step={0.1}
                    min={0}
                    max={1}
                    disabled={!isEditing}
                    marks={[
                      { value: 0, label: 'Work-focused' },
                      { value: 0.5, label: 'Balanced' },
                      { value: 1, label: 'Life-focused' }
                    ]}
                    sx={{ mt: 2 }}
                  />
                </Box>
              </SectionCard>

              {/* Social Engagement Slider */}
              <SectionCard>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                  <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Social Engagement Preference
                </Typography>
                
                <Box sx={{ px: 2, py: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current: {
                      profileData.socialEngagementPreference <= 2 ? 'Very introverted' :
                      profileData.socialEngagementPreference <= 4 ? 'Introverted' :
                      profileData.socialEngagementPreference <= 6 ? 'Balanced' :
                      profileData.socialEngagementPreference <= 8 ? 'Extroverted' : 'Very extroverted'
                    }
                  </Typography>
                  
                  <Slider
                    value={profileData.socialEngagementPreference}
                    onChange={handleSocialEngagementChange}
                    step={1}
                    min={0}
                    max={10}
                    disabled={!isEditing}
                    marks={[
                      { value: 0, label: 'Introvert' },
                      { value: 5, label: 'Balanced' },
                      { value: 10, label: 'Extrovert' }
                    ]}
                    sx={{ mt: 2 }}
                  />
                </Box>
              </SectionCard>
            </Box>
          </TabPanel>

          {/* Privacy & Security Tab */}
          <TabPanel value={currentTab} index={3}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" gutterBottom>
                  Privacy & Security Settings
                </Typography>
                
                {!isEditing && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: '#667eea',
                      '&:hover': {
                        backgroundColor: '#5a6fd8'
                      }
                    }}
                  >
                    Edit Privacy
                  </Button>
                )}
              </Box>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center">
                    <Security sx={{ mr: 2 }} />
                    <Typography variant="h6">Security Settings</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profileData.security.twoFactorEnabled}
                        onChange={handleNestedFieldChange('security', 'twoFactorEnabled')}
                        disabled={!isEditing}
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center">
                    <Visibility sx={{ mr: 2 }} />
                    <Typography variant="h6">Privacy Settings</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Profile Visibility</InputLabel>
                        <Select
                          value={profileData.privacySettings.profileVisibility}
                          onChange={handleNestedFieldChange('privacySettings', 'profileVisibility')}
                          disabled={!isEditing}
                        >
                          <MenuItem value="public">Public</MenuItem>
                          <MenuItem value="friends">Friends Only</MenuItem>
                          <MenuItem value="private">Private</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.privacySettings.showOnlineStatus}
                            onChange={handleNestedFieldChange('privacySettings', 'showOnlineStatus')}
                            disabled={!isEditing}
                          />
                        }
                        label="Show Online Status"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.privacySettings.allowMessageRequests}
                            onChange={handleNestedFieldChange('privacySettings', 'allowMessageRequests')}
                            disabled={!isEditing}
                          />
                        }
                        label="Allow Message Requests"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.privacySettings.showLastSeen}
                            onChange={handleNestedFieldChange('privacySettings', 'showLastSeen')}
                            disabled={!isEditing}
                          />
                        }
                        label="Show Last Seen"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.privacySettings.discoverableByEmail}
                            onChange={handleNestedFieldChange('privacySettings', 'discoverableByEmail')}
                            disabled={!isEditing}
                          />
                        }
                        label="Discoverable by Email"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.privacySettings.discoverableByPhone}
                            onChange={handleNestedFieldChange('privacySettings', 'discoverableByPhone')}
                            disabled={!isEditing}
                          />
                        }
                        label="Discoverable by Phone"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={currentTab} index={4}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" gutterBottom>
                  Notification Preferences
                </Typography>
                
                {!isEditing && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: '#667eea',
                      '&:hover': {
                        backgroundColor: '#5a6fd8'
                      }
                    }}
                  >
                    Edit Notifications
                  </Button>
                )}
              </Box>

              <SectionCard>
                <Box display="flex" alignItems="center" mb={2}>
                  <Notifications sx={{ mr: 2 }} />
                  <Typography variant="h6">Push Notifications</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notificationSettings.newMatches}
                          onChange={handleNestedFieldChange('notificationSettings', 'newMatches')}
                          disabled={!isEditing}
                        />
                      }
                      label="New Matches"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notificationSettings.messages}
                          onChange={handleNestedFieldChange('notificationSettings', 'messages')}
                          disabled={!isEditing}
                        />
                      }
                      label="New Messages"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notificationSettings.profileViews}
                          onChange={handleNestedFieldChange('notificationSettings', 'profileViews')}
                          disabled={!isEditing}
                        />
                      }
                      label="Profile Views"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notificationSettings.friendRequests}
                          onChange={handleNestedFieldChange('notificationSettings', 'friendRequests')}
                          disabled={!isEditing}
                        />
                      }
                      label="Friend Requests"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notificationSettings.events}
                          onChange={handleNestedFieldChange('notificationSettings', 'events')}
                          disabled={!isEditing}
                        />
                      }
                      label="Events"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notificationSettings.marketing}
                          onChange={handleNestedFieldChange('notificationSettings', 'marketing')}
                          disabled={!isEditing}
                        />
                      }
                      label="Marketing Communications"
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </Box>
          </TabPanel>

          {/* Account Tab */}
          <TabPanel value={currentTab} index={5}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Typography variant="h5" gutterBottom>
                Account Information
              </Typography>

              <SectionCard>
                <Typography variant="h6" gutterBottom>
                  Account Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Account Status
                    </Typography>
                    <Typography variant="h6">
                      {profileData.isActive ? 'Active' : 'Inactive'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Verification Status
                    </Typography>
                    <Typography variant="h6">
                      {profileData.isVerified ? 'Verified' : 'Not Verified'}
                    </Typography>
                  </Grid>
                </Grid>
              </SectionCard>
            </Box>
          </TabPanel>
        </CardContent>
      </ProfileCard>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Settings sx={{ mr: 2 }} />
            Change Activity Status
          </Box>
        </DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select your activity status:</FormLabel>
            <RadioGroup
              value={profileData.activityStatus}
              onChange={(e) => setProfileData({...profileData, activityStatus: e.target.value})}
            >
              {statusOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <span>{option.icon}</span>
                      <Typography>{option.label}</Typography>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: option.color,
                          ml: 1
                        }}
                      />
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatusDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleStatusChange(profileData.activityStatus)} 
            variant="contained"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={4000}
        onClose={() => setShowSuccessMessage(false)}
      >
        <Alert onClose={() => setShowSuccessMessage(false)} severity="success">
          Profile updated successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showErrorMessage}
        autoHideDuration={6000}
        onClose={() => setShowErrorMessage(false)}
      >
        <Alert onClose={() => setShowErrorMessage(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  );
};

export default Profile;
