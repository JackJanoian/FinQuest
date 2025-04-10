import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  StatusBar,
  Dimensions
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const FirstActionScreen = () => {
  const navigation = useNavigation();
  const { completeOnboarding } = useAuth();
  
  // Add navigation state inspection
  const routes = useNavigationState(state => state?.routes || []);
  const currentRouteName = useNavigationState(state => state?.routes[state.index]?.name || 'Unknown');
  
  console.log('[FirstActionScreen] Current navigation state:', {
    routes: routes.map(r => r.name),
    currentRoute: currentRouteName,
    navigatorType: navigation.getParent()?.getId?.() || 'No parent',
    canGoBack: navigation.canGoBack(),
  });
  
  const handleChallengePress = async () => {
    try {
      console.log('[FirstActionScreen] Completing onboarding and navigating to Challenges');
      // Mark onboarding as completed
      await completeOnboarding();
      
      console.log('[FirstActionScreen] Navigation hierarchy:', {
        currentNav: navigation.constructor.name,
        parent: navigation.getParent()?.constructor.name || 'No parent',
        grandparent: navigation.getParent()?.getParent()?.constructor.name || 'No grandparent',
      });
      
      // Try to navigate to the root navigator first
      const rootNavigation = navigation.getParent()?.getParent() || navigation.getParent() || navigation;
      console.log('[FirstActionScreen] Using root navigation of type:', rootNavigation.constructor.name);
      
      // This will trigger the AppNavigator to show the MainTabNavigator
      rootNavigation.navigate('Main', { screen: 'Challenges' });
      console.log('[FirstActionScreen] Navigation to Challenges completed');
    } catch (error) {
      console.error('[FirstActionScreen] Error completing onboarding:', error);
    }
  };
  
  const handleOffersPress = async () => {
    try {
      console.log('[FirstActionScreen] Completing onboarding and navigating to Offers');
      // Mark onboarding as completed
      await completeOnboarding();
      
      console.log('[FirstActionScreen] Navigation hierarchy for Offers:', {
        currentNav: navigation.constructor.name,
        parent: navigation.getParent()?.constructor.name || 'No parent',
        grandparent: navigation.getParent()?.getParent()?.constructor.name || 'No grandparent',
      });
      
      // Try to navigate to the root navigator first
      const rootNavigation = navigation.getParent()?.getParent() || navigation.getParent() || navigation;
      console.log('[FirstActionScreen] Using root navigation of type for Offers:', rootNavigation.constructor.name);
      
      // Navigate to Main tab navigator and then to Offers screen
      rootNavigation.navigate('Main', { screen: 'Offers' });
      console.log('[FirstActionScreen] Navigation to Offers completed');
    } catch (error) {
      console.error('[FirstActionScreen] Error completing onboarding:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />
      <LinearGradient
        colors={['#1565C0', '#0D47A1']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image 
                source={require('../../../assets/images/blue_monster_quests.png')} 
                style={styles.characterImage} 
              />
            </View>
            
            <Text style={styles.header}>Complete Quests & Earn Badges</Text>
            <Text style={styles.subheadline}>Stay motivated by tackling fun challenges and collecting rewards.</Text>
            
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={async () => {
                console.log('[FirstActionScreen] Get Started button pressed');
                try {
                  await completeOnboarding();
                  console.log('[FirstActionScreen] Onboarding completed');
                  
                  // Try to navigate to the root navigator first
                  const rootNavigation = navigation.getParent()?.getParent() || navigation.getParent() || navigation;
                  
                  // Navigate to Main tab navigator and then to Dashboard screen
                  rootNavigation.navigate('Main', { screen: 'Dashboard' });
                  console.log('[FirstActionScreen] Navigation to Dashboard completed');
                } catch (error) {
                  console.error('[FirstActionScreen] Error navigating to Dashboard:', error);
                }
              }}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1565C0',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 60,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  getStartedButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  getStartedButtonText: {
    color: '#1565C0',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FirstActionScreen;
