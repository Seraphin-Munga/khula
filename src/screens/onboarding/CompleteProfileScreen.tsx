import React, { useState, useRef, useEffect } from 'react';
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
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ValidationHelper } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAppData } from '../../hooks/useAppData';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

type CompleteProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CompleteProfile'>;

const { width, height } = Dimensions.get('window');

const CompleteProfileScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState({
    applicantId: false,
    directorsId: false,
    companyRegistration: false,
  });
  
  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<'applicantId' | 'directorsId' | 'companyRegistration' | null>(null);
  
  // Animation values
  const modalSlideAnim = useRef(new Animated.Value(height)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  
  const navigation = useNavigation<CompleteProfileScreenNavigationProp>();
  const { updateProfile } = useAuth();
  const appData = useAppData();
  const user = useSelector((state: RootState) => state.userProfile.user);

  // Initialize form data with existing user data
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      }));
    }
  }, [user]);

  const showModal = (documentType: 'applicantId' | 'directorsId' | 'companyRegistration') => {
    setSelectedDocumentType(documentType);
    setIsModalVisible(true);
    
    // Animate modal in
    Animated.parallel([
      Animated.timing(modalSlideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideModal = () => {
    // Animate modal out
    Animated.parallel([
      Animated.timing(modalSlideAnim, {
        toValue: height,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalVisible(false);
      setSelectedDocumentType(null);
    });
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getDocumentTitle = (documentType: 'applicantId' | 'directorsId' | 'companyRegistration') => {
    switch (documentType) {
      case 'applicantId':
        return 'Applicant ID document';
      case 'directorsId':
        return 'Directors ID documents';
      case 'companyRegistration':
        return 'Company registration documents';
      default:
        return 'Document';
    }
  };

  const validateField = (field: string, value: string) => {
    let validation;
    
    switch (field) {
      case 'firstName':
        validation = ValidationHelper.validateRequired(value, 'Name');
        break;
      case 'lastName':
        validation = ValidationHelper.validateRequired(value, 'Surname');
        break;
      case 'password':
        validation = ValidationHelper.validatePassword(value);
        break;
      case 'confirmPassword':
        if (!value) {
          validation = { isValid: false, message: 'Please confirm your password' };
        } else if (value !== formData.password) {
          validation = { isValid: false, message: 'Passwords do not match' };
        } else {
          validation = { isValid: true };
        }
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      setErrors({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
      });

      const firstNameValid = validateField('firstName', formData.firstName);
      const lastNameValid = validateField('lastName', formData.lastName);
      const passwordValid = validateField('password', formData.password);
      const confirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);

      if (!firstNameValid || !lastNameValid || !passwordValid || !confirmPasswordValid) {
        return;
      }

      // Move to next step immediately after validation passes
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const allDocumentsUploaded = Object.values(uploadedDocuments).every(Boolean);
      
      if (!allDocumentsUploaded) {
        Alert.alert('Documents Required', 'Please upload all required documents before continuing.');
        return;
      }

      setIsLoading(true);
      
      try {
        // Update profile with the form data
        const result = await updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        if (result.success) {
          appData.createUserApplication();
          Alert.alert(
            'Profile Complete!', 
            'Your profile has been successfully completed. You can now access all features.',
            [{ text: 'OK', onPress: () => navigation.navigate('Profile') }]
          );
        } else {
          Alert.alert('Error', result.error || 'Failed to update profile');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to complete profile setup');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDocumentUpload = async (documentType: 'applicantId' | 'directorsId' | 'companyRegistration') => {
    showModal(documentType);
  };

  const uploadFromCamera = async () => {
    if (!selectedDocumentType) return;
    
    try {
      animateButtonPress();
      hideModal();
      
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        await handleDocumentSuccess(selectedDocumentType, result.assets[0].uri, `camera_${selectedDocumentType}_${Date.now()}.jpg`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload from camera. Please try again.');
    }
  };

  const uploadFromGallery = async () => {
    if (!selectedDocumentType) return;
    
    try {
      animateButtonPress();
      hideModal();
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Gallery permission is required to select images');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        await handleDocumentSuccess(selectedDocumentType, result.assets[0].uri, `gallery_${selectedDocumentType}_${Date.now()}.jpg`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload from gallery. Please try again.');
    }
  };

  const uploadFromDocument = async () => {
    if (!selectedDocumentType) return;
    
    try {
      animateButtonPress();
      hideModal();
      
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const fileName = result.assets[0].name || `document_${selectedDocumentType}_${Date.now()}`;
        await handleDocumentSuccess(selectedDocumentType, result.assets[0].uri, fileName);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const handleDocumentSuccess = async (documentType: 'applicantId' | 'directorsId' | 'companyRegistration', uri: string, fileName: string) => {
    try {
      const newDocument = {
        id: Date.now().toString(),
        name: fileName,
        type: documentType === 'applicantId' ? 'applicant-id' : 
              documentType === 'directorsId' ? 'directors-id' : 'company-registration',
        uri: uri,
        uploadedAt: new Date().toISOString(),
      };

      appData.addUserDocument(newDocument);
      
      setUploadedDocuments(prev => ({
        ...prev,
        [documentType]: true,
      }));

      Alert.alert('Success', 'Document uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save document. Please try again.');
    }
  };

  const handleClose = () => {
    Alert.alert(
      'Cancel Profile Completion',
      'Are you sure you want to cancel? Your profile will remain incomplete.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressSegment, currentStep >= 1 ? styles.progressFilled : styles.progressCurrent]} />
        <View style={[styles.progressSegment, currentStep >= 2 ? styles.progressFilled : styles.progressCurrent]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header with Close Button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Content Header */}
          <View style={styles.contentHeader}>
            <Text style={styles.title}>
              {currentStep === 1 ? 'Complete your profile' : 'Upload supporting documents'}
            </Text>
            <Text style={styles.subtitle}>
              {currentStep === 1 
                ? 'Almost there! Please add a few more details to complete your profile.'
                : 'Submit the required documents by uploading files or capturing photos to complete your application and verify your information.'
              }
            </Text>
          </View>

          {currentStep === 1 ? (
            /* Step 1: Basic Profile Information */
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, errors.firstName ? styles.inputError : null]}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  placeholder="Name"
                  placeholderTextColor="#003734"
                />
                {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, errors.lastName ? styles.inputError : null]}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  placeholder="Surname"
                  placeholderTextColor="#003734"
                />
                {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.password ? styles.inputError : null]}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    placeholder="Password"
                    placeholderTextColor="#003734"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon name={showPassword ? "visibility" : "visibility-off"} size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.confirmPassword ? styles.inputError : null]}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    placeholder="Confirm password"
                      placeholderTextColor="#003734"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon name={showConfirmPassword ? "visibility" : "visibility-off"} size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
              </View>
            </View>
          ) : (
            /* Step 2: Document Upload */
            <View style={styles.documentsContainer}>
              {/* Applicant ID Document */}
              <View style={styles.documentCard}>
                <Text style={styles.documentTitle}>Applicant ID document</Text>
                <Text style={styles.documentDescription}>Upload a certified version of your ID document.</Text>
                
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleDocumentUpload('applicantId')}
                  activeOpacity={0.8}
                >
                  <Icon name="add" size={20} color="#4CAF50" />
                  <Text style={styles.uploadButtonText}>Tap here to upload</Text>
                </TouchableOpacity>
                
                <Text style={styles.fileInfo}>Supported: JPG, PDF, PNG. Maximum file size: 10MB</Text>
              </View>

              {/* Directors ID Documents */}
              <View style={styles.documentCard}>
                <Text style={styles.documentTitle}>Directors ID documents</Text>
                <Text style={styles.documentDescription}>Upload all directors ID documents.</Text>
                
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleDocumentUpload('directorsId')}
                  activeOpacity={0.8}
                >
                  <Icon name="add" size={20} color="#4CAF50" />
                  <Text style={styles.uploadButtonText}>Tap here to upload</Text>
                </TouchableOpacity>
                
                <Text style={styles.fileInfo}>Supported: JPG, PDF, PNG. Maximum file size: 10MB</Text>
              </View>

              {/* Company Registration Documents */}
              <View style={styles.documentCard}>
                <Text style={styles.documentTitle}>Company registration documents</Text>
                <Text style={styles.documentDescription}>COR 14.3, COR 15.3 or CM1, CM2 or CM9 from CIPC.</Text>
                
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleDocumentUpload('companyRegistration')}
                  activeOpacity={0.8}
                >
                  <Icon name="add" size={20} color="#4CAF50" />
                  <Text style={styles.uploadButtonText}>Tap here to upload</Text>
                </TouchableOpacity>
                
                <Text style={styles.fileInfo}>Supported: JPG, PDF, PNG. Maximum file size: 10MB</Text>
              </View>
            </View>
          )}

          {/* Continue Button */}
          <TouchableOpacity 
            style={[styles.continueButton, isLoading ? styles.buttonDisabled : null]} 
            onPress={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.buttonContent}>
                <Icon name="hourglass-empty" size={20} color="#fff" />
                <Text style={styles.buttonText}>
                  {currentStep === 1 ? 'Updating...' : 'Completing...'}
                </Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>
                  {currentStep === 1 ? 'Continue' : 'Complete Profile'}
                </Text>
                <Icon name="arrow-forward" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Upload Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideModal}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            { opacity: modalOpacityAnim }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={hideModal}
          />
          
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: modalSlideAnim }]
              }
            ]}
          >
            {/* Modal Handle */}
            <View style={styles.modalHandle} />
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add {selectedDocumentType ? getDocumentTitle(selectedDocumentType).toLowerCase() : 'document'}
              </Text>
              <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Upload Options */}
            <View style={styles.uploadOptions}>
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={uploadFromCamera}
                activeOpacity={0.8}
              >
                <View style={styles.optionIcon}>
                  <Icon name="camera-alt" size={24} color="#36D399" />
                </View>
                <Text style={styles.optionText}>Take a photo</Text>
                <Icon name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={uploadFromGallery}
                activeOpacity={0.8}
              >
                <View style={styles.optionIcon}>
                  <Icon name="photo-library" size={24} color="#36D399" />
                </View>
                <Text style={styles.optionText}>Choose a photo from gallery</Text>
                <Icon name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={uploadFromDocument}
                activeOpacity={0.8}
              >
                <View style={styles.optionIcon}>
                  <Icon name="upload-file" size={24} color="#36D399" />
                </View>
                <Text style={styles.optionText}>Upload a file</Text>
                <Icon name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  progressFilled: {
    backgroundColor: '#4CAF50',
  },
  progressCurrent: {
    backgroundColor: '#e0e0e0',
  },
  contentHeader: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003734',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  continueButton: {
    backgroundColor: '#003734',
    borderRadius: 28,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    height: 56,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  // Document upload styles
  documentsContainer: {
    marginBottom: 40,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003734',
    marginBottom: 8,
  },
  documentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
  fileInfo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003734',
  },
  uploadOptions: {
    gap: 15,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default CompleteProfileScreen; 