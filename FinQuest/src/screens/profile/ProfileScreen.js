import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  Dimensions,
  Image
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import supabase from '../../config/supabase';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  
  // User profile state
  const [profileName, setProfileName] = useState('John Doe');
  const [profileEmail, setProfileEmail] = useState('jjanoian25@gmail.com');
  const [profileBio, setProfileBio] = useState('Set your financial goal!');
  const [gender, setGender] = useState('male'); // Default to male if not set
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(true);
  
  // Edit profile modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(profileName);
  const [editBio, setEditBio] = useState(profileBio);
  const [editGender, setEditGender] = useState(gender);
  
  // Manage Account and Privacy screens
  const [manageAccountVisible, setManageAccountVisible] = useState(false);
  const [privacySecurityVisible, setPrivacySecurityVisible] = useState(false);
  
  // Account settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Fetch user profile data on component mount
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      // First check if a profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Use the first profile found
        const profile = data[0];
        setProfileName(profile.username || 'User');
        setProfileEmail(user.email);
        setProfileBio(profile.bio || 'Set your financial goal!');
        setGender(profile.gender || 'male');
        setNotifications(profile.notifications !== undefined ? profile.notifications : true);
        setDataSharing(profile.data_sharing !== undefined ? profile.data_sharing : true);
        setMarketingEmails(profile.marketing_emails !== undefined ? profile.marketing_emails : true);
      } else {
        // No profile found, create one
        console.log('No profile found, creating a new one');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user.id,
              username: 'User',
              bio: 'Set your financial goal!',
              gender: 'male',
              notifications: true,
              data_sharing: true,
              marketing_emails: true
            }
          ])
          .select();
          
        if (createError) {
          console.error('Error creating profile:', createError.message);
          return;
        }
        
        if (newProfile && newProfile.length > 0) {
          setProfileName(newProfile[0].username);
          setProfileEmail(user.email);
          setProfileBio(newProfile[0].bio);
          setGender(newProfile[0].gender);
          setNotifications(newProfile[0].notifications);
          setDataSharing(newProfile[0].data_sharing);
          setMarketingEmails(newProfile[0].marketing_emails);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      Alert.alert('Profile Error', 'There was an error loading your profile. Please try again later.');
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { success, error } = await signOut();
      
      if (!success) {
        Alert.alert('Error', error || 'Failed to sign out');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete user account from Supabase
              const { error } = await supabase.auth.admin.deleteUser(user.id);
              
              if (error) throw error;
              
              // Sign out after successful deletion
              await signOut();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete account');
            }
          }
        }
      ]
    );
  };
  
  const handleEditProfile = () => {
    setEditName(profileName);
    setEditBio(profileBio);
    setEditGender(gender);
    setEditModalVisible(true);
  };
  
  const saveProfileChanges = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editName,
          bio: editBio,
          gender: editGender,
          updated_at: new Date()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfileName(editName);
      setProfileBio(editBio);
      setGender(editGender);
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };
  
  const navigateToManageAccount = () => {
    setManageAccountVisible(true);
  };

  const navigateToPrivacySecurity = () => {
    setPrivacySecurityVisible(true);
  };

  const updateNotificationSettings = async (value) => {
    try {
      setNotifications(value);
      
      const { error } = await supabase
        .from('profiles')
        .update({ notifications: value })
        .eq('id', user.id);
      
      if (error) throw error;
      
      console.log('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error.message);
      // Revert the UI state if the update fails
      setNotifications(!value);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const updateDataSharingSettings = async (value) => {
    try {
      setDataSharing(value);
      
      const { error } = await supabase
        .from('profiles')
        .update({ data_sharing: value })
        .eq('id', user.id);
      
      if (error) throw error;
      
      console.log('Data sharing settings updated successfully');
    } catch (error) {
      console.error('Error updating data sharing settings:', error.message);
      // Revert the UI state if the update fails
      setDataSharing(!value);
      Alert.alert('Error', 'Failed to update data sharing settings');
    }
  };

  const updateMarketingEmailSettings = async (value) => {
    try {
      setMarketingEmails(value);
      
      const { error } = await supabase
        .from('profiles')
        .update({ marketing_emails: value })
        .eq('id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating marketing email settings:', error.message);
      setMarketingEmails(!value);
      Alert.alert('Error', 'Failed to update marketing email settings');
    }
  };

  const changePassword = async () => {
    // Validate passwords
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters');
      return;
    }
    
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profileEmail,
        password: currentPassword,
      });
      
      if (signInError) {
        Alert.alert('Error', 'Current password is incorrect');
        return;
      }
      
      // Change the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      // Clear the password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      Alert.alert('Success', 'Password updated successfully');
    } catch (error) {
      console.error('Error changing password:', error.message);
      Alert.alert('Error', error.message || 'Failed to change password');
    }
  };
  
  // Get the appropriate avatar based on gender
  const getAvatarSource = () => {
    return gender === 'female' 
      ? require('../../../assets/images/blue_monster_female.png')
      : require('../../../assets/images/blue_monster_male.png');
  };
  
  // Navigate to Privacy Policy screen
  const navigateToPrivacyPolicy = () => {
    setPrivacySecurityVisible(false);
    navigation.navigate('PrivacyPolicy');
  };
  
  // Navigate to Terms of Service screen
  const navigateToTermsOfService = () => {
    setPrivacySecurityVisible(false);
    navigation.navigate('TermsOfService');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#0D47A1']}
        style={styles.header}
      >
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account settings</Text>
      </LinearGradient>
      
      <ScrollView style={styles.scrollView}>
        {/* User Information Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={getAvatarSource()} 
              style={styles.profileImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.profileBio}>{profileBio}</Text>
          
          <TouchableOpacity 
            style={styles.editProfileButton} 
            onPress={handleEditProfile}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        {/* Settings Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={24} color="#4285F4" />
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          
          {/* Manage Account */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={navigateToManageAccount}
          >
            <View style={styles.settingItemLeft}>
              <FontAwesome5 name="user-cog" size={20} color="#757575" />
              <Text style={styles.settingLabel}>Manage Account</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          
          {/* Privacy & Security */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={navigateToPrivacySecurity}
          >
            <View style={styles.settingItemLeft}>
              <FontAwesome5 name="shield-alt" size={20} color="#757575" />
              <Text style={styles.settingLabel}>Privacy & Security</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          
          {/* Data Sharing Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <FontAwesome5 name="chart-pie" size={20} color="#757575" />
              <Text style={styles.settingLabel}>Data Sharing for Analytics</Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={updateDataSharingSettings}
              trackColor={{ false: '#E0E0E0', true: '#4285F4' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {/* Notifications Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="notifications" size={22} color="#757575" />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={updateNotificationSettings}
              trackColor={{ false: '#E0E0E0', true: '#4285F4' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                maxLength={50}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Set your financial goal!"
                multiline
                maxLength={100}
              />
              <Text style={styles.helperText}>{editBio.length}/100 characters</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderOptions}>
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    editGender === 'male' && styles.genderOptionSelected
                  ]}
                  onPress={() => setEditGender('male')}
                >
                  <Image 
                    source={require('../../../assets/images/blue_monster_male.png')} 
                    style={styles.genderAvatar}
                    resizeMode="contain"
                  />
                  <Text style={styles.genderText}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    editGender === 'female' && styles.genderOptionSelected
                  ]}
                  onPress={() => setEditGender('female')}
                >
                  <Image 
                    source={require('../../../assets/images/blue_monster_female.png')} 
                    style={styles.genderAvatar}
                    resizeMode="contain"
                  />
                  <Text style={styles.genderText}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={profileEmail}
                editable={false}
              />
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setEditModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveProfileChanges}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Manage Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={manageAccountVisible}
        onRequestClose={() => setManageAccountVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setManageAccountVisible(false)}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#212121" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Manage Account</Text>
              <View style={{ width: 24 }} />
            </View>
            
            <ScrollView style={{ maxHeight: '90%' }}>
              {/* Email Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Email Address</Text>
                <Text style={styles.modalSectionSubtitle}>Your email is used for login and notifications</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[styles.textInput, styles.disabledInput]}
                    value={profileEmail}
                    editable={false}
                  />
                  <Text style={styles.helperText}>Contact support to change your email</Text>
                </View>
              </View>
              
              {/* Password Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Change Password</Text>
                <Text style={styles.modalSectionSubtitle}>Update your password regularly for security</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Current Password</Text>
                  <TextInput
                    style={styles.textInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    secureTextEntry
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    secureTextEntry
                  />
                  <Text style={styles.helperText}>Password must be at least 8 characters</Text>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm New Password</Text>
                  <TextInput
                    style={styles.textInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={changePassword}
                >
                  <Text style={styles.actionButtonText}>Update Password</Text>
                </TouchableOpacity>
              </View>
              
              {/* Account Information */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Account Information</Text>
                <Text style={styles.modalSectionSubtitle}>Details about your FinQuest account</Text>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Account Created</Text>
                  <Text style={styles.infoValue}>April 7, 2025</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Account Type</Text>
                  <Text style={styles.infoValue}>Standard</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Account ID</Text>
                  <Text style={styles.infoValue}>{user?.id?.substring(0, 8) || 'Unknown'}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Privacy & Security Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={privacySecurityVisible}
        onRequestClose={() => setPrivacySecurityVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setPrivacySecurityVisible(false)}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#212121" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Privacy & Security</Text>
              <View style={{ width: 24 }} />
            </View>
            
            <ScrollView style={{ maxHeight: '90%' }}>
              {/* Data Privacy Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Data Privacy</Text>
                <Text style={styles.modalSectionSubtitle}>Control how your data is used</Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <FontAwesome5 name="chart-pie" size={20} color="#757575" />
                    <Text style={styles.settingLabel}>Data Sharing for Analytics</Text>
                  </View>
                  <Switch
                    value={dataSharing}
                    onValueChange={updateDataSharingSettings}
                    trackColor={{ false: '#E0E0E0', true: '#4285F4' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <FontAwesome5 name="envelope" size={20} color="#757575" />
                    <Text style={styles.settingLabel}>Marketing Emails</Text>
                  </View>
                  <Switch
                    value={marketingEmails}
                    onValueChange={updateMarketingEmailSettings}
                    trackColor={{ false: '#E0E0E0', true: '#4285F4' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
              
              {/* Legal Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Legal</Text>
                <Text style={styles.modalSectionSubtitle}>Legal documents and information</Text>
                
                <TouchableOpacity 
                  style={styles.legalOption}
                  onPress={navigateToPrivacyPolicy}
                >
                  <Text style={styles.legalOptionText}>Privacy Policy</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.legalOption}
                  onPress={navigateToTermsOfService}
                >
                  <Text style={styles.legalOptionText}>Terms of Service</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.legalOption}>
                  <Text style={styles.legalOptionText}>Data Deletion Request</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.deleteAccountButton}
                onPress={() => {
                  setPrivacySecurityVisible(false);
                  setTimeout(() => {
                    handleDeleteAccount();
                  }, 500);
                }}
              >
                <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
              </TouchableOpacity>
              
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: -20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileBio: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  editProfileButton: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  editProfileButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 12,
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 16,
  },
  actionButtons: {
    marginTop: 24,
    marginBottom: 40,
  },
  signOutButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  signOutButtonText: {
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteAccountButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  deleteAccountButtonText: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#9E9E9E',
  },
  helperText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  genderOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    width: '45%',
  },
  genderOptionSelected: {
    borderColor: '#4285F4',
    backgroundColor: '#E3F2FD',
  },
  genderAvatar: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#212121',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  modalSection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  modalSectionSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 16,
    color: '#212121',
  },
  infoValue: {
    fontSize: 16,
    color: '#757575',
  },
  legalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  legalOptionText: {
    fontSize: 16,
    color: '#212121',
  },
});

export default ProfileScreen;
