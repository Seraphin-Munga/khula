// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Login validation data interface
export interface LoginValidationData {
  email: string;
  password: string;
}

// Form validation interfaces
export interface FormValidationState {
  [key: string]: string; // field name -> error message
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => ValidationResult;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  URL: /^https?:\/\/.+/,
} as const;

// Common validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: (fieldName: string) => `${fieldName} is required`,
  EMAIL: 'Please enter a valid email address',
  PASSWORD: 'Password must contain uppercase, lowercase, and numbers',
  MIN_LENGTH: (fieldName: string, minLength: number) => 
    `${fieldName} must be at least ${minLength} characters long`,
  MAX_LENGTH: (fieldName: string, maxLength: number) => 
    `${fieldName} must be no more than ${maxLength} characters long`,
  PHONE: 'Please enter a valid phone number',
  URL: 'Please enter a valid URL',
  NUMERIC: (fieldName: string) => `${fieldName} must be a number`,
  DATE: 'Please enter a valid date (YYYY-MM-DD)',
  PASSWORDS_MATCH: 'Passwords do not match',
} as const; 