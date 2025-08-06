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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ValidationHelper } from '../../utils/validation';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading: authLoading, error: authError, clearAuthError } = useAuth();

  const validateField = (field: 'email' | 'password', value: string) => {
    let validation;
    
    switch (field) {
      case 'email':
        validation = ValidationHelper.validateEmail(value);
        setEmailError(validation.isValid ? '' : validation.message || '');
        break;
      case 'password':
        validation = ValidationHelper.validatePassword(value);
        setPasswordError(validation.isValid ? '' : validation.message || '');
        break;
    }
    
    return validation?.isValid || false;
  };

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    clearAuthError();

    // Validate all fields
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);

    if (!emailValid || !passwordValid) {
      return;
    }

    // Attempt login
    const result = await login({ email, password });
    
    if (result.success) {
      // Login successful - navigation will be handled automatically by AppNavigator
      // based on whether the user has a complete profile or not
    } else {
      Alert.alert('Login Failed', result.error || 'An error occurred during login');
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
            <Text style={styles.subtitle}>Welcome back to your secure platform</Text>
          </View>

          {/* Form container */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Icon name="email" size={20} color="#81C784" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  placeholder="Enter your email"
                  placeholderTextColor="#81C784"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateField('email', text);
                  }}
                  onBlur={() => validateField('email', email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={20} color="#81C784" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, passwordError ? styles.inputError : null]}
                  placeholder="Enter your password"
                  placeholderTextColor="#81C784"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) validateField('password', text);
                  }}
                  onBlur={() => validateField('password', password)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#81C784" 
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, authLoading ? styles.loginButtonDisabled : null]} 
              onPress={handleLogin}
              disabled={authLoading}
            >
              {authLoading ? (
                <View style={styles.loadingContainer}>
                  <Icon name="hourglass-empty" size={20} color="#fff" />
                  <Text style={styles.loginButtonText}>Logging in...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Icon name="login" size={20} color="#fff" />
                  <Text style={styles.loginButtonText}>Login</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Icon name="help-outline" size={16} color="#81C784" />
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
    backgroundColor: '#012622', // Dark green background matching landing
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
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
  eyeIcon: {
    padding: 15,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#81C784',
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
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  forgotPasswordText: {
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

export default LoginScreen; 