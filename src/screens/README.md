# Screens Directory Structure

This directory contains all the screens for the Khula application, organized by functionality.

## Directory Structure

```
src/screens/
├── auth/                    # Authentication screens
│   ├── index.ts            # Auth screens exports
│   ├── LoginScreen.tsx     # User login screen
│   └── SignUpScreen.tsx    # User registration screen
├── main/                   # Main application screens
│   ├── index.ts            # Main screens exports
│   ├── HomeScreen.tsx      # Main home/dashboard screen
│   └── DocumentsScreen.tsx # Document management screen
├── onboarding/             # Onboarding and profile setup screens
│   ├── index.ts            # Onboarding screens exports
│   ├── LandingScreen.tsx   # App landing/welcome screen
│   └── CompleteProfileScreen.tsx # Profile completion screen
├── index.ts                # Main screens exports
└── README.md               # This file
```

## Screen Categories

### Auth Screens (`/auth`)
- **LoginScreen**: Handles user authentication
- **SignUpScreen**: Handles user registration

### Main Screens (`/main`)
- **HomeScreen**: Main dashboard/home screen after login
- **DocumentsScreen**: Document upload and management

### Onboarding Screens (`/onboarding`)
- **LandingScreen**: Welcome/landing page for new users
- **CompleteProfileScreen**: Profile completion and document upload flow

## Import Usage

You can import screens using the organized structure:

```typescript
// Import specific category
import { LoginScreen, SignUpScreen } from '../screens/auth';
import { HomeScreen, DocumentsScreen } from '../screens/main';
import { LandingScreen, CompleteProfileScreen } from '../screens/onboarding';

// Or import all screens
import * as Screens from '../screens';
```

## Adding New Screens

When adding new screens:

1. Determine the appropriate category (auth, main, or onboarding)
2. Place the screen in the corresponding directory
3. Update the `index.ts` file in that directory to export the new screen
4. Update any navigation files that need to reference the new screen

## Navigation

The main navigation configuration is in `src/navigation/AppNavigator.tsx` and has been updated to use the new import structure. 