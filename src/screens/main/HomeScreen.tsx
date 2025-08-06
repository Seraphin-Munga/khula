import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const user = useSelector((state: RootState) => state.userProfile.user);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation animation for farming icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for stats
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const farmStats = [
    { title: 'Total Farms', value: '12', icon: 'agriculture', color: '#4CAF50', gradient: ['#4CAF50', '#45a049'] },
    { title: 'Active Crops', value: '8', icon: 'eco', color: '#FF9800', gradient: ['#FF9800', '#f57c00'] },
    { title: 'Harvest Ready', value: '3', icon: 'local-florist', color: '#2196F3', gradient: ['#2196F3', '#1976d2'] },
    { title: 'Revenue', value: 'R45,200', icon: 'attach-money', color: '#9C27B0', gradient: ['#9C27B0', '#7b1fa2'] },
  ];

  const quickActions = [
    { title: 'Add Farm', icon: 'add-location', color: '#4CAF50', gradient: ['#4CAF50', '#45a049'] },
    { title: 'View Crops', icon: 'local-florist', color: '#FF9800', gradient: ['#FF9800', '#f57c00'] },
    { title: 'Analytics', icon: 'analytics', color: '#2196F3', gradient: ['#2196F3', '#1976d2'] },
    { title: 'Reports', icon: 'assessment', color: '#9C27B0', gradient: ['#9C27B0', '#7b1fa2'] },
  ];

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003734" />
      
      {/* Animated Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Animated.View 
          style={[
            styles.floatingIcon,
            {
              transform: [{ rotate: rotateInterpolate }],
              opacity: 0.1,
            }
          ]}
        >
          <Icon name="agriculture" size={100} color="#fff" />
        </Animated.View>
        <Animated.View 
          style={[
            styles.floatingIcon2,
            {
              transform: [{ rotate: rotateInterpolate }],
              opacity: 0.05,
            }
          ]}
        >
          <Icon name="local-florist" size={80} color="#fff" />
        </Animated.View>
      </View>

      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back! 🌾</Text>
            <Text style={styles.userName}>{user?.firstName || 'Farmer'}</Text>
            <Text style={styles.subtitle}>Ready to grow something amazing today?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Icon name="account-circle" size={40} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Farm Stats */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>🌱 Farm Overview</Text>
          <View style={styles.statsGrid}>
            {farmStats.map((stat, index) => (
              <Animated.View 
                key={index} 
                style={[
                  styles.statCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: scaleAnim }
                    ],
                  }
                ]}
              >
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Icon name={stat.icon} size={24} color="#fff" />
                  </Animated.View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.actionCard}
                activeOpacity={0.8}
              >
                <Animated.View 
                  style={[
                    styles.actionIcon, 
                    { 
                      backgroundColor: action.color,
                      transform: [{ scale: pulseAnim }]
                    }
                  ]}
                >
                  <Icon name={action.icon} size={28} color="#fff" />
                </Animated.View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>📊 Recent Activity</Text>
          <View style={styles.activityList}>
            <Animated.View 
              style={[
                styles.activityItem,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                }
              ]}
            >
              <View style={styles.activityIcon}>
                <Icon name="local-florist" size={20} color="#4CAF50" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Wheat harvest completed</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </Animated.View>
            <Animated.View 
              style={[
                styles.activityItem,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                }
              ]}
            >
              <View style={styles.activityIcon}>
                <Icon name="water-drop" size={20} color="#2196F3" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Irrigation system activated</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </Animated.View>
            <Animated.View 
              style={[
                styles.activityItem,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                }
              ]}
            >
              <View style={styles.activityIcon}>
                <Icon name="agriculture" size={20} color="#FF9800" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New corn field planted</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Weather Widget */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.weatherCard}>
            <View style={styles.weatherHeader}>
              <Icon name="wb-sunny" size={30} color="#FF9800" />
              <Text style={styles.weatherTitle}>Today's Weather</Text>
            </View>
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>24°C</Text>
              <Text style={styles.weatherDesc}>Perfect for farming! ☀️</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  floatingIcon: {
    position: 'absolute',
    top: 100,
    right: -20,
  },
  floatingIcon2: {
    position: 'absolute',
    top: 300,
    left: -30,
  },
  header: {
    backgroundColor: '#003734',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003734',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: (width - 60) / 2,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003734',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: (width - 60) / 2,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  actionIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003734',
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003734',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003734',
    marginLeft: 10,
  },
  weatherInfo: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 5,
  },
  weatherDesc: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen; 