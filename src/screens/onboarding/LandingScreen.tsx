import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

const { width, height } = Dimensions.get('window');

const LandingScreen = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();

  const handleSignUp = () => {
    // Navigate to sign up flow
    navigation.navigate('SignUp');
  };

  const handleLogIn = () => {
    // Navigate to login flow
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      
      {/* Header with time and status icons */}
    

      {/* Main content */}
      <View style={styles.content}>
        {/* Image collage */}
        <View style={styles.imageCollage}>
          {/* Khula logo with leaf */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>k</Text>
              <View style={styles.leafElement} />
            </View>
          </View>

          {/* Top right image - men in field */}
          <View style={styles.imageContainer1}>
            <Image
              source={require('../../../assets/imgs/CEBI-5250 1.png')}
              style={styles.circularImage}
              resizeMode="cover"
            />
          </View>

          {/* Middle left image - woman with braids */}
          <View style={styles.imageContainer2}>
            <Image
              source={require('../../../assets/imgs/CEBI-5231 1.png')}
              style={styles.circularImage}
              resizeMode="cover"
            />
          </View>

          {/* Bottom right image - man and girl */}
          <View style={styles.imageContainer3}>
            <Image
              source={require('../../../assets/imgs/CEBI-5043 1.png')}
              style={styles.circularImage}
              resizeMode="cover"
            />
          </View>

          {/* Green accent circles */}
          <View style={[styles.accentCircle, styles.accentCircle1]} />
          <View style={[styles.accentCircle, styles.accentCircle2]} />
        </View>

        {/* Title and description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Khula Trader</Text>
          <Text style={styles.description}>
            Sell your products and chat with your buyers
          </Text>
        </View>
      </View>

      {/* Bottom section with buttons */}
      <View style={styles.bottomSection}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logInButton} onPress={handleLogIn}>
            <Text style={styles.logInButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.teamInviteContainer}>
          <Text style={styles.teamInviteText}>Accept team invite code</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012622', // Dark green background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  statusIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageCollage: {
    width: width * 0.95,
    height: height * 0.45,
    position: 'relative',
    marginBottom: 40,
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    left: '50%',
    transform: [{ translateX: -35 }],
    zIndex: 10,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  leafElement: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    transform: [{ rotate: '45deg' }],
  },
  imageContainer1: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 5,
  },
  imageContainer2: {
    position: 'absolute',
    top: 120,
    left: 0,
    zIndex: 5,
  },
  imageContainer3: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    zIndex: 5,
  },
  circularImage: {
    width: 200,
    height: 200,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  accentCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50', // Bright green
  },
  accentCircle1: {
    top: 140,
    right: 80,
  },
  accentCircle2: {
    top: 180,
    left: 100,
  },
  textContainer: {
    alignItems: 'flex-start',
    marginBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50', // Bright green
    marginBottom: 16,
  },
  description: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    lineHeight: 32,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  signUpButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logInButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamInviteContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  teamInviteText: {
    color: '#81C784', // Light green
    fontSize: 16,
  },
  bottomIndicator: {
    width: 40,
    height: 3,
    backgroundColor: '#D32F2F', // Dark red
    alignSelf: 'center',
    borderRadius: 1.5,
  },
});

export default LandingScreen; 