// User profile interface
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  isLoggedIn: boolean;
}

// User settings interface
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    currency: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

// User activity interface
export interface UserActivity {
  id: string;
  type: 'login' | 'logout' | 'profile_update' | 'password_change' | 'document_upload';
  timestamp: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
}

// User session interface
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
  lastActivity: string;
  deviceInfo: {
    deviceId: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser?: string;
  };
}

// User permissions interface
export interface UserPermissions {
  canViewDocuments: boolean;
  canUploadDocuments: boolean;
  canDeleteDocuments: boolean;
  canEditProfile: boolean;
  canManageUsers: boolean;
  canAccessAdmin: boolean;
}

// User role interface
export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: UserPermissions;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Extended user profile with additional fields
export interface ExtendedUserProfile extends UserProfile {
  id: string;
  username?: string;
  avatar?: string;
  bio?: string;
  settings: UserSettings;
  role: UserRole;
  permissions: UserPermissions;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
} 