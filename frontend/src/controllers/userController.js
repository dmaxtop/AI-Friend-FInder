// frontend/src/controllers/userController.js (Complete User Controller)
import { 
  getUserProfile, 
  uploadProfileImage, 
  registerUser, 
  loginUser 
} from '../services/api';

class UserController {
  // ✅ User Profile Management
  static async fetchUserProfile(userId) {
    try {
      console.log('🎯 Fetching user profile for:', userId);
      const response = await getUserProfile(userId);
      
      if (response.success) {
        return {
          success: true,
          user: response.data.user,
          message: 'Profile fetched successfully'
        };
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('❌ Fetch profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch user profile'
      };
    }
  }

  static async updateUserProfile(userId, profileData) {
    try {
      console.log('📝 Updating user profile for:', userId);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Update localStorage if updating current user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.id === userId) {
          localStorage.setItem('user', JSON.stringify({ ...currentUser, ...result.data.user }));
        }
        
        return {
          success: true,
          user: result.data.user,
          message: 'Profile updated successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  }

  // ✅ Image Management
  static async uploadProfileImages(userId, formData) {
    try {
      console.log('📤 Uploading profile images for:', userId);
      const response = await uploadProfileImage(userId, formData);
      
      if (response.success) {
        return {
          success: true,
          images: response.data.uploadedImages,
          message: 'Images uploaded successfully'
        };
      } else {
        throw new Error(response.message || 'Failed to upload images');
      }
    } catch (error) {
      console.error('❌ Image upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload images'
      };
    }
  }

  static async deleteProfileImage(userId, imageId) {
    try {
      console.log('🗑️ Deleting profile image:', imageId);
      const response = await fetch(`/api/users/${userId}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: 'Image deleted successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('❌ Delete image error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete image'
      };
    }
  }

  static async setPrimaryImage(userId, imageId) {
    try {
      console.log('⭐ Setting primary image:', imageId);
      const response = await fetch(`/api/users/${userId}/images/${imageId}/primary`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: 'Primary image updated successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to set primary image');
      }
    } catch (error) {
      console.error('❌ Set primary image error:', error);
      return {
        success: false,
        error: error.message || 'Failed to set primary image'
      };
    }
  }

  // ✅ User Search and Discovery
  static async searchUsers(searchQuery, filters = {}) {
    try {
      console.log('🔍 Searching users with query:', searchQuery);
      const queryParams = new URLSearchParams({
        q: searchQuery,
        ...filters
      });

      const response = await fetch(`/api/users/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          users: result.data.users,
          totalCount: result.data.totalCount,
          message: 'Users found successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to search users');
      }
    } catch (error) {
      console.error('❌ Search users error:', error);
      return {
        success: false,
        error: error.message || 'Failed to search users'
      };
    }
  }

  static async getRecommendedUsers(userId, limit = 10) {
    try {
      console.log('🎯 Getting recommended users for:', userId);
      const response = await fetch(`/api/users/${userId}/recommendations?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          recommendations: result.data.recommendations,
          message: 'Recommendations fetched successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to get recommendations');
      }
    } catch (error) {
      console.error('❌ Get recommendations error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get recommendations'
      };
    }
  }

  // ✅ User Preferences and Settings
  static async updateUserPreferences(userId, preferences) {
    try {
      console.log('⚙️ Updating user preferences for:', userId);
      const response = await fetch(`/api/users/${userId}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(preferences)
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          preferences: result.data.preferences,
          message: 'Preferences updated successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('❌ Update preferences error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update preferences'
      };
    }
  }

  static async getUserPreferences(userId) {
    try {
      console.log('📋 Getting user preferences for:', userId);
      const response = await fetch(`/api/users/${userId}/preferences`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          preferences: result.data.preferences,
          message: 'Preferences fetched successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to get preferences');
      }
    } catch (error) {
      console.error('❌ Get preferences error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get preferences'
      };
    }
  }

  // ✅ User Statistics and Analytics
  static async getUserStats(userId) {
    try {
      console.log('📊 Getting user statistics for:', userId);
      const response = await fetch(`/api/users/${userId}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          stats: result.data.stats,
          message: 'Statistics fetched successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to get statistics');
      }
    } catch (error) {
      console.error('❌ Get stats error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user statistics'
      };
    }
  }

  // ✅ User Authentication State Management
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('👤 Getting current user');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(result.user));
        
        return {
          success: true,
          user: result.user,
          message: 'Current user fetched successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to get current user');
      }
    } catch (error) {
      console.error('❌ Get current user error:', error);
      
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return {
        success: false,
        error: error.message || 'Failed to get current user'
      };
    }
  }

  static async refreshUserToken() {
    try {
      console.log('🔄 Refreshing user token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('token', result.token);
        if (result.refreshToken) {
          localStorage.setItem('refreshToken', result.refreshToken);
        }
        
        return {
          success: true,
          token: result.token,
          message: 'Token refreshed successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to refresh token');
      }
    } catch (error) {
      console.error('❌ Refresh token error:', error);
      
      // Clear invalid auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: false,
        error: error.message || 'Failed to refresh token'
      };
    }
  }

  // ✅ User Registration and Login (Controller Layer)
  static async handleRegister(dispatch, userData) {
    try {
      console.log('📝 Registering new user');
      const response = await registerUser(userData);
      
      if (response.success) {
        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Dispatch Redux action if dispatch is provided
        if (dispatch) {
          dispatch({ 
            type: 'REGISTER_SUCCESS', 
            payload: { 
              user: response.user, 
              token: response.token 
            } 
          });
        }
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: 'Registration successful'
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (dispatch) {
        dispatch({ 
          type: 'REGISTER_FAILURE', 
          payload: error.message 
        });
      }
      
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  }

  static async handleLogin(dispatch, credentials) {
    try {
      console.log('🔐 Logging in user');
      const response = await loginUser(credentials);
      
      if (response.success) {
        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Dispatch Redux action if dispatch is provided
        if (dispatch) {
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { 
              user: response.user, 
              token: response.token 
            } 
          });
        }
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: 'Login successful'
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (dispatch) {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: error.message 
        });
      }
      
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  static handleLogout(dispatch) {
    try {
      console.log('👋 Logging out user');
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Dispatch Redux action if dispatch is provided
      if (dispatch) {
        dispatch({ type: 'LOGOUT' });
      }
      
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return {
        success: false,
        error: error.message || 'Logout failed'
      };
    }
  }

  // ✅ Utility Methods
  static isUserLoggedIn() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  static getUserFromStorage() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('❌ Error parsing user from storage:', error);
      return null;
    }
  }

  static getTokenFromStorage() {
    return localStorage.getItem('token');
  }

  // ✅ User Activity Tracking
  static async updateLastSeen(userId) {
    try {
      const response = await fetch(`/api/users/${userId}/activity`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      return result.success ? { success: true } : { success: false };
    } catch (error) {
      console.error('❌ Update last seen error:', error);
      return { success: false };
    }
  }

  // ✅ Privacy and Blocking
  static async blockUser(userId, blockedUserId) {
    try {
      console.log('🚫 Blocking user:', blockedUserId);
      const response = await fetch(`/api/users/${userId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ blockedUserId })
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: 'User blocked successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('❌ Block user error:', error);
      return {
        success: false,
        error: error.message || 'Failed to block user'
      };
    }
  }

  static async unblockUser(userId, blockedUserId) {
    try {
      console.log('✅ Unblocking user:', blockedUserId);
      const response = await fetch(`/api/users/${userId}/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ blockedUserId })
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: 'User unblocked successfully'
        };
      } else {
        throw new Error(result.message || 'Failed to unblock user');
      }
    } catch (error) {
      console.error('❌ Unblock user error:', error);
      return {
        success: false,
        error: error.message || 'Failed to unblock user'
      };
    }
  }
}

export default UserController;
