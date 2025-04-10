import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { ProgressDots } from '../../components/ProgressDots';
import CustomCheckbox from '../../components/CustomCheckbox';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isFormValid = name && email && password && consent && password.length >= 8;

  const handleSignUp = async () => {
    console.log('[SignUpScreen] Starting signup process');
    
    if (!isFormValid) {
      console.log('[SignUpScreen] Form validation failed');
      if (!name || !email || !password) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      
      if (password.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters long');
        return;
      }
      
      if (!consent) {
        Alert.alert('Error', 'You must agree to the Terms of Service and Privacy Policy');
        return;
      }
      
      return;
    }
    
    setLoading(true);
    console.log('[SignUpScreen] Form is valid, proceeding with signup');
    console.log('[SignUpScreen] User data:', { name, email });
    
    try {
      // Save the user's name to local storage or context
      // This will be used for personalization
      const userData = { name };
      console.log('[SignUpScreen] Calling signUp with userData:', userData);
      
      // Call the signUp function from AuthContext
      const { success, error } = await signUp(email, password, userData);
      console.log('[SignUpScreen] SignUp result:', { success, error });
      
      if (success) {
        console.log('[SignUpScreen] Signup successful');
        
        // Show a success message
        Alert.alert(
          'Account Created',
          'Your account has been created successfully! You will now be guided through the onboarding process.',
          [
            {
              text: 'Continue',
              onPress: () => {
                // Let the app naturally transition to the onboarding flow
                // The AppNavigator will detect the authenticated state and show the OnboardingNavigator
                console.log('[SignUpScreen] User acknowledged success, app will transition to onboarding');
              }
            }
          ]
        );
      } else {
        console.log('[SignUpScreen] Signup failed:', error);
        Alert.alert('Registration Failed', error || 'Please try again with a different email');
      }
    } catch (error) {
      console.log('[SignUpScreen] Error during signup:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      console.log('[SignUpScreen] Signup process completed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress indicator */}
        <ProgressDots currentStep={1} totalSteps={4} />
        
        <Text style={styles.header}>Create Your Account</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password (min. 8 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <View style={styles.consentContainer}>
          <CustomCheckbox
            value={consent}
            onValueChange={setConsent}
            tintColors={{ true: '#4CAF50', false: '#757575' }}
          />
          <Text style={styles.consentText}>
            I agree to the{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('TermsOfService')}
            >
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid || loading}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.loginLink}>
          Already have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            Log in
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  consentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  consentText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  link: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
});

export default SignUpScreen;
