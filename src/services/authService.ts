import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../models/user';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiError,
  STORAGE_KEYS,
} from '../models/auth';
import MockDataService from './mockDataService';

class AuthService {
  private baseUrl: string = 'https://api.khula-trader.com'; // Replace with your actual API URL
  private token: string | null = null;

  /**
   * Initialize the service and load stored token
   */
  async initialize(): Promise<void> {
    try {
      this.token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
    }
  }

  /**
   * Set authentication token
   */
  private async setToken(token: string): Promise<void> {
    try {
      this.token = token;
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Failed to save token:', error);
      throw new Error('Failed to save authentication token');
    }
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Clear authentication token
   */
  private async clearToken(): Promise<void> {
    try {
      this.token = null;
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  /**
   * Save user profile to storage
   */
  private async saveUserProfile(user: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw new Error('Failed to save user profile');
    }
  }

  /**
   * Get stored user profile
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Clear stored user profile
   */
  private async clearUserProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (error) {
      console.error('Failed to clear user profile:', error);
    }
  }

  /**
   * Make authenticated API request
   */
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - in real app, this would be server-side validation
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          message: 'Email and password are required',
        };
      }

      // Get mock user from MockDataService
      const mockDataService = MockDataService.getInstance();
      const mockUser = mockDataService.findUserByEmail(credentials.email);

      // Validate password
      if (!mockUser || mockUser.password !== credentials.password) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      const mockToken = mockDataService.generateMockToken();
      
      // Save token and user profile
      await this.setToken(mockToken);
      await this.saveUserProfile(mockUser.user);

      // Set current user in mock data service
      mockDataService.setCurrentUser(mockUser, mockToken);

      return {
        success: true,
        user: mockUser.user,
        token: mockToken,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation
      if (!userData.email) {
        return {
          success: false,
          message: 'Email is required',
        };
      }

      // Check if email already exists using MockDataService
      const mockDataService = MockDataService.getInstance();
      const existingUser = mockDataService.findUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Email already exists',
        };
      }

      // Create new user profile with incomplete data to trigger profile completion
      const newUser: UserProfile = {
        firstName: '', // Incomplete - will trigger CompleteProfile screen
        lastName: '',
        email: userData.email,
        phone: '',
        address: '',
        dateOfBirth: '',
        isLoggedIn: true,
      };

      // Add new user to mock data service
      const mockUser = {
        email: userData.email,
        password: userData.password || '',
        user: newUser,
      };
      mockDataService.addUser(mockUser);

      const mockToken = mockDataService.generateMockToken();
      
      // Save token and user profile
      await this.setToken(mockToken);
      await this.saveUserProfile(newUser);

      // Set current user in mock data service
      mockDataService.setCurrentUser(mockUser, mockToken);

      return {
        success: true,
        user: newUser,
        token: mockToken,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Clear session from MockDataService
      const mockDataService = MockDataService.getInstance();
      mockDataService.clearSession();

      // Clear local storage
      await this.clearToken();
      await this.clearUserProfile();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if there's an error
      await this.clearToken();
      await this.clearUserProfile();
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await this.setToken(data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      // Try to get from API first
      const user = await this.makeAuthenticatedRequest<UserProfile>('/auth/me');
      await this.saveUserProfile(user);
      return user;
    } catch (error) {
      // Fallback to stored profile
      console.warn('Failed to fetch current user, using stored profile:', error);
      return await this.getUserProfile();
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockDataService = MockDataService.getInstance();
      const currentUser = mockDataService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('No current user found');
      }

      // Update user in mock data service
      const success = mockDataService.updateUser(currentUser.email, updates);
      if (!success) {
        throw new Error('Failed to update user profile');
      }

      // Get updated user profile
      const updatedUser = mockDataService.findUserByEmail(currentUser.email);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user profile');
      }

      // Save to local storage
      await this.saveUserProfile(updatedUser.user);
      return updatedUser.user;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      await this.makeAuthenticatedRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      return true;
    } catch (error) {
      console.error('Password change error:', error);
      return false;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      await fetch(`${this.baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      return false;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      await fetch(`${this.baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Initialize the service when the module is imported
authService.initialize().catch(console.error); 