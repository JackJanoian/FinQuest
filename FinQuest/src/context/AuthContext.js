import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../config/supabase';

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
  const [userData, setUserData] = useState(null);

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

  // Function to create a profile in Supabase
  const createProfile = async (userId, profileData = {}) => {
    try {
      console.log('[AuthContext] Creating profile for user:', userId);
      
      // Store profile data in AsyncStorage first as a backup
      try {
        const existingData = await AsyncStorage.getItem('userData') || '{}';
        const parsedData = JSON.parse(existingData);
        
        await AsyncStorage.setItem('userData', JSON.stringify({
          ...parsedData,
          profileInfo: {
            ...parsedData.profileInfo,
            ...profileData
          }
        }));
        console.log('[AuthContext] Profile data stored in AsyncStorage as backup');
      } catch (storageError) {
        console.error('[AuthContext] Error storing profile in AsyncStorage:', storageError);
      }
      
      // Get the current session to ensure we have authentication
      let { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        console.log('[AuthContext] No active session found for profile creation');
        console.log('[AuthContext] Using local data instead due to missing session');
        
        // Instead of returning early, wait a bit and retry once
        console.log('[AuthContext] Waiting 2 seconds to retry with active session...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try again to get the session
        const { data: retrySessionData } = await supabase.auth.getSession();
        
        if (!retrySessionData?.session) {
          console.log('[AuthContext] Still no active session after retry, using local data');
          return { success: true, usingLocalData: true };
        } else {
          console.log('[AuthContext] Session found after retry, proceeding with profile creation');
          sessionData = retrySessionData; // Update the session data with the retry result
        }
      }
      
      // Create a minimal profile with just the user ID if no profile data provided
      const minimalProfile = {
        id: userId,
        created_at: new Date().toISOString(),
        ...profileData
      };
      
      // Use RPC function to bypass RLS
      // This is a safer approach than trying to insert directly
      const { data, error } = await supabase.rpc('create_profile', {
        profile_id: userId,
        profile_data: minimalProfile
      });
      
      if (error) {
        console.error('[AuthContext] Error creating profile via RPC:', error);
        
        // Fallback: Try direct insert with auth
        console.log('[AuthContext] Attempting fallback profile creation via upsert...');
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(minimalProfile, { 
            onConflict: 'id',
            returning: 'minimal'
          });
        
        if (upsertError) {
          console.error('[AuthContext] Fallback profile creation failed:', upsertError);
          
          // Even if Supabase operations fail, we've stored the data in AsyncStorage
          // so the app can still function with local data
          console.log('[AuthContext] Using AsyncStorage data instead due to Supabase errors');
          return { success: true, usingLocalData: true };
        }
        
        console.log('[AuthContext] Fallback profile creation succeeded via upsert');
        return { success: true };
      }
      
      console.log('[AuthContext] Profile created successfully');
      return { success: true, data };
    } catch (error) {
      console.error('[AuthContext] Error in createProfile:', error);
      return { success: false, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      debugLog('Attempting to sign in user:', email);
      console.log('[AuthContext] Attempting to sign in user:', email);
      
      // Check onboarding status before login
      const onboardingStatusBefore = await AsyncStorage.getItem('hasCompletedOnboarding');
      console.log('[AuthContext] Onboarding status before login:', onboardingStatusBefore);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[AuthContext] Sign in response:', { data: !!data, error: error?.message });

      if (error) {
        debugLog('Sign in error:', error);
        if (error.message.includes('Network request failed')) {
          handleNetworkError(error);
          return { success: false, error: 'Network connection error' };
        }
        throw error;
      }

      // Check onboarding status after login
      const onboardingStatusAfter = await AsyncStorage.getItem('hasCompletedOnboarding');
      console.log('[AuthContext] Onboarding status after login:', onboardingStatusAfter);
      console.log('[AuthContext] hasCompletedOnboarding state:', hasCompletedOnboarding);
      
      // Force set onboarding as completed for returning users
      if (!onboardingStatusAfter || onboardingStatusAfter !== 'true') {
        console.log('[AuthContext] Setting onboarding as completed for returning user');
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true);
      }
      
      debugLog('Sign in successful');
      console.log('[AuthContext] Sign in successful');
      return { success: true, data };
    } catch (error) {
      debugLog('Sign in error:', error.message);
      console.error('Sign in error:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      debugLog('Attempting to sign up user:', email);
      console.log('[AuthContext] Attempting to sign up user:', email);
      console.log('[AuthContext] User data provided:', userData);
      
      // Check onboarding status before signup
      const onboardingStatusBefore = await AsyncStorage.getItem('hasCompletedOnboarding');
      console.log('[AuthContext] Onboarding status before signup:', onboardingStatusBefore);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log('[AuthContext] Sign up response:', { 
        success: !!data?.user, 
        error: error?.message,
        user: data?.user ? `ID: ${data.user.id}` : 'No user data'
      });

      if (error) {
        debugLog('Sign up error:', error);
        if (error.message.includes('Network request failed')) {
          handleNetworkError(error);
          return { success: false, error: 'Network connection error' };
        }
        return { success: false, error: error.message };
      }
      
      // Important: Check if user was actually created
      if (!data?.user) {
        console.log('[AuthContext] Sign up successful but no user data returned');
        return { success: false, error: 'Registration successful, but user data is missing' };
      }
      
      console.log('[AuthContext] User successfully created with ID:', data.user.id);
      
      // Initialize user data with clean slate for quests, badges, and financial data
      const initialUserData = {
        ...userData,
        profileInfo: {
          username: userData?.name || email.split('@')[0],
          avatar_url: null,
          bio: userData?.bio || '',
          created_at: new Date().toISOString()
        },
        // Initialize with empty financial data
        debts: [],
        savings: [],
        transactions: [],
        // Initialize with empty quests and badges
        challenges: [],
        badges: [],
        // Initialize XP and level
        xp: 0,
        level: 1,
        // Initialize daily tasks as not completed
        dailyTasksCompleted: {
          debtPayment: false,
          savingsDeposit: false,
          lastResetDate: new Date().toISOString()
        }
      };
      
      // Create a profile for the new user
      await createProfile(data.user.id, initialUserData.profileInfo);
      
      // Store user data in AsyncStorage
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(initialUserData));
        console.log('[AuthContext] Initial user data stored successfully:', initialUserData);
        
        // Initialize challenges and badges with empty arrays
        await AsyncStorage.setItem('challenges', JSON.stringify([]));
        await AsyncStorage.setItem('badges', JSON.stringify([]));
        console.log('[AuthContext] Initialized challenges and badges with empty arrays');
        
        // Verify the data was stored
        const storedData = await AsyncStorage.getItem('userData');
        console.log('[AuthContext] Verified stored user data:', storedData);
      } catch (storageError) {
        console.log('[AuthContext] Error storing user data:', storageError);
      }
      
      // Ensure hasCompletedOnboarding is set to false for new users
      await AsyncStorage.setItem('hasCompletedOnboarding', 'false');
      console.log('[AuthContext] Set hasCompletedOnboarding to false for new user');
      setHasCompletedOnboarding(false);
      
      // Update the user state to trigger a re-render in the app
      setUser(data.user);
      console.log('[AuthContext] Updated user state with new user');
      
      // Check if onboarding status was changed during signup
      const onboardingStatusAfter = await AsyncStorage.getItem('hasCompletedOnboarding');
      console.log('[AuthContext] Onboarding status after signup:', onboardingStatusAfter);
      console.log('[AuthContext] Current auth state:', { 
        user: !!data.user, 
        hasCompletedOnboarding: false
      });
      
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
      console.log('[AuthContext] Attempting to sign out user');
      
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
      console.log('[AuthContext] Sign out successful');
      return { success: true };
    } catch (error) {
      debugLog('Sign out error:', error.message);
      console.error('Sign out error:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Mark onboarding as completed
  const completeOnboarding = async () => {
    try {
      console.log('[AuthContext] Attempting to mark onboarding as completed');
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
      debugLog('Onboarding marked as completed');
      console.log('[AuthContext] Onboarding marked as completed successfully');
      return { success: true };
    } catch (error) {
      debugLog('Error marking onboarding as completed:', error.message);
      console.log('[AuthContext] Error marking onboarding as completed:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Reset onboarding status (for testing purposes)
  const resetOnboarding = async () => {
    try {
      console.log('[AuthContext] Attempting to reset onboarding status');
      console.log('[AuthContext] Current hasCompletedOnboarding value before reset:', hasCompletedOnboarding);
      
      // Check the current value in AsyncStorage before removing
      const currentValue = await AsyncStorage.getItem('hasCompletedOnboarding');
      console.log('[AuthContext] Current AsyncStorage value before reset:', currentValue);
      
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      
      // Verify the value was removed
      const afterRemoval = await AsyncStorage.getItem('hasCompletedOnboarding');
      console.log('[AuthContext] AsyncStorage value after reset:', afterRemoval);
      
      setHasCompletedOnboarding(false);
      console.log('[AuthContext] hasCompletedOnboarding state set to false');
      debugLog('Onboarding status reset');
      console.log('[AuthContext] Onboarding status reset successfully');
      return { success: true };
    } catch (error) {
      debugLog('Error resetting onboarding status:', error.message);
      console.log('[AuthContext] Error resetting onboarding status:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Update user data (profile, financial info, etc.)
  const updateUserData = async (newData = {}) => {
    try {
      console.log('[AuthContext] Updating user data:', newData);
      
      // Check if user is available
      if (!user) {
        console.log('[AuthContext] No user logged in, storing data temporarily');
        
        // Even without a user, store the data in AsyncStorage
        // This handles cases where the auth state hasn't fully initialized
        const currentData = await AsyncStorage.getItem('tempUserData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        const updatedData = {
          ...parsedData,
          ...newData
        };
        
        await AsyncStorage.setItem('tempUserData', JSON.stringify(updatedData));
        console.log('[AuthContext] Temporary user data stored in AsyncStorage');
        
        // Update state even without a user ID
        setUserData(prevData => ({
          ...prevData,
          ...newData
        }));
        
        return { success: true, message: 'Data stored temporarily' };
      }
      
      // Store the updated data in state
      setUserData(prevData => ({
        ...prevData,
        ...newData
      }));
      
      // Store in AsyncStorage for persistence
      const currentData = await AsyncStorage.getItem('userData');
      const parsedData = currentData ? JSON.parse(currentData) : {};
      const updatedData = {
        ...parsedData,
        ...newData
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      console.log('[AuthContext] User data updated successfully in AsyncStorage:', updatedData);
      
      // If profile data is included, update the Supabase profile
      if (newData.profileInfo && user?.id) {
        try {
          console.log('[AuthContext] Updating Supabase profile with:', newData.profileInfo);
          
          // Try to create/update the profile
          const { success, error } = await createProfile(user.id, newData.profileInfo);
          
          if (!success) {
            console.error('[AuthContext] Error updating profile via createProfile:', error);
            // Continue anyway since we've saved to AsyncStorage
          } else {
            console.log('[AuthContext] Profile updated successfully via createProfile');
          }
        } catch (profileError) {
          console.error('[AuthContext] Error during profile update:', profileError);
          // Continue execution - we don't want to fail the whole operation
          // if just the profile update fails
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('[AuthContext] Error updating user data:', error.message);
      return { success: false, error: error.message };
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
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    networkError,
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
    updateUserData,
  };
  
  debugLog('Providing auth context with values:', { 
    user: !!user, 
    loading, 
    isAuthenticated: !!user, 
    networkError,
    hasCompletedOnboarding,
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
