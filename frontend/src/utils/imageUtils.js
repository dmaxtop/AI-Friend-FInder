// frontend/src/utils/imageUtils.js
export const getProfileImage = (user) => {
  // Priority order for profile images
  if (user?.primaryProfileImage) {
    return user.primaryProfileImage;
  }
  
  if (user?.profileImages && user.profileImages.length > 0) {
    // Try to find primary image first
    const primaryImage = user.profileImages.find(img => img.isPrimary);
    if (primaryImage) return primaryImage.url;
    
    // Fall back to first public image
    const publicImage = user.profileImages.find(img => img.isPublic !== false);
    if (publicImage) return publicImage.url;
    
    // Last resort: first image
    return user.profileImages[0].url;
  }
  
  return null; // No image available
};

export const getCoverPhoto = (user) => {
  // Priority order for cover photos
  if (user?.coverPhoto) {
    return user.coverPhoto;
  }
  
  if (user?.profileImages && user.profileImages.length > 0) {
    // Try to find designated cover photo
    const coverImage = user.profileImages.find(img => img.isCoverPhoto);
    if (coverImage) return coverImage.url;
  }
  
  return null; // No cover photo available
};

export const getAllUserImages = (user) => {
  if (!user?.profileImages || user.profileImages.length === 0) {
    return [];
  }
  
  return user.profileImages
    .filter(img => img.isPublic !== false) // Only public images
    .sort((a, b) => {
      // Sort by: primary first, then cover, then by upload date
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      if (a.isCoverPhoto && !b.isCoverPhoto) return -1;
      if (!a.isCoverPhoto && b.isCoverPhoto) return 1;
      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    });
};

export const getImagePlaceholder = (user) => {
  // Generate a colorful placeholder based on user's name
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  ];
  
  const nameHash = (user?.firstName || 'User').charCodeAt(0) % colors.length;
  return colors[nameHash];
};
