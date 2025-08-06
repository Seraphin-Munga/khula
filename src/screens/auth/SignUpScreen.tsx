import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ValidationHelper } from '../../utils/validation';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

const { width, height } = Dimensions.get('window');

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({
    email: '',
  });
  const { register, isLoading: authLoading } = useAuth();
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateField = (field: string, value: string) => {
    let validation;
    
    switch (field) {
      case 'email':
        validation = ValidationHelper.validateEmail(value);
        break;
      default:
        validation = { isValid: true };
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: validation.isValid ? '' : validation.message || '',
    }));
    
    return validation?.isValid || false;
  };

  const handleSignUp = async () => {
    // Clear all errors
    setErrors({
      email: '',
    });

    // Validate email
    const emailValid = validateField('email', formData.email);

    if (!emailValid) {
      return;
    }

    // Attempt registration with email only
    const result = await register({
      firstName: '',
      lastName: '',
      email: formData.email,
      password: '', // Will be set in CompleteProfile screen
    });

    if (result.success) {
      // Registration successful - navigation will be handled automatically by AppNavigator
      // User will be redirected to CompleteProfile screen since new users have incomplete profiles
    } else {
      Alert.alert('Registration Failed', result.error || 'An error occurred during registration');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Logo section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>k</Text>
              <View style={styles.leafElement} />
            </View>
            <Text style={styles.brandName}>Khula Trader</Text>
            <Text style={styles.subtitle}>Create your secure account</Text>
          </View>

          {/* Form container */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign Up</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Icon name="email" size={20} color="#81C784" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.email ? styles.inputError : null]}
                  placeholder="Enter your email"
                  placeholderTextColor="#81C784"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  onBlur={() => validateField('email', formData.email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.signUpButton, authLoading ? styles.buttonDisabled : null]} 
              onPress={handleSignUp}
              disabled={authLoading}
            >
              {authLoading ? (
                <View style={styles.loadingContainer}>
                  <Icon name="hourglass-empty" size={20} color="#fff" />
                  <Text style={styles.signUpButtonText}>Creating Account...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Icon name="person-add" size={20} color="#fff" />
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              <Icon name="login" size={16} color="#81C784" />
              <Text style={styles.loginLinkText}>Already have an account? Log in</Text>
            </TouchableOpacity>
          </View>

          {/* Decorative elements */}
          <View style={styles.decorativeContainer}>
            <View style={[styles.accentCircle, styles.accentCircle1]} />
            <View style={[styles.accentCircle, styles.accentCircle2]} />
            <View style={[styles.accentCircle, styles.accentCircle3]} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012622', // Dark green background matching login
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
    position: 'relative',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  leafElement: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    transform: [{ rotate: '45deg' }],
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#81C784',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#81C784',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 18,
    fontSize: 16,
    color: '#fff',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  signUpButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 28,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    height: 56,
  },
  buttonDisabled: {
    backgroundColor: '#4CAF50',
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loginLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginLinkText: {
    color: '#81C784',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  accentCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    opacity: 0.6,
  },
  accentCircle1: {
    top: height * 0.15,
    right: 30,
  },
  accentCircle2: {
    top: height * 0.6,
    left: 20,
  },
  accentCircle3: {
    bottom: height * 0.1,
    right: 60,
  },
});

export default SignUpScreen; 