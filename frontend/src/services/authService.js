import api from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.loginUser({ email, password });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await api.registerUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.getUserProfile('me');
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.updateUserProfile ? await api.updateUserProfile(profileData) : null;
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
