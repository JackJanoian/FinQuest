import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const { user, userData } = useAuth();
  const { 
    totalDebt, 
    totalSavings, 
    totalXP, 
    dailyTasksCompleted,
    addXP,
    completeMiniQuest
  } = useFinancialData();
  const navigation = useNavigation();
  
  // State for financial data - now using context values
  const [financialData, setFinancialData] = useState({
    totalDebt: 0,
    totalSavings: 0,
    totalXP: 0
  });
  
  // State for user profile data
  const [profileData, setProfileData] = useState({
    name: "",
    gender: "male",
    bio: "",
    xp: 0
  });
  
  // State for streak data
  const [streak, setStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const maxStreak = 7; // Maximum streak days to display
  
  // State for active quests
  const [activeQuests, setActiveQuests] = useState([]);
  
  // Load user data on component mount
  useEffect(() => {
    console.log('[DashboardScreen] Component mounted');
    
    // Load user data from AsyncStorage or context
    const loadUserData = async () => {
      try {
        // Check if we have userData from context
        if (userData) {
          console.log('[DashboardScreen] Loading data from context:', userData);
          
          // Set financial data
          if (userData.financialInfo) {
            setFinancialData({
              totalDebt: userData.financialInfo.totalDebt || 0,
              totalSavings: userData.financialInfo.totalSavings || 0,
              totalXP: userData.financialInfo.totalXP || 0
            });
          }
          
          // Set profile data
          if (userData.profileInfo) {
            setProfileData({
              name: userData.profileInfo.username || "",
              gender: userData.profileInfo.gender || "male",
              bio: userData.profileInfo.bio || "",
              xp: 0 // Start with 0 XP for new users
            });
          }
        } else {
          // Try to load from AsyncStorage
          const storedData = await AsyncStorage.getItem('userData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log('[DashboardScreen] Loading data from AsyncStorage:', parsedData);
            
            // Set financial data
            if (parsedData.financialInfo) {
              setFinancialData({
                totalDebt: parsedData.financialInfo.totalDebt || 0,
                totalSavings: parsedData.financialInfo.totalSavings || 0,
                totalXP: parsedData.financialInfo.totalXP || 0
              });
            }
            
            // Set profile data
            if (parsedData.profileInfo) {
              setProfileData({
                name: parsedData.profileInfo.username || "",
                gender: parsedData.profileInfo.gender || "male",
                bio: parsedData.profileInfo.bio || "",
                xp: 0 // Start with 0 XP for new users
              });
            }
          } else {
            console.log('[DashboardScreen] No user data found, using defaults');
          }
        }
        
        // Load active quests from AsyncStorage
        await loadActiveQuests();
        
        // Load streak data
        await loadStreakData();
        await checkAndUpdateStreak();
      } catch (error) {
        console.error('[DashboardScreen] Error loading user data:', error);
      }
    };
    
    loadUserData();
    
    return () => {
      console.log('[DashboardScreen] Component unmounted');
    };
  }, [userData, user]);
  
  // Update financial data whenever context values change
  useEffect(() => {
    setFinancialData({
      totalDebt,
      totalSavings,
      totalXP
    });
    console.log('[DashboardScreen] Updated financial data from context:', { totalDebt, totalSavings, totalXP });
  }, [totalDebt, totalSavings, totalXP]);
  
  // Load streak data from AsyncStorage
  const loadStreakData = async () => {
    try {
      const streakData = await AsyncStorage.getItem('streakData');
      if (streakData) {
        const parsedData = JSON.parse(streakData);
        setStreak(parsedData.currentStreak || 0);
        setLastLoginDate(parsedData.lastLoginDate || null);
      }
    } catch (error) {
      console.error('Error loading streak data:', error);
    }
  };
  
  // Save streak data to AsyncStorage
  const saveStreakData = async () => {
    try {
      const streakData = {
        currentStreak: streak,
        lastLoginDate: lastLoginDate
      };
      await AsyncStorage.setItem('streakData', JSON.stringify(streakData));
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  };
  
  // Check and update streak based on login date
  const checkAndUpdateStreak = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const todayStr = today.toISOString().split('T')[0];
    
    // If this is the first time using the app
    if (!lastLoginDate) {
      setLastLoginDate(todayStr);
      setStreak(1);
      await saveStreakData();
      return;
    }
    
    // Convert lastLoginDate string to Date object
    const lastLogin = new Date(lastLoginDate);
    lastLogin.setHours(0, 0, 0, 0);
    
    // Calculate the difference in days
    const timeDiff = today.getTime() - lastLogin.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (dayDiff === 0) {
      // Same day login, no streak change
      return;
    } else if (dayDiff === 1) {
      // Consecutive day login, increment streak
      setStreak(prevStreak => prevStreak + 1);
      setLastLoginDate(todayStr);
    } else {
      // Streak broken (more than 1 day since last login)
      setStreak(1); // Reset to 1 for today
      setLastLoginDate(todayStr);
    }
    
    await saveStreakData();
  };
  
  // Load active quests from AsyncStorage
  const loadActiveQuests = async () => {
    try {
      const storedChallenges = await AsyncStorage.getItem('challenges');
      if (storedChallenges) {
        const allChallenges = JSON.parse(storedChallenges);
        // Filter to only show active challenges
        const active = allChallenges.filter(challenge => challenge.active);
        
        // Map challenges to quest format
        const mappedQuests = active.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          progress: challenge.progress || 0,
          reward: parseInt(challenge.reward?.split(' ')[0]) || 100,
          deadline: challenge.duration,
          difficulty: challenge.priority || 'Medium'
        }));
        
        setActiveQuests(mappedQuests);
        console.log('[DashboardScreen] Loaded active quests:', mappedQuests);
      } else {
        console.log('[DashboardScreen] No challenges found in AsyncStorage');
        setActiveQuests([]);
      }
    } catch (error) {
      console.error('[DashboardScreen] Error loading active quests:', error);
      setActiveQuests([]);
    }
  };
  
  // Handle completing a daily task
  const handleCompleteTask = async (taskType) => {
    if (dailyTasksCompleted[taskType]) {
      Alert.alert("Already Completed", "You've already completed this task today!");
      return;
    }
    
    // Navigate to the appropriate screen based on task type
    if (taskType === 'debtPayment') {
      navigation.navigate('Money');
    } else if (taskType === 'savingsDeposit') {
      navigation.navigate('Money');
    }
    
    // Add XP for completing the task manually (only if not already completed)
    addXP(25);
    
    // Show completion message
    Alert.alert(
      "Task Completed!", 
      `You've completed a daily task and earned +25 XP. Complete all tasks for a bonus!`,
      [{ text: "Keep Going!" }]
    );
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#0D47A1']}
        style={styles.header}
      >
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Track your financial progress</Text>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {/* Financial Summary Bar */}
        <View style={styles.summaryBarContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Debt</Text>
            <Text style={styles.summaryValue}>
              ${financialData.totalDebt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Savings</Text>
            <Text style={styles.summaryValue}>
              ${financialData.totalSavings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>XP</Text>
            <Text style={styles.summaryValue}>
              {totalXP} {/* Use totalXP directly from context instead of financialData */}
            </Text>
          </View>
        </View>
        
        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={styles.streakTextContainer}>
              <Text style={styles.streakTitle}>
                Current Streak <Text style={styles.fireEmoji}>🔥</Text>
              </Text>
              <Text style={styles.streakSubtitle}>
                {streak > 0 
                  ? `You've been active for ${streak} day${streak !== 1 ? 's' : ''}!` 
                  : 'Start your streak by completing daily tasks!'}
              </Text>
            </View>
          </View>
          
          <View style={styles.streakProgressContainer}>
            {[...Array(maxStreak)].map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.streakDay,
                  index < streak ? styles.streakDayCompleted : styles.streakDayIncomplete
                ]}
              >
                <Text 
                  style={[
                    styles.streakDayText,
                    index < streak ? styles.streakDayTextCompleted : styles.streakDayTextIncomplete
                  ]}
                >
                  {index + 1}
                </Text>
                {index < streak && (
                  <View style={styles.streakCheckmark}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}
          </View>
          
          <View style={styles.dailyTaskContainer}>
            <Text style={styles.dailyTaskTitle}>Today's Tasks</Text>
            
            <View style={styles.dailyTaskItem}>
              <View style={styles.taskCheckCircle}>
                {dailyTasksCompleted.debtPayment ? (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                ) : (
                  <View style={styles.emptyCircle} />
                )}
              </View>
              <Text style={styles.dailyTaskText}>Make a debt payment</Text>
              {dailyTasksCompleted.debtPayment ? (
                <Text style={styles.completedTaskText}>Complete</Text>
              ) : (
                <TouchableOpacity onPress={() => handleCompleteTask('debtPayment')}>
                  <Text style={styles.completeTaskButton}>Complete</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.dailyTaskItem}>
              <View style={styles.taskCheckCircle}>
                {dailyTasksCompleted.savingsDeposit ? (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                ) : (
                  <View style={styles.emptyCircle} />
                )}
              </View>
              <Text style={styles.dailyTaskText}>Add to your savings</Text>
              {dailyTasksCompleted.savingsDeposit ? (
                <Text style={styles.completedTaskText}>Complete</Text>
              ) : (
                <TouchableOpacity onPress={() => handleCompleteTask('savingsDeposit')}>
                  <Text style={styles.completeTaskButton}>Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        
        {/* Active Quests */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Quests</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Challenges')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {activeQuests.length > 0 ? (
            activeQuests.map(quest => (
              <TouchableOpacity 
                key={quest.id}
                style={styles.questCard}
                onPress={() => navigation.navigate('QuestDetail', { quest })}
              >
                <View style={styles.activeQuestHeader}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{quest.difficulty}</Text>
                  </View>
                </View>
                
                <Text style={styles.questDescription}>{quest.description}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${quest.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{quest.progress}%</Text>
                </View>
                
                <View style={styles.questFooter}>
                  <Text style={styles.questDeadline}>Due: {quest.deadline}</Text>
                  <Text style={styles.questReward}>+{quest.reward} XP</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="flag-outline" size={48} color="#BDBDBD" />
              <Text style={styles.emptyStateTitle}>No Active Quests</Text>
              <Text style={styles.emptyStateText}>
                Start a new quest to earn rewards and improve your finances!
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('Challenges')}
              >
                <Text style={styles.emptyStateButtonText}>Find Quests</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Spacer at bottom for better scrolling */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60, // Increase top padding to position header lower
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  fireEmoji: {
    fontSize: 20,
  },
  streakSubtitle: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  streakProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  streakDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  streakDayCompleted: {
    backgroundColor: '#1976D2',
  },
  streakDayIncomplete: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  streakDayText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  streakDayTextCompleted: {
    color: '#FFFFFF',
  },
  streakDayTextIncomplete: {
    color: '#1976D2',
  },
  streakCheckmark: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyTaskContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 15,
  },
  dailyTaskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  dailyTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskCheckCircle: {
    marginRight: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  dailyTaskText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
  },
  completeTaskButton: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  completedTaskText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  seeAllText: {
    color: '#1976D2',
    fontWeight: '500',
    fontSize: 14,
  },
  questCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  activeQuestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  difficultyBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  questDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1976D2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    width: 40,
    textAlign: 'right',
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questDeadline: {
    fontSize: 12,
    color: '#757575',
  },
  questReward: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
