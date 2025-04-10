import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();

  const handleRegister = async () => {
    console.log('[RegisterScreen] Registration attempt started');
    
    if (!email || !password || !confirmPassword) {
      console.log('[RegisterScreen] Registration failed: Missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      console.log('[RegisterScreen] Registration failed: Passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('[RegisterScreen] Registration failed: Password too short');
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    console.log('[RegisterScreen] Calling signUp with email:', email);
    
    try {
      const { success, error } = await signUp(email, password);
      console.log('[RegisterScreen] signUp result:', { success, error });
      
      if (!success) {
        console.log('[RegisterScreen] Registration failed:', error);
        Alert.alert('Registration Failed', error || 'Please try again with a different email');
      } else {
        console.log('[RegisterScreen] Registration successful');
        
        // Force navigation to the onboarding flow
        Alert.alert(
          'Registration Successful', 
          'Your account has been created! You will now be guided through the onboarding process.',
          [{ 
            text: 'OK', 
            onPress: () => {
              console.log('[RegisterScreen] Alert OK pressed, forcing navigation to onboarding');
              // Force a refresh of the navigation stack to trigger the AppNavigator to show onboarding
              navigation.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              });
            }
          }]
        );
      }
    } catch (error) {
      console.log('[RegisterScreen] Registration error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#1E88E5" />
      </TouchableOpacity>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Header */}
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Join FinQuest</Text>
          <Text style={styles.subtitle}>Create an account to start your financial adventure</Text>
        </View>
        
        {/* Registration Form */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formContainer}
        >
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#90CAF9" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#BBDEFB"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#90CAF9" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#BBDEFB"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#90CAF9" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#BBDEFB"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    flexGrow: 1,
    paddingBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 260,
    height: 260,
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64B5F6',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 30,
    width: '100%',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    color: '#1976D2',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#757575',
    fontSize: 16,
  },
  footerLink: {
    color: '#1E88E5',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RegisterScreen;
