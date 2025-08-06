import { ValidationResult, LoginValidationData, VALIDATION_PATTERNS, VALIDATION_MESSAGES } from '../models/validation';

export class ValidationHelper {
  /**
   * Validates email format
   */
  static validateEmail(email: string): ValidationResult {
    if (!email) {
      return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED('Email') };
    }

    if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
      return { isValid: false, message: VALIDATION_MESSAGES.EMAIL };
    }

    return { isValid: true };
  }

  /**
   * Validates password strength
   */
  static validatePassword(password: string): ValidationResult {
    if (!password) {
      return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED('Password') };
    }

    if (password.length < 6) {
      return { isValid: false, message: VALIDATION_MESSAGES.MIN_LENGTH('Password', 6) };
    }

    // Optional: Add more password strength requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return { 
        isValid: false, 
        message: VALIDATION_MESSAGES.PASSWORD
      };
    }

    return { isValid: true };
  }

  /**
   * Validates complete login form
   */
  static validateLogin(data: LoginValidationData): ValidationResult {
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      return emailValidation;
    }

    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }

    return { isValid: true };
  }

  /**
   * Validates required fields
   */
  static validateRequired(value: string, fieldName: string): ValidationResult {
    if (!value || value.trim() === '') {
      return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED(fieldName) };
    }
    return { isValid: true };
  }

  /**
   * Validates minimum length
   */
  static validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
    if (value.length < minLength) {
      return { 
        isValid: false, 
        message: VALIDATION_MESSAGES.MIN_LENGTH(fieldName, minLength)
      };
    }
    return { isValid: true };
  }

  /**
   * Validates maximum length
   */
  static validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
    if (value.length > maxLength) {
      return { 
        isValid: false, 
        message: VALIDATION_MESSAGES.MAX_LENGTH(fieldName, maxLength)
      };
    }
    return { isValid: true };
  }

  /**
   * Validates phone number format
   */
  static validatePhone(phone: string): ValidationResult {
    if (!phone) {
      return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED('Phone number') };
    }

    if (!VALIDATION_PATTERNS.PHONE.test(phone.replace(/\s/g, ''))) {
      return { isValid: false, message: VALIDATION_MESSAGES.PHONE };
    }

    return { isValid: true };
  }

  /**
   * Validates URL format
   */
  static validateUrl(url: string): ValidationResult {
    if (!url) {
      return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED('URL') };
    }

    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, message: VALIDATION_MESSAGES.URL };
    }
  }

  /**
   * Validates numeric input
   */
  static validateNumeric(value: string, fieldName: string): ValidationResult {
    if (!value) {
      return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED(fieldName) };
    }

    if (isNaN(Number(value))) {
      return { isValid: false, message: VALIDATION_MESSAGES.NUMERIC(fieldName) };
    }

    return { isValid: true };
  }

  /**
   * Validates date format (YYYY-MM-DD)
   */
  static validateDate(date: string): ValidationResult {
    if (!date) {
      return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED('Date') };
    }

    if (!VALIDATION_PATTERNS.DATE.test(date)) {
      return { isValid: false, message: VALIDATION_MESSAGES.DATE };
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, message: VALIDATION_MESSAGES.DATE };
    }

    return { isValid: true };
  }
} 