import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert,
  StatusBar,
  Switch
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import supabase from '../../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FinancialInfoScreen = () => {
  const navigation = useNavigation();
  const { user, updateUserData } = useAuth();
  
  // Personal information
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male'); // Default to male
  const [financialGoal, setFinancialGoal] = useState('');
  
  // Financial information
  const [totalDebt, setTotalDebt] = useState('');
  const [totalSavings, setTotalSavings] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    console.log('[FinancialInfoScreen] Component mounted');
    console.log('[FinancialInfoScreen] User state:', user ? `ID: ${user.id}` : 'No user');
    
    return () => {
      console.log('[FinancialInfoScreen] Component unmounted');
    };
  }, [user]);
  
  useFocusEffect(
    React.useCallback(() => {
      console.log('[FinancialInfoScreen] Screen focused');
      console.log('[FinancialInfoScreen] Current navigation state:', navigation.getState());
      
      return () => {
        console.log('[FinancialInfoScreen] Screen blurred');
      };
    }, [navigation])
  );
  
  const handleContinue = async () => {
    console.log('[FinancialInfoScreen] Continue button pressed');
    
    // Validate name
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name to continue.');
      return;
    }
    
    // Validate financial goal
    if (!financialGoal.trim()) {
      Alert.alert('Missing Information', 'Please enter your financial goal to continue.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if user is available
      if (!user) {
        console.error('[FinancialInfoScreen] No user found in context');
        Alert.alert(
          'Session Error', 
          'Your session appears to be invalid. Please try logging in again.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Auth', { screen: 'Login' }) 
            }
          ]
        );
        return;
      }
      
      // Generate a temporary ID if user.id is not available
      const userId = user.id || `temp_${Date.now()}`;
      console.log('[FinancialInfoScreen] Using user ID:', userId);
      
      // Prepare user profile data
      const profileData = {
        id: userId,
        username: name.trim(),
        gender: gender,
        bio: financialGoal.trim(),
        notifications: true,
        data_sharing: true,
        marketing_emails: true,
        created_at: new Date().toISOString()
      };
      
      // Prepare financial data
      const financialData = {
        totalDebt: totalDebt ? parseFloat(totalDebt) : 0,
        totalSavings: totalSavings ? parseFloat(totalSavings) : 0,
        income: income ? parseFloat(income) : 0,
        expenses: expenses ? parseFloat(expenses) : 0,
      };
      
      console.log('[FinancialInfoScreen] Profile data:', profileData);
      console.log('[FinancialInfoScreen] Financial data:', financialData);
      
      // Skip direct Supabase profile update due to RLS policy
      // Instead, save profile data to local storage via context
      // The AuthContext or a server-side function should handle the actual profile update
      
      // Save financial and profile data to local storage or context
      if (updateUserData) {
        await updateUserData({ 
          financialInfo: financialData,
          profileInfo: profileData
        });
        console.log('[FinancialInfoScreen] User data saved to context/local storage');
      } else {
        console.warn('[FinancialInfoScreen] updateUserData function not available');
        
        // Fallback: Save directly to AsyncStorage if context function is not available
        try {
          const userData = {
            financialInfo: financialData,
            profileInfo: profileData
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          console.log('[FinancialInfoScreen] User data saved directly to AsyncStorage as fallback');
        } catch (storageError) {
          console.error('[FinancialInfoScreen] Error saving to AsyncStorage:', storageError);
        }
      }
      
      // Navigate to the feature tour
      console.log('[FinancialInfoScreen] Navigating to FeatureTour');
      navigation.navigate('FeatureTour');
      console.log('[FinancialInfoScreen] Navigation to FeatureTour triggered');
    } catch (error) {
      console.error('[FinancialInfoScreen] Error saving user data:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkip = () => {
    console.log('[FinancialInfoScreen] Skip button pressed');
    
    // Even if skipping, we need at least a name
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name before continuing.');
      return;
    }
    
    // Navigate to the feature tour without saving financial data
    console.log('[FinancialInfoScreen] Navigating to FeatureTour (skipped)');
    navigation.navigate('FeatureTour');
    console.log('[FinancialInfoScreen] Navigation to FeatureTour triggered (skipped)');
  };

  console.log('[FinancialInfoScreen] Rendering component');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />
      <LinearGradient
        colors={['#1E88E5', '#0D47A1']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Profile</Text>
            <Text style={styles.headerSubtitle}>
              Tell us a bit about yourself to personalize your experience
            </Text>
          </View>
          
          <ScrollView 
            style={styles.formContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Personal Information Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="person-outline" size={24} color="#1E88E5" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Your Name"
                  placeholderTextColor="#90A4AE"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              
              <Text style={styles.sectionLabel}>Gender</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    gender === 'male' && styles.genderOptionSelected
                  ]}
                  onPress={() => setGender('male')}
                >
                  <Ionicons 
                    name="male-outline" 
                    size={24} 
                    color={gender === 'male' ? "#1E88E5" : "#90A4AE"} 
                  />
                  <Text style={[
                    styles.genderText,
                    gender === 'male' && styles.genderTextSelected
                  ]}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    gender === 'female' && styles.genderOptionSelected
                  ]}
                  onPress={() => setGender('female')}
                >
                  <Ionicons 
                    name="female-outline" 
                    size={24} 
                    color={gender === 'female' ? "#1E88E5" : "#90A4AE"} 
                  />
                  <Text style={[
                    styles.genderText,
                    gender === 'female' && styles.genderTextSelected
                  ]}>Female</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    gender === 'other' && styles.genderOptionSelected
                  ]}
                  onPress={() => setGender('other')}
                >
                  <Ionicons 
                    name="person-outline" 
                    size={24} 
                    color={gender === 'other' ? "#1E88E5" : "#90A4AE"} 
                  />
                  <Text style={[
                    styles.genderText,
                    gender === 'other' && styles.genderTextSelected
                  ]}>Other</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="flag-outline" size={24} color="#1E88E5" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Your Financial Goal"
                  placeholderTextColor="#90A4AE"
                  value={financialGoal}
                  onChangeText={setFinancialGoal}
                  multiline
                />
              </View>
            </View>
            
            {/* Financial Information Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Financial Information</Text>
              <Text style={styles.cardSubtitle}>Optional - you can add this later</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="trending-down-outline" size={24} color="#1E88E5" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Total Debt ($)"
                  placeholderTextColor="#90A4AE"
                  keyboardType="numeric"
                  value={totalDebt}
                  onChangeText={setTotalDebt}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="trending-up-outline" size={24} color="#1E88E5" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Total Savings ($)"
                  placeholderTextColor="#90A4AE"
                  keyboardType="numeric"
                  value={totalSavings}
                  onChangeText={setTotalSavings}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="cash-outline" size={24} color="#1E88E5" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Monthly Income ($)"
                  placeholderTextColor="#90A4AE"
                  keyboardType="numeric"
                  value={income}
                  onChangeText={setIncome}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="trending-down-outline" size={24} color="#1E88E5" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Monthly Expenses ($)"
                  placeholderTextColor="#90A4AE"
                  keyboardType="numeric"
                  value={expenses}
                  onChangeText={setExpenses}
                />
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleContinue}
                disabled={loading}
              >
                <Text style={styles.continueButtonText}>
                  {loading ? 'Saving...' : 'Continue'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.skipButton} 
                onPress={handleSkip}
                disabled={loading}
              >
                <Text style={styles.skipText}>Skip Financial Details</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#78909C',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  inputIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#263238',
  },
  sectionLabel: {
    fontSize: 16,
    color: '#263238',
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  genderOptionSelected: {
    borderColor: '#1E88E5',
    backgroundColor: '#E3F2FD',
  },
  genderText: {
    marginTop: 5,
    fontSize: 14,
    color: '#78909C',
  },
  genderTextSelected: {
    color: '#1E88E5',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    color: '#1E88E5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FinancialInfoScreen;
