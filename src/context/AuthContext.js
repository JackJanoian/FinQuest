import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert, Text, View } from 'react-native';
import supabase from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a debug logger function
const debugLog = (message, data) => {
  console.log(`[AuthContext Debug] ${message}`, data || '');
};

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  debugLog('AuthProvider initializing');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [initError, setInitError] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Helper function to handle network errors
  const handleNetworkError = (error) => {
    debugLog('Network error:', error);
    console.error('Network error:', error);
    setNetworkError(true);
    setLoading(false);
    
    // Show user-friendly error message
    Alert.alert(
      'Connection Error',
      'Unable to connect to the server. Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  };

  useEffect(() => {
    // Check for active session on mount
    const checkUser = async () => {
      try {
        debugLog('Checking user session...');
        console.log('==================== AUTH DEBUGGING ====================');
        console.log('Checking user session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Check if user has completed onboarding
        const onboardingCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
        console.log('Raw onboardingCompleted value from AsyncStorage:', onboardingCompleted);
        console.log('Type of onboardingCompleted:', typeof onboardingCompleted);
        setHasCompletedOnboarding(onboardingCompleted === 'true');
        console.log('hasCompletedOnboarding state set to:', onboardingCompleted === 'true');
        debugLog('Onboarding completed:', onboardingCompleted === 'true');
        
        if (error) {
          debugLog('Session error:', error);
          console.error('Session error:', error);
          if (error.message.includes('Network request failed')) {
            handleNetworkError(error);
            return;
          }
          setInitError(error.message);
          throw error;
        }
        
        if (session?.user) {
          debugLog('User session found:', session.user.email);
          console.log('User session found:', session.user.email);
          setUser(session.user);
          console.log('User state set to:', session.user.id);
        } else {
          debugLog('No active user session found');
          console.log('No active user session found');
          console.log('User state set to null');
        }
        console.log('==================== END AUTH DEBUGGING ====================');
      } catch (error) {
        debugLog('Error checking auth status:', error.message);
        console.error('Error checking auth status:', error.message);
        setInitError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        debugLog('Auth state changed:', event);
        console.log('Auth state changed:', event);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      debugLog('Cleaning up auth listener');
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      debugLog('Attempting to sign in user:', email);
      console.log('Attempting to sign in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        debugLog('Sign in error:', error);
        if (error.message.includes('Network request failed')) {
          handleNetworkError(error);
          return { success: false, error: 'Network connection error' };
        }
        throw error;
      }

      debugLog('Sign in successful');
      console.log('Sign in successful');
      return { success: true, data };
    } catch (error) {
      debugLog('Sign in error:', error.message);
      console.error('Sign in error:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      debugLog('Attempting to sign up user:', email);
      console.log('Attempting to sign up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        debugLog('Sign up error:', error);
        if (error.message.includes('Network request failed')) {
          handleNetworkError(error);
          return { success: false, error: 'Network connection error' };
        }
        throw error;
      }

      debugLog('Sign up successful, confirmation email sent');
      console.log('Sign up successful, confirmation email sent');
      Alert.alert(
        'Registration Successful',
        'Please check your email for a confirmation link to complete your registration.',
        [{ text: 'OK' }]
      );
      
      return { success: true, data };
    } catch (error) {
      debugLog('Sign up error:', error.message);
      console.error('Sign up error:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      debugLog('Attempting to sign out user');
      console.log('Attempting to sign out user');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        debugLog('Sign out error:', error);
        if (error.message.includes('Network request failed')) {
          handleNetworkError(error);
          return { success: false, error: 'Network connection error' };
        }
        throw error;
      }

      debugLog('Sign out successful');
      console.log('Sign out successful');
      return { success: true };
    } catch (error) {
      debugLog('Sign out error:', error.message);
      console.error('Sign out error:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // If there's an initialization error, render a fallback UI
  if (initError) {
    debugLog('Rendering error fallback due to init error:', initError);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', marginBottom: 10 }}>Authentication Error</Text>
        <Text style={{ fontSize: 14, color: '#424242', textAlign: 'center', paddingHorizontal: 20 }}>
          {initError}
        </Text>
      </View>
    );
  }

  const contextValue = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    networkError,
    hasCompletedOnboarding,
  };
  
  debugLog('Providing auth context with values:', { 
    user: !!user, 
    loading, 
    isAuthenticated: !!user, 
    networkError 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
