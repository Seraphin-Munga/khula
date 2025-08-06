import { UserProfile } from './user';

// Authentication request/response interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: UserProfile;
  token?: string;
  message?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: UserProfile;
  token?: string;
  message?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// API error interface
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  REFRESH_TOKEN: 'refresh_token',
} as const; 