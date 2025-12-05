// src/controllers/authController.js
import { loginUser, registerUser, logout } from '../store/slices/authSlice';

export class AuthController {
  static async handleLogin(dispatch, credentials) {
    try {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(result)) {
        return { success: true, user: result.payload.user };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  static async handleRegister(dispatch, userData) {
    try {
      const result = await dispatch(registerUser(userData));
      if (registerUser.fulfilled.match(result)) {
        return { success: true, user: result.payload.user };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  static handleLogout(dispatch) {
    dispatch(logout());
    return { success: true };
  }
}
