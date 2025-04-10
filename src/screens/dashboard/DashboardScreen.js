import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Transaction component for the Recent Transactions section
const Transaction = ({ type, title, date, amount, isPositive }) => (
  <View style={styles.transactionItem}>
    <View style={[styles.transactionIcon, { backgroundColor: isPositive ? '#E1F5FE' : '#E8EAF6' }]}>
      <Ionicons 
        name={isPositive ? "arrow-up" : "arrow-down"} 
        size={20} 
        color={isPositive ? "#29B6F6" : "#5C6BC0"} 
      />
    </View>
    <View style={styles.transactionDetails}>
      <Text style={styles.transactionTitle}>{title}</Text>
      <Text style={styles.transactionDate}>{date}</Text>
    </View>
    <Text style={[styles.transactionAmount, { color: isPositive ? '#4CAF50' : '#F44336' }]}>
      {isPositive ? '+ ' : '- '}${Math.abs(amount)}
    </Text>
  </View>
);

const DashboardScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  
  // State for streak data
  const [streak, setStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [dailyTasksCompleted, setDailyTasksCompleted] = useState({
    debtPayment: false,
    savingsDeposit: false
  });
  const maxStreak = 7; // Maximum streak days to display
  
  // Mock data - would come from your Supabase database in a real app
  const userData = {
    name: "Alex Johnson",
    xp: 1250,
    totalDebt: 42150,
    totalSavings: 19500,
    debtToIncomeRatio: 65,
    streak: 4, // Current streak days
    maxStreak: 7 // Maximum streak days to display
  };
  
  // Mock transactions data
  const recentTransactions = [
    { id: 1, type: 'deposit', title: 'Home Down Payment Deposit', date: 'Apr 14', amount: 500, isPositive: true },
    { id: 2, type: 'payment', title: 'Personal Loan Payment', date: 'Apr 19', amount: 100, isPositive: false },
    { id: 3, type: 'deposit', title: 'New Laptop Fund Deposit', date: 'Apr 24', amount: 200, isPositive: true },
    { id: 4, type: 'payment', title: 'Car Loan Payment', date: 'Apr 27', amount: 250, isPositive: false },
    { id: 5, type: 'deposit', title: 'Vacation Fund Deposit', date: 'Apr 30', amount: 150, isPositive: true },
  ];
  
  // Mock active quests data
  const activeQuests = [
    { 
      id: 1, 
      title: 'Debt Destroyer', 
      description: 'Pay off $500 of your highest interest debt',
      progress: 65,
      reward: 250,
      deadline: 'May 15, 2025',
      difficulty: 'Medium'
    },
    { 
      id: 2, 
      title: 'Emergency Fund Builder', 
      description: 'Save $1,000 in your emergency fund',
      progress: 30,
      reward: 300,
      deadline: 'June 1, 2025',
      difficulty: 'Hard'
    }
  ];
  
  // Mock mini quests data
  const miniQuests = [
    { 
      id: 1, 
      type: 'savings', 
      title: 'Save a Little, Grow a Lot', 
      cta: 'Deposit $10 today', 
      reward: 15,
      icon: 'piggy-bank',
      color: '#2196F3'
    },
    { 
      id: 2, 
      type: 'debt', 
      title: 'Debt Destroyer', 
      cta: 'Make a payment on any loan', 
      reward: 20,
      icon: 'money-bill-wave',
      color: '#4CAF50'
    },
    { 
      id: 3, 
      type: 'streak', 
      title: 'Consistency Champion', 
      cta: 'Log in 3 days in a row', 
      reward: 25,
      icon: 'fire',
      color: '#FF9800'
    },
    { 
      id: 4, 
      type: 'challenge', 
      title: 'Quest Beginner', 
      cta: 'Start your first Quest', 
      reward: 30,
      icon: 'trophy',
      color: '#9C27B0'
    }
  ];
  
  // Mini Quest Card Component
  const MiniQuestCard = ({ quest, onPress }) => (
    <TouchableOpacity 
      style={styles.miniQuestCard}
      onPress={onPress}
    >
      <View style={[styles.miniQuestIconContainer, { backgroundColor: quest.color }]}>
        <FontAwesome5 name={quest.icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.miniQuestTitle}>{quest.title}</Text>
      <Text style={styles.miniQuestCta}>{quest.cta}</Text>
      <View style={styles.miniQuestRewardContainer}>
        <Text style={styles.miniQuestReward}>+{quest.reward} XP</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Load streak data when component mounts
  useEffect(() => {
    loadStreakData();
    checkAndUpdateStreak();
  }, []);
  
  // Load streak data from AsyncStorage
  const loadStreakData = async () => {
    try {
      const streakData = await AsyncStorage.getItem('streakData');
      if (streakData) {
        const parsedData = JSON.parse(streakData);
        setStreak(parsedData.currentStreak || 0);
        setLastLoginDate(parsedData.lastLoginDate || null);
        setDailyTasksCompleted(parsedData.dailyTasksCompleted || {
          debtPayment: false,
          savingsDeposit: false
        });
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
        lastLoginDate: lastLoginDate,
        dailyTasksCompleted: dailyTasksCompleted
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
      // Reset daily tasks since it's a new day
      setDailyTasksCompleted({
        debtPayment: false,
        savingsDeposit: false
      });
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
      // Reset daily tasks since it's a new day
      setDailyTasksCompleted({
        debtPayment: false,
        savingsDeposit: false
      });
    } else {
      // Streak broken (more than 1 day since last login)
      setStreak(1); // Reset to 1 for today
      setLastLoginDate(todayStr);
      // Reset daily tasks since it's a new day
      setDailyTasksCompleted({
        debtPayment: false,
        savingsDeposit: false
      });
    }
    
    await saveStreakData();
  };
  
  // Handle completing a daily task
  const handleCompleteTask = async (taskType) => {
    if (dailyTasksCompleted[taskType]) {
      Alert.alert("Already Completed", "You've already completed this task today!");
      return;
    }
    
    // Update the task completion status
    const updatedTasks = {
      ...dailyTasksCompleted,
      [taskType]: true
    };
    
    setDailyTasksCompleted(updatedTasks);
    
    // Add XP for completing the task
    // In a real app, you would update this in your database
    
    // Check if both tasks are completed
    if (updatedTasks.debtPayment && updatedTasks.savingsDeposit) {
      Alert.alert(
        "Daily Tasks Completed!", 
        "Great job! You've completed all daily tasks and earned +20 XP.",
        [{ text: "Awesome!" }]
      );
    } else {
      Alert.alert(
        "Task Completed!", 
        `You've completed a daily task and earned +10 XP. Complete all tasks for a bonus!`,
        [{ text: "Keep Going!" }]
      );
    }
    
    // Save the updated streak data
    await saveStreakData();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#0D47A1']}
        style={styles.header}
      >
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Track your financial progress</Text>
      </LinearGradient>
      
      {/* Updated Stats Container */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${userData.totalDebt.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Debt</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${userData.totalSavings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Savings</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {/* Daily Streak Tracker Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Streak</Text>
          
          <View style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View style={styles.streakTextContainer}>
                <Text style={styles.streakTitle}>
                  You're on a {streak}-day streak! 
                  <Text style={styles.fireEmoji}> 🔥</Text>
                </Text>
                <Text style={styles.streakSubtitle}>
                  Keep it going — pay down debt or log savings today to earn +20 XP.
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
                  <Text style={[
                    styles.streakDayText, 
                    index < streak ? styles.streakDayTextCompleted : styles.streakDayTextIncomplete
                  ]}>
                    {index + 1}
                  </Text>
                  {index < streak && (
                    <FontAwesome5 
                      name="check" 
                      size={12} 
                      color="#FFFFFF" 
                      style={styles.streakCheckmark} 
                    />
                  )}
                </View>
              ))}
            </View>
            
            <View style={styles.dailyTaskContainer}>
              <Text style={styles.dailyTaskTitle}>Today's Goals:</Text>
              <View style={styles.dailyTaskItem}>
                <FontAwesome5 name="money-bill-wave" size={16} color="#4CAF50" style={styles.taskIcon} />
                <Text style={styles.dailyTaskText}>Make a payment on any debt</Text>
                <TouchableOpacity onPress={() => handleCompleteTask('debtPayment')}>
                  <Text style={styles.completeTaskButton}>Complete</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dailyTaskItem}>
                <FontAwesome5 name="piggy-bank" size={16} color="#2196F3" style={styles.taskIcon} />
                <Text style={styles.dailyTaskText}>Add to your savings goal</Text>
                <TouchableOpacity onPress={() => handleCompleteTask('savingsDeposit')}>
                  <Text style={styles.completeTaskButton}>Complete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        {/* Active Challenge Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Challenges')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {activeQuests.length > 0 ? (
            <View>
              {activeQuests.map((quest) => (
                <TouchableOpacity 
                  key={quest.id}
                  style={[styles.challengeCard, { backgroundColor: '#FFFFFF', marginBottom: 10 }]}
                  onPress={() => navigation.navigate('Challenges')}
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
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { width: `${quest.progress}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{quest.progress}%</Text>
                  </View>
                  
                  <View style={styles.questFooter}>
                    <Text style={styles.questDeadline}>Due: {quest.deadline}</Text>
                    <Text style={styles.questReward}>+{quest.reward} XP</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={[styles.challengeCard, { backgroundColor: '#FFFFFF' }]}>
              <View style={styles.challengeContent}>
                <Image 
                  source={require('../../../assets/images/blue_monster_male.png')} 
                  style={styles.monsterImage}
                  resizeMode="contain"
                />
                <View style={styles.challengeTextContainer}>
                  <Text style={styles.noActiveText}>No active challenges</Text>
                  <Text style={styles.challengeHint}>
                    Start a new challenge to earn XP and rewards!
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
        
        {/* Mini Quest Suggestions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mini Quests</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Challenges')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={miniQuests}
            renderItem={({ item }) => (
              <MiniQuestCard 
                quest={item} 
                onPress={() => {
                  if (item.type === 'savings') {
                    navigation.navigate('Money', { screen: 'Savings' });
                  } else if (item.type === 'debt') {
                    navigation.navigate('Money', { screen: 'Debts' });
                  } else if (item.type === 'challenge') {
                    navigation.navigate('Challenges');
                  } else if (item.type === 'streak') {
                    // For streak quests, just keep them on the dashboard where the streak tracker is
                    // Maybe scroll to the streak section in the future
                  } else {
                    // Default fallback for any other quest types
                    navigation.navigate('Challenges');
                  }
                }}
              />
            )}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.miniQuestsContainer}
          />
        </View>
        
        {/* Recent Transactions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Money')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.map(transaction => (
            <Transaction
              key={transaction.id}
              type={transaction.type}
              title={transaction.title}
              date={transaction.date}
              amount={transaction.amount}
              isPositive={transaction.isPositive}
            />
          ))}
        </View>
      </ScrollView>
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
  statsContainer: {
    marginTop: -20,
    marginHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
  },
  seeAll: {
    color: '#1565C0',
    fontWeight: '600',
    fontSize: 16,
  },
  challengeCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 150,
  },
  monsterImage: {
    width: 220,
    height: 220,
    marginRight: 0,
    position: 'absolute',
    left: -30,
    bottom: -40,
    opacity: 0.9,
  },
  challengeTextContainer: {
    flex: 1,
    marginLeft: 160,
  },
  noActiveText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  challengeHint: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 22,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  miniQuestsContainer: {
    paddingRight: 20,
  },
  miniQuestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginLeft: 15,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  miniQuestIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  miniQuestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  miniQuestCta: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  miniQuestRewardContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  miniQuestReward: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
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
    fontSize: 18,
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
    textAlign: 'center',
    lineHeight: 16,
    overflow: 'hidden',
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
  taskIcon: {
    marginRight: 10,
  },
  dailyTaskText: {
    fontSize: 14,
    color: '#424242',
  },
  completeTaskButton: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 10,
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
});

export default DashboardScreen;
