# Models

This folder contains all TypeScript interfaces and types used throughout the Khula Trader app. The models are organized by domain to maintain a clean and scalable architecture.

## Structure

```
src/models/
├── index.ts          # Main export file
├── auth.ts           # Authentication-related interfaces
├── user.ts           # User-related interfaces
├── validation.ts     # Validation-related interfaces
└── README.md         # This documentation
```

## Authentication Models (`auth.ts`)

Contains all authentication-related interfaces:

### Request/Response Interfaces
- `LoginRequest` - Login credentials
- `LoginResponse` - Login result
- `RegisterRequest` - Registration data
- `RegisterResponse` - Registration result
- `PasswordResetRequest` - Password reset request
- `PasswordResetResponse` - Password reset result
- `ChangePasswordRequest` - Password change request
- `ChangePasswordResponse` - Password change result
- `RefreshTokenRequest` - Token refresh request
- `RefreshTokenResponse` - Token refresh result

### Utility Interfaces
- `ApiError` - Standard API error format
- `STORAGE_KEYS` - AsyncStorage key constants

## User Models (`user.ts`)

Contains all user-related interfaces:

### Core User Interfaces
- `UserProfile` - Basic user profile information
- `ExtendedUserProfile` - Extended user profile with additional fields
- `UserSettings` - User preferences and settings
- `UserActivity` - User activity tracking
- `UserSession` - User session management
- `UserPermissions` - User permissions
- `UserRole` - User role definition

## Validation Models (`validation.ts`)

Contains validation-related interfaces and constants:

### Interfaces
- `ValidationResult` - Standard validation result format
- `LoginValidationData` - Login form validation data
- `FormValidationState` - Form validation state management
- `ValidationRule` - Individual validation rule
- `ValidationRules` - Collection of validation rules

### Constants
- `VALIDATION_PATTERNS` - Common regex patterns
- `VALIDATION_MESSAGES` - Standard validation messages

## Usage

### Importing Models

```typescript
// Import specific models
import { LoginRequest, UserProfile } from '../models';

// Import all models from a specific file
import * as AuthModels from '../models/auth';
import * as UserModels from '../models/user';
import * as ValidationModels from '../models/validation';
```

### Using in Components

```typescript
import { UserProfile, LoginRequest } from '../models';

const MyComponent = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const handleLogin = (credentials: LoginRequest) => {
    // Login logic
  };
};
```

### Using in Services

```typescript
import { LoginResponse, ApiError } from '../models';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Login logic
    } catch (error) {
      const apiError: ApiError = {
        message: 'Login failed',
        status: 401
      };
      throw apiError;
    }
  }
}
```

### Using in Validation

```typescript
import { ValidationResult, VALIDATION_PATTERNS } from '../models';

const validateEmail = (email: string): ValidationResult => {
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return {
      isValid: false,
      message: 'Invalid email format'
    };
  }
  return { isValid: true };
};
```

## Best Practices

### 1. **Single Source of Truth**
- All interfaces should be defined in the models folder
- Avoid duplicating interfaces across different files
- Use the models index for centralized exports

### 2. **Consistent Naming**
- Use PascalCase for interface names
- Use descriptive names that clearly indicate purpose
- Add suffixes like `Request`, `Response`, `State` for clarity

### 3. **Type Safety**
- Always use proper TypeScript types
- Avoid using `any` type
- Use union types for limited value sets
- Use optional properties (`?`) when appropriate

### 4. **Documentation**
- Add JSDoc comments for complex interfaces
- Include examples in comments when helpful
- Keep interfaces focused and single-purpose

### 5. **Organization**
- Group related interfaces in the same file
- Use consistent ordering (requests, responses, utilities)
- Keep files focused on a single domain

## Adding New Models

When adding new models:

1. **Create the interface** in the appropriate domain file
2. **Export it** from the domain file
3. **Add to index.ts** for centralized access
4. **Update documentation** if needed
5. **Use consistent patterns** with existing models

### Example

```typescript
// In user.ts
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

// In index.ts
export * from './user';

// Usage
import { UserPreferences } from '../models';
```

## Migration Guide

When migrating from scattered interfaces:

1. **Identify interfaces** scattered across the codebase
2. **Categorize them** by domain (auth, user, validation, etc.)
3. **Move them** to appropriate model files
4. **Update imports** throughout the codebase
5. **Test thoroughly** to ensure no breaking changes
6. **Update documentation** and examples

This organization makes the codebase more maintainable, scalable, and easier to understand for new developers. 