import React, { useEffect } from 'react';
import { StyleSheet, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { FinancialDataProvider } from './src/context/FinancialDataContext';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ignore specific warnings that might be related to navigation
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Accessing the "state" property of the "route" object is not supported',
]);

// Main App component
const AppContent = () => {
  useEffect(() => {
    const checkAsyncStorage = async () => {
      try {
        console.log('======== APP STARTUP DEBUGGING ========');
        const keys = await AsyncStorage.getAllKeys();
        console.log('All AsyncStorage keys:', keys);
        
        const onboardingStatus = await AsyncStorage.getItem('hasCompletedOnboarding');
        console.log('hasCompletedOnboarding value:', onboardingStatus);
        console.log('======== END APP STARTUP DEBUGGING ========');
      } catch (error) {
        console.error('Error checking AsyncStorage:', error);
      }
    };
    
    checkAsyncStorage();
  }, []);
  
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
};

// Main App component
export default function App() {
  console.log('FinQuest app initializing');
  
  return (
    <AuthProvider>
      <FinancialDataProvider>
        <AppContent />
      </FinancialDataProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  }
});
