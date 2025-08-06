# Khula Mobile Application

A React Native mobile application built with Expo that simulates a login flow with profile management and document upload functionality.

## Features

### 1. Landing Screen
- Beautiful landing page with Khula Trader branding
- Image collage using assets from `assets/imgs/`
- Sign up and Log in options
- Modern UI with dark green theme

### 2. Authentication Flow
- **Login Screen**: Email and password authentication
- **Sign Up Screen**: New user registration with validation
- Form validation for email format and password requirements

### 3. Profile Management
- **Profile Screen**: Complete user profile form
- Fields include: First Name, Last Name, Email, Phone, Address, Date of Birth
- Real-time form validation
- Data persistence using Redux and AsyncStorage

### 4. Document Upload
- **Documents Screen**: Upload various document types
- Document types: ID Document, Passport, Driver's License, Utility Bill, Bank Statement, Payslip
- **Upload Modal**: Three upload options:
  - Take Photo (Camera)
  - Choose from Gallery
  - Choose Document (File picker)
- Document status tracking (Uploaded/Not Uploaded)
- List of uploaded documents with timestamps

## Technical Stack

- **Framework**: Expo (React Native)
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation v6
- **Storage**: AsyncStorage for data persistence
- **Document Handling**: Expo Document Picker & Image Picker
- **Language**: TypeScript
- **UI**: Custom components with modern design

## Project Structure

```
src/
├── navigation/
│   └── AppNavigator.tsx          # Main navigation setup
├── screens/
│   ├── LandingScreen.tsx         # Landing page with sign up/login
│   ├── LoginScreen.tsx           # User authentication
│   ├── SignUpScreen.tsx          # New user registration
│   ├── ProfileScreen.tsx         # Profile information form
│   └── DocumentsScreen.tsx       # Document upload interface
├── store/
│   ├── store.ts                  # Redux store configuration
│   └── slices/
│       ├── userProfileSlice.ts   # User profile state management
│       └── documentsSlice.ts     # Documents state management
└── utils/
    └── storage.ts                # AsyncStorage utilities
```

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on specific platform**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## User Journey

1. **Landing**: User sees the Khula Trader landing page
2. **Authentication**: User chooses to Sign Up or Log In
3. **Profile Setup**: After authentication, user fills profile information
4. **Document Upload**: User uploads required documents through the modal interface

## State Management

The application uses Redux Toolkit for state management with two main slices:

### User Profile Slice
- Manages user authentication status
- Stores profile information
- Handles login/logout actions

### Documents Slice
- Manages uploaded documents
- Tracks document status
- Handles document CRUD operations

## Data Persistence

- User profile and documents are automatically saved to AsyncStorage
- Data persists between app sessions
- State is restored on app launch

## Design Features

- **Modern UI**: Clean, professional design with consistent color scheme
- **Responsive Layout**: Adapts to different screen sizes
- **Form Validation**: Real-time validation with user feedback
- **Loading States**: Smooth transitions and loading indicators
- **Error Handling**: Comprehensive error messages and alerts

## API Simulation

The application simulates API calls for:
- User authentication
- Profile data submission
- Document upload

## Permissions

The app requests permissions for:
- Camera access (for document photos)
- Photo library access (for document selection)
- File system access (for document upload)

## Future Enhancements

- Real API integration
- Push notifications
- Offline support
- Image compression
- Document preview
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary. 