import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import { 
  LandingScreen, 
  CompleteProfileScreen 
} from '../screens/onboarding';
import { 
  LoginScreen, 
  SignUpScreen 
} from '../screens/auth';
import { 
  HomeScreen 
} from '../screens/main';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
  CompleteProfile: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const isLoggedIn = useSelector((state: RootState) => state.userProfile.isLoggedIn);
  const hasProfile = useSelector((state: RootState) => {
    const user = state.userProfile.user;
    return user && user.firstName?.trim() && user.lastName?.trim();
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen 
              name="Landing" 
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}  
              // options={{ title: 'Welcome' }}
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen}
              options={{ headerShown: false }}
              // options={{ title: 'Create Account' }}
            />
          </>
        ) : !hasProfile ? (
          <Stack.Screen 
            name="CompleteProfile" 
            component={CompleteProfileScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 