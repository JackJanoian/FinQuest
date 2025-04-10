import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { House, CircleDollarSign, CircleUserRound, Swords, Tag } from 'lucide-react-native';
import { View, Text } from 'react-native';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Onboarding Screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import FeatureTourScreen from '../screens/onboarding/FeatureTourScreen';
import FinancialInfoScreen from '../screens/onboarding/FinancialInfoScreen';
import FirstActionScreen from '../screens/onboarding/FirstActionScreen';

// Main App Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import DebtTrackerScreen from '../screens/debt/DebtTrackerScreen';
import SavingsGoalScreen from '../screens/savings/SavingsGoalScreen';
import MoneyScreen from '../screens/money/MoneyScreen';
import AddTransactionScreen from '../screens/money/AddTransactionScreen';
import ChallengesScreen from '../screens/challenges/ChallengesScreen';
import QuestDetailScreen from '../screens/challenges/QuestDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import OffersScreen from '../screens/offers/OffersScreen';

// Legal Screens
import PrivacyPolicyScreen from '../screens/legal/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/legal/TermsOfServiceScreen';

// Components
import LoadingScreen from '../components/LoadingScreen';

// Context
import { useAuth } from '../context/AuthContext';

// Debug logger
const debugLog = (message, data) => {
  console.log(`[AppNavigator Debug] ${message}`, data || '');
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication Navigator
const AuthNavigator = () => {
  debugLog('Rendering AuthNavigator');
  
  // Wrap component creation in try/catch to catch any errors
  try {
    return (
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#f9f9f9' }
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  } catch (error) {
    debugLog('Error in AuthNavigator:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <Text style={{ color: 'red', fontSize: 16 }}>Navigation Error: {error.message}</Text>
      </View>
    );
  }
};

// Onboarding Navigator
const OnboardingNavigator = () => {
  debugLog('Rendering OnboardingNavigator');
  
  try {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f9f9f9' }
        }}
        initialRouteName="FinancialInfo"
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="FinancialInfo" component={FinancialInfoScreen} />
        <Stack.Screen name="FeatureTour" component={FeatureTourScreen} />
        <Stack.Screen name="FirstAction" component={FirstActionScreen} />
      </Stack.Navigator>
    );
  } catch (error) {
    debugLog('Error in OnboardingNavigator:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <Text style={{ color: 'red', fontSize: 16 }}>Navigation Error: {error.message}</Text>
      </View>
    );
  }
};

// Main App Tab Navigator
const MainTabNavigator = () => {
  debugLog('Rendering MainTabNavigator');
  
  // Wrap component creation in try/catch to catch any errors
  try {
    // Create stack navigators for tabs that need nested screens
    const ProfileStack = createStackNavigator();
    const DashboardStack = createStackNavigator();
    
    const ProfileStackScreen = () => (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
        <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <ProfileStack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      </ProfileStack.Navigator>
    );
    
    const DashboardStackScreen = () => (
      <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
        <DashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
        <DashboardStack.Screen name="AddTransaction" component={AddTransactionScreen} />
        <DashboardStack.Screen name="QuestDetail" component={QuestDetailScreen} />
      </DashboardStack.Navigator>
    );
    
    // Custom tab bar icon function
    const tabBarIcon = ({ route, focused, color, size }) => {
      if (route.name === 'Dashboard') {
        return <House size={size} color={color} />;
      } else if (route.name === 'Money') {
        return <CircleDollarSign size={size} color={color} />;
      } else if (route.name === 'Offers') {
        return <Tag size={size} color={color} />;
      } else if (route.name === 'Challenges') {
        return <Swords size={size} color={color} />;
      } else if (route.name === 'Profile') {
        return <CircleUserRound size={size} color={color} />;
      }
      return null;
    };
    
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => tabBarIcon({ route, focused, color, size }),
          tabBarActiveTintColor: '#1976D2',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 10,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardStackScreen}
          options={{ title: 'Home' }}
        />
        <Tab.Screen name="Money" component={MoneyScreen} />
        <Tab.Screen name="Offers" component={OffersScreen} />
        <Tab.Screen name="Challenges" component={ChallengesScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    );
  } catch (error) {
    debugLog('Error in MainTabNavigator:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <Text style={{ color: 'red', fontSize: 16 }}>Navigation Error: {error.message}</Text>
      </View>
    );
  }
};

// Fallback component for debugging
const DebugScreen = ({ message }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 20 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Debug Information</Text>
    <Text style={{ textAlign: 'center' }}>{message}</Text>
  </View>
);

// Main App Navigator
const AppNavigator = () => {
  debugLog('AppNavigator initializing');
  
  const { user, loading, networkError, hasCompletedOnboarding } = useAuth();
  const [navigationReady, setNavigationReady] = useState(false);
  const [navigationError, setNavigationError] = useState(null);
  
  // Create a reference to the navigation container
  const navigationRef = React.useRef(null);
  
  debugLog('AppNavigator state:', { 
    user: user ? 'authenticated' : 'unauthenticated', 
    loading, 
    networkError, 
    navigationReady,
    hasCompletedOnboarding
  });
  
  useEffect(() => {
    // Add a timeout to detect if navigation is taking too long
    const timeout = setTimeout(() => {
      if (!navigationReady) {
        debugLog('Navigation initialization timeout');
        setNavigationError('Navigation initialization timed out. This might be due to a slow connection or a problem with the navigation setup.');
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [navigationReady]);
  
  // Log navigation state changes
  const onNavigationStateChange = (state) => {
    const routes = state?.routes || [];
    const currentRouteName = state?.routes[state?.index]?.name || 'Unknown';
    debugLog('Navigation state changed', {
      routes: routes.map(r => r.name),
      currentRoute: currentRouteName
    });
  };
  
  // Wrap the entire component in a try/catch to catch any errors
  try {
    if (loading) {
      debugLog('Showing loading screen');
      return <LoadingScreen message="Loading your financial quest..." />;
    }
    
    if (navigationError) {
      debugLog('Showing navigation error screen:', navigationError);
      return <DebugScreen message={navigationError} />;
    }
    
    if (networkError) {
      debugLog('Showing network error screen');
      return <DebugScreen message="Network connection error. Please check your internet connection and try again." />;
    }
    
    debugLog('Rendering NavigationContainer, user authenticated:', !!user);
    debugLog('Has completed onboarding:', hasCompletedOnboarding);
    
    // Determine which navigator to show
    let initialNavigator;
    if (!user) {
      initialNavigator = 'Auth';
      debugLog('Initial navigator: Auth (user not authenticated)');
    } else if (!hasCompletedOnboarding) {
      initialNavigator = 'Onboarding';
      debugLog('Initial navigator: Onboarding (user authenticated but not completed onboarding)');
    } else {
      initialNavigator = 'Main';
      debugLog('Initial navigator: Main (user authenticated and completed onboarding)');
    }
    
    return (
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          debugLog('Navigation container is ready');
          setNavigationReady(true);
          
          // Log initial navigation state
          const state = navigationRef.current?.getRootState();
          debugLog('Initial navigation state', {
            routes: state?.routes?.map(r => r.name) || [],
            currentRoute: state?.routes?.[state?.index]?.name || 'Unknown'
          });
        }}
        onStateChange={onNavigationStateChange}
        fallback={<LoadingScreen message="Preparing navigation..." />}
      >
        <Stack.Navigator 
          screenOptions={{ headerShown: false }}
          initialRouteName={initialNavigator}
        >
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } catch (error) {
    debugLog('Critical error in AppNavigator:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', marginBottom: 10 }}>Critical Error</Text>
        <Text style={{ textAlign: 'center' }}>
          {error.message || 'An unknown error occurred in the navigation system.'}
        </Text>
      </View>
    );
  }
};

export default AppNavigator;
