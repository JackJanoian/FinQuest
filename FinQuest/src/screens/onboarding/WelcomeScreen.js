import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const routes = useNavigationState(state => state?.routes || []);
  const currentRouteName = useNavigationState(state => state?.routes[state.index]?.name || 'Unknown');
  
  console.log('[WelcomeScreen] Current navigation state:', {
    routes: routes.map(r => r.name),
    currentRoute: currentRouteName,
    navigatorType: navigation.getParent()?.getId?.() || 'No parent',
    canGoBack: navigation.canGoBack(),
  });

  const handleGetStarted = () => {
    console.log('[WelcomeScreen] Attempting to navigate to Register screen');
    
    try {
      // Try to navigate to the root navigator first
      const rootNavigation = navigation.getParent() || navigation;
      
      // Log navigation state and structure
      console.log('[WelcomeScreen] Current navigation state:', navigation.getState?.());
      console.log('[WelcomeScreen] Parent navigation state:', navigation.getParent()?.getState?.());
      console.log('[WelcomeScreen] Navigation type:', navigation.constructor.name);
      
      // Try direct navigation to Auth/Register
      console.log('[WelcomeScreen] Attempting to navigate to Auth/Register directly');
      rootNavigation.navigate('Auth', { screen: 'Register' });
      console.log('[WelcomeScreen] Navigation attempt completed');
    } catch (error) {
      console.error('[WelcomeScreen] Navigation error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />
      <LinearGradient
        colors={['#1E88E5', '#0D47A1']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Welcome to FinQuest</Text>
            <Text style={styles.subtitle}>Your journey to financial freedom begins here</Text>
            
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => {
                console.log('[WelcomeScreen] Attempting to navigate to Login screen');
                try {
                  const rootNavigation = navigation.getParent() || navigation;
                  
                  // Log navigation state
                  console.log('[WelcomeScreen] Current navigation state for login:', navigation.getState?.());
                  
                  // Try direct navigation to Auth/Login
                  rootNavigation.navigate('Auth', { screen: 'Login' });
                  console.log('[WelcomeScreen] Login navigation attempt completed');
                } catch (error) {
                  console.error('[WelcomeScreen] Login navigation error:', error);
                }
              }}
            >
              <Text style={styles.loginText}>Already have an account? <Text style={styles.loginTextBold}>Log in</Text></Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.illustrationContainer}>
            <Image 
              source={require('../../../assets/images/Logo.png')} 
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E88E5',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#1E88E5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 10,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginTextBold: {
    fontWeight: 'bold',
  },
  illustrationContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  illustration: {
    width: '90%',
    height: 200,
  },
});

export default WelcomeScreen;
