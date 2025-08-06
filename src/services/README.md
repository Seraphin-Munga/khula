# Authentication Service

This module provides a comprehensive authentication service for the Khula Trader app, handling login, registration, token management, and user profile operations.

## Features

- **Login/Registration**: Secure authentication with email and password
- **Token Management**: Automatic JWT token storage and retrieval
- **Profile Management**: User profile CRUD operations
- **Password Management**: Password change and reset functionality
- **Persistent Sessions**: Automatic session restoration on app restart
- **Error Handling**: Comprehensive error handling and user feedback

## Usage

### Basic Authentication

```typescript
import { authService } from '../services/authService';

// Login
const loginResult = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

if (loginResult.success) {
  console.log('Login successful:', loginResult.user);
  console.log('Token:', loginResult.token);
} else {
  console.error('Login failed:', loginResult.message);
}

// Register
const registerResult = await authService.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  phone: '+1234567890'
});

// Logout
await authService.logout();
```

### Using Redux with useAuth Hook

```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { 
    user, 
    isLoggedIn, 
    isLoading, 
    error, 
    login, 
    logout, 
    loadProfile 
  } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });

    if (result.success) {
      console.log('Login successful');
    } else {
      console.error('Login failed:', result.error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Load user profile on component mount
  useEffect(() => {
    if (isLoggedIn && !user) {
      loadProfile();
    }
  }, [isLoggedIn, user]);

  return (
    <View>
      {isLoggedIn ? (
        <Text>Welcome, {user?.firstName}!</Text>
      ) : (
        <Text>Please log in</Text>
      )}
    </View>
  );
};
```

## API Reference

### AuthService Methods

#### `login(credentials: LoginRequest): Promise<LoginResponse>`
Authenticates a user with email and password.

#### `register(userData: RegisterRequest): Promise<RegisterResponse>`
Registers a new user account.

#### `logout(): Promise<void>`
Logs out the current user and clears all stored data.

#### `getCurrentUser(): Promise<UserProfile | null>`
Retrieves the current user's profile from API or local storage.

#### `updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null>`
Updates the user's profile information.

#### `changePassword(currentPassword: string, newPassword: string): Promise<boolean>`
Changes the user's password.

#### `requestPasswordReset(email: string): Promise<boolean>`
Requests a password reset email.

#### `resetPassword(token: string, newPassword: string): Promise<boolean>`
Resets password using a reset token.

#### `refreshToken(): Promise<boolean>`
Refreshes the authentication token.

#### `isAuthenticated(): boolean`
Checks if the user is currently authenticated.

#### `getToken(): string | null`
Gets the current authentication token.

### Types

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: UserProfile;
  token?: string;
  message?: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  isLoggedIn: boolean;
}
```

## Redux Integration

The authentication service is integrated with Redux through async thunks:

### Actions

- `loginUser(credentials)` - Login user
- `registerUser(userData)` - Register user
- `logoutUser()` - Logout user
- `loadUserProfile()` - Load user profile
- `updateUserProfile(updates)` - Update user profile

### State

```typescript
interface AuthState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}
```

## Storage

The service automatically manages:

- **Authentication Token**: Stored securely in AsyncStorage
- **User Profile**: Cached locally for offline access
- **Refresh Token**: For automatic token renewal

## Error Handling

The service provides comprehensive error handling:

- Network errors
- Authentication failures
- Token expiration
- Invalid credentials
- Server errors

All errors are properly typed and include user-friendly messages.

## Security Features

- Secure token storage
- Automatic token refresh
- Session management
- Password strength validation
- Secure API communication

## Configuration

Update the `baseUrl` in the AuthService class to point to your actual API endpoint:

```typescript
private baseUrl: string = 'https://your-api-domain.com';
```

## Demo Mode

The service includes demo mode for development/testing:

- Simulates successful login/registration
- Generates mock user data
- Creates mock JWT tokens
- Simulates API delays

To disable demo mode, replace the mock implementations with actual API calls. 