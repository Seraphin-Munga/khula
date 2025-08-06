import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  Dimensions,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { addDocument } from '../../store/slices/documentsSlice';
import { RootState } from '../../store/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppData } from '../../hooks/useAppData';

const { width, height } = Dimensions.get('window');

interface DocumentSection {
  id: string;
  title: string;
  description: string;
  type: 'applicant-id' | 'directors-id' | 'company-registration';
}

const documentSections: DocumentSection[] = [
  {
    id: '1',
    title: 'Applicant ID document',
    description: 'Upload a certified version of your ID document.',
    type: 'applicant-id',
  },
  {
    id: '2',
    title: 'Directors ID documents',
    description: 'Upload all directors ID documents.',
    type: 'directors-id',
  },
  {
    id: '3',
    title: 'Company registration documents',
    description: 'COR 14.3, COR 15.3 or CM1, CM2 or CM9 from CIPC.',
    type: 'company-registration',
  },
];

const DocumentsScreen = () => {
  const dispatch = useDispatch();
  const documents = useSelector((state: RootState) => state.documents);
  const appData = useAppData();
  
  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentSection | null>(null);
  
  // Animation values
  const modalSlideAnim = useRef(new Animated.Value(height)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const showModal = (documentType: DocumentSection) => {
    setSelectedDocument(documentType);
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
      setSelectedDocument(null);
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

  const handleUpload = async (documentType: DocumentSection) => {
    showModal(documentType);
  };

  const uploadFromCamera = async () => {
    if (!selectedDocument) return;
    
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
        const uri = result.assets[0].uri;
        const fileName = `camera_${selectedDocument.type}_${Date.now()}.jpg`;
        
        const newDocument = {
          id: Date.now().toString(),
          name: fileName,
          type: selectedDocument.type,
          uri: uri,
          uploadedAt: new Date().toISOString(),
        };

        // Add to app data service
        appData.addUserDocument(newDocument);
        
        // Also dispatch to Redux for UI updates
        dispatch(addDocument(newDocument));
        
        Alert.alert('Success', `${selectedDocument.title} uploaded successfully!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload from camera. Please try again.');
    }
  };

  const uploadFromGallery = async () => {
    if (!selectedDocument) return;
    
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
        const uri = result.assets[0].uri;
        const fileName = `gallery_${selectedDocument.type}_${Date.now()}.jpg`;
        
        const newDocument = {
          id: Date.now().toString(),
          name: fileName,
          type: selectedDocument.type,
          uri: uri,
          uploadedAt: new Date().toISOString(),
        };

        // Add to app data service
        appData.addUserDocument(newDocument);
        
        // Also dispatch to Redux for UI updates
        dispatch(addDocument(newDocument));
        
        Alert.alert('Success', `${selectedDocument.title} uploaded successfully!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload from gallery. Please try again.');
    }
  };

  const uploadFromDocument = async () => {
    if (!selectedDocument) return;
    
    try {
      animateButtonPress();
      hideModal();
      
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const fileName = result.assets[0].name || `document_${selectedDocument.type}_${Date.now()}`;
        
        const newDocument = {
          id: Date.now().toString(),
          name: fileName,
          type: selectedDocument.type,
          uri: uri,
          uploadedAt: new Date().toISOString(),
        };

        // Add to app data service
        appData.addUserDocument(newDocument);
        
        // Also dispatch to Redux for UI updates
        dispatch(addDocument(newDocument));
        
        Alert.alert('Success', `${selectedDocument.title} uploaded successfully!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const getDocumentStatus = (type: string) => {
    const doc = appData.getDocumentByType(type);
    return doc ? 'Uploaded' : 'Not Uploaded';
  };

  const getDocumentStatusColor = (type: string) => {
    const doc = appData.getDocumentByType(type);
    return doc ? '#4CAF50' : '#FF9800';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Upload supporting documents</Text>
          <Text style={styles.subtitle}>
            Submit the required documents by uploading files or capturing photos to complete your application and verify your information.
          </Text>
        </View>

        {/* Document Upload Sections */}
        <View style={styles.documentsContainer}>
          {documentSections.map((section) => (
            <View key={section.id} style={styles.documentCard}>
              <Text style={styles.documentTitle}>{section.title}</Text>
              <Text style={styles.documentDescription}>{section.description}</Text>
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleUpload(section)}
                activeOpacity={0.8}
              >
                <Icon name="add" size={20} color="#4CAF50" />
                <Text style={styles.uploadButtonText}>Tap here to upload</Text>
              </TouchableOpacity>
              
              <Text style={styles.fileInfo}>
                Supported: JPG, PDF, PNG. Maximum file size: 10MB
              </Text>
              
              <View style={styles.statusContainer}>
                <Text style={[
                  styles.statusText,
                  { color: getDocumentStatusColor(section.type) }
                ]}>
                  {getDocumentStatus(section.type)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

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
                Add {selectedDocument?.title.toLowerCase()}
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
                  <Icon name="camera-alt" size={24} color="#4CAF50" />
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
                  <Icon name="photo-library" size={24} color="#4CAF50" />
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
                  <Icon name="upload-file" size={24} color="#4CAF50" />
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
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    lineHeight: 22,
  },
  documentsContainer: {
    marginBottom: 30,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
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
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  closeButton: {
    padding: 5,
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

export default DocumentsScreen; 