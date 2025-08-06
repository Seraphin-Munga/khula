# Validation Helper

This module provides a comprehensive validation utility for form inputs in the Khula Trader app.

## Features

- Email validation with proper regex pattern
- Password strength validation
- Required field validation
- Length validation (min/max)
- Phone number validation
- URL validation
- Numeric validation
- Date validation
- Real-time validation with error messages

## Usage

### Basic Validation

```typescript
import { ValidationHelper } from '../utils/validation';

// Validate email
const emailValidation = ValidationHelper.validateEmail('user@example.com');
if (!emailValidation.isValid) {
  console.log(emailValidation.message); // Error message
}

// Validate password
const passwordValidation = ValidationHelper.validatePassword('MyPassword123');
if (!passwordValidation.isValid) {
  console.log(passwordValidation.message); // Error message
}
```

### Form Validation

```typescript
// Validate complete login form
const loginData = {
  email: 'user@example.com',
  password: 'MyPassword123'
};

const loginValidation = ValidationHelper.validateLogin(loginData);
if (!loginValidation.isValid) {
  console.log(loginValidation.message);
}
```

### Real-time Validation in React Components

```typescript
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateField = (field: 'email', value: string) => {
  const validation = ValidationHelper.validateEmail(value);
  setEmailError(validation.isValid ? '' : validation.message || '');
  return validation.isValid;
};

// In your TextInput
<TextInput
  value={email}
  onChangeText={(text) => {
    setEmail(text);
    if (emailError) validateField('email', text);
  }}
  onBlur={() => validateField('email', email)}
/>
{emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
```

## Available Validation Methods

### `validateEmail(email: string): ValidationResult`
Validates email format using regex pattern.

### `validatePassword(password: string): ValidationResult`
Validates password strength (minimum 6 characters, uppercase, lowercase, numbers).

### `validateLogin(data: LoginValidationData): ValidationResult`
Validates complete login form (email + password).

### `validateRequired(value: string, fieldName: string): ValidationResult`
Validates that a field is not empty.

### `validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult`
Validates minimum length requirement.

### `validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult`
Validates maximum length requirement.

### `validatePhone(phone: string): ValidationResult`
Validates phone number format.

### `validateUrl(url: string): ValidationResult`
Validates URL format.

### `validateNumeric(value: string, fieldName: string): ValidationResult`
Validates that input is numeric.

### `validateDate(date: string): ValidationResult`
Validates date format (YYYY-MM-DD).

## Types

```typescript
interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface LoginValidationData {
  email: string;
  password: string;
}
```

## Error Messages

The validation helper provides user-friendly error messages for each validation type:

- Email: "Please enter a valid email address"
- Password: "Password must contain uppercase, lowercase, and numbers"
- Required: "{fieldName} is required"
- Length: "{fieldName} must be at least {minLength} characters long"
- Phone: "Please enter a valid phone number"
- URL: "Please enter a valid URL"
- Numeric: "{fieldName} must be a number"
- Date: "Please enter a valid date (YYYY-MM-DD)"

## Customization

You can extend the `ValidationHelper` class to add custom validation methods:

```typescript
static validateCustomField(value: string): ValidationResult {
  // Your custom validation logic
  if (customCondition) {
    return { isValid: false, message: 'Custom error message' };
  }
  return { isValid: true };
}
``` 