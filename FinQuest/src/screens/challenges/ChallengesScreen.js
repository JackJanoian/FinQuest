import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  SafeAreaView,
  Dimensions,
  Image,
  TextInput,
  Animated,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { PiggyBank, CreditCard, Wallet, TrendingUp, Award, Plus } from 'lucide-react-native';
import BadgeIcons from '../../components/BadgeIcons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFinancialData } from '../../context/FinancialDataContext';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.92;

const ChallengeCard = ({ title, description, reward, progress, duration, active, onPress }) => (
  <TouchableOpacity 
    style={styles.challengeCardContainer} 
    onPress={onPress}
    activeOpacity={0.9}
  >
    <LinearGradient
      colors={active ? ['#1565C0', '#42A5F5'] : ['#546E7A', '#78909C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.challengeCard, active ? styles.activeChallenge : {}]}
    >
      {active && (
        <View style={styles.activeBadge}>
          <LinearGradient
            colors={progress === 100 ? ['#4CAF50', '#81C784'] : ['#FFC107', '#FFD54F']}
            style={styles.activeBadgeGradient}
          >
            <Text style={styles.activeBadgeText}>{progress === 100 ? 'COMPLETED' : 'ACTIVE'}</Text>
          </LinearGradient>
        </View>
      )}
      <Text style={styles.challengeTitle}>{title}</Text>
      <Text style={styles.challengeDescription}>{description}</Text>
      
      {progress > 0 && (
        <View style={styles.progressContainer}>
          <LinearGradient
            colors={['#42A5F5', '#64B5F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBar, { width: `${progress}%` }]}
          />
          <Text style={styles.progressText}>{progress}% complete</Text>
        </View>
      )}
      
      <View style={styles.challengeFooter}>
        <Text style={styles.challengeDuration}>{duration}</Text>
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardLabel}>Reward:</Text>
          <Text style={styles.rewardValue}>{reward}</Text>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const BadgeItem = ({ name, description, earned, iconType, onPress, featured, special }) => (
  <TouchableOpacity 
    style={styles.badgeItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.badgeImageContainer}>
      {earned ? (
        <LinearGradient
          colors={['#E3F2FD', '#BBDEFB']}
          style={[
            styles.badgeImage, 
            { borderWidth: 2, borderColor: '#1A237E' }
          ]}
        >
          <View style={styles.badgeIconContainer}>
            {BadgeIcons[iconType] ? BadgeIcons[iconType]() : <Text style={styles.badgeEmoji}>?</Text>}
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={['#BDBDBD', '#E0E0E0']}
          style={[styles.badgeImage, styles.lockedBadge]}
        >
          <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.8)" style={styles.lockIcon} />
        </LinearGradient>
      )}
      {/* All badge bubble indicators removed for cleaner UI */}
    </View>
    <Text style={[
      styles.badgeName, 
      !earned && styles.unearnedText
    ]}>{name}</Text>
  </TouchableOpacity>
);

const BadgeDetailModal = ({ visible, badge, onClose, challenges }) => {
  const selectedBadge = badge;
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animatable.View style={styles.modalContent} animation="bounceInUp" duration={1000}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#757575" />
          </TouchableOpacity>
          
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.badgeModalContainer}>
              <LinearGradient
                colors={['#E3F2FD', '#BBDEFB']}
                style={[
                  styles.badgeModalImage, 
                  { borderWidth: 2, borderColor: '#1A237E' }
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <View style={styles.badgeIconContainerModal}>
                  {BadgeIcons[selectedBadge?.iconType] ? BadgeIcons[selectedBadge?.iconType]() : <Text style={styles.badgeEmoji}>?</Text>}
                </View>
              </LinearGradient>
              
              <Text style={styles.badgeModalName}>{selectedBadge?.name}</Text>
            </View>
            
            <View style={styles.badgeDetailSection}>
              <Text style={styles.badgeDetailTitle}>Badge Details</Text>
              <View style={styles.badgeDetailContent}>
                <Text style={styles.modalDescription}>{selectedBadge?.description}</Text>
                
                <View style={styles.questInfoContainer}>
                  <Text style={styles.questCategoryTitle}>Category: {selectedBadge?.questCategory}</Text>
                  <Text style={styles.questNameTitle}>{selectedBadge?.questName}</Text>
                  <View style={styles.questTaskContainer}>
                    <Text style={styles.questTaskLabel}>Task:</Text>
                    <Text style={styles.questTaskDescription}>{selectedBadge?.questTask}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={onClose}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animatable.View>
      </View>
    </Modal>
  );
};

// Badge Earned Congratulatory Modal
const BadgeEarnedModal = ({ visible, badge, onClose, xpEarned }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animatable.View 
          style={styles.badgeEarnedContainer} 
          animation="zoomIn" 
          duration={800}
          useNativeDriver
        >
          {/* Add exit button in the left corner */}
          <TouchableOpacity style={styles.exitButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#757575" />
          </TouchableOpacity>
          
          <Animatable.View 
            animation="pulse" 
            iterationCount="infinite" 
            duration={2000}
            useNativeDriver
            style={styles.badgeEarnedIconContainer}
          >
            <LinearGradient
              colors={['#E3F2FD', '#BBDEFB']}
              style={styles.badgeEarnedImage}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <View style={styles.badgeIconContainerEarned}>
                {BadgeIcons[badge?.iconType] ? BadgeIcons[badge?.iconType]() : <Text style={styles.badgeEmoji}>?</Text>}
              </View>
            </LinearGradient>
          </Animatable.View>
          
          <Animatable.Text 
            style={styles.congratsText}
            animation="fadeIn"
            delay={300}
            useNativeDriver
          >
            Congratulations!
          </Animatable.Text>
          
          <Animatable.Text 
            style={styles.badgeEarnedTitle}
            animation="fadeIn"
            delay={600}
            useNativeDriver
          >
            You've earned the {badge?.name} Badge
          </Animatable.Text>
          
          <Animatable.Text 
            style={styles.badgeEarnedDescription}
            animation="fadeIn"
            delay={900}
            useNativeDriver
          >
            {badge?.description}
          </Animatable.Text>
          
          <Animatable.View
            style={styles.xpEarnedContainer}
            animation="fadeIn"
            delay={1200}
            useNativeDriver
          >
            <Text style={styles.xpEarnedText}>+{xpEarned} XP</Text>
          </Animatable.View>
          
          <Animatable.View
            animation="fadeIn"
            delay={1500}
            useNativeDriver
          >
            <TouchableOpacity 
              style={[
                styles.claimBadgeButton, 
                { backgroundColor: '#1A237E' }
              ]}
              onPress={onClose}
            >
              <Text style={styles.claimBadgeButtonText}>Claim Badge</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const ChallengeDetailModal = ({ visible, challenge, onClose, badges, onCompleteQuest, onAcceptChallenge }) => {
  // Add null check for challenge
  if (!challenge) {
    return null; // Return null if challenge is null
  }

  const relatedBadge = badges.find(badge => 
    badge.questName === challenge?.title || 
    badge.name === challenge?.reward.split(' + ')[1]?.replace(' Badge', '')
  );
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.questModalContent}>
          {/* Exit button positioned at the top left */}
          <TouchableOpacity style={styles.exitButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#757575" />
          </TouchableOpacity>
          
          {/* Added padding to the top of the header to move title down */}
          <View style={[styles.questModalHeader, { paddingTop: 20 }]}>
            <Text style={[styles.questModalTitle, { color: '#1565C0' }]}>{challenge?.title}</Text>
            {challenge?.progress === 100 && (
              <View style={styles.completedCircle}>
                <Ionicons name="checkmark" size={28} color="white" />
              </View>
            )}
          </View>
          
          <View style={styles.questDetailsContainer}>
            <Text style={styles.questDetailsTitle}>Quest Details</Text>
            
            <Text style={styles.questDescription}>{challenge?.description}</Text>
            
            <View style={styles.questRewardContainer}>
              <Text style={styles.questRewardLabel}>Reward: </Text>
              <Text style={[styles.questRewardValue, { color: '#4CAF50' }]}>{challenge?.reward}</Text>
            </View>
            
            {relatedBadge && (
              <View style={styles.questBadgeInfoBox}>
                <View style={styles.questBadgeImageContainer}>
                  <LinearGradient
                    colors={['#E3F2FD', '#BBDEFB']}
                    style={[
                      styles.questBadgeImage, 
                      { borderWidth: 2, borderColor: '#1A237E' }
                    ]}
                  >
                    <View style={styles.questBadgeIconContainer}>
                      {BadgeIcons[relatedBadge.iconType] ? 
                        BadgeIcons[relatedBadge.iconType]() : 
                        <Text>?</Text>
                      }
                    </View>
                  </LinearGradient>
                </View>
                
                <View style={styles.questBadgeTextContainer}>
                  <Text style={[styles.questBadgeName, { color: '#1565C0' }]}>{relatedBadge.name}</Text>
                  <Text style={styles.questBadgeDescription}>
                    {relatedBadge.description}
                  </Text>
                </View>
              </View>
            )}
            
            {!(relatedBadge && relatedBadge.earned) && (
              <TouchableOpacity 
                style={[
                  styles.continueQuestButton,
                  { backgroundColor: '#1565C0' }
                ]}
                onPress={() => {
                  // If quest is not complete, just close the modal
                  if (challenge?.progress < 100) {
                    onClose();
                    return;
                  }
                  
                  // If quest is complete and has a related badge, show the badge earned modal
                  if (relatedBadge) {
                    // Extract XP from the reward text (e.g., "50 XP + Badge Name")
                    const xpMatch = challenge.reward.match(/(\d+)\s*XP/i);
                    const xpEarned = xpMatch ? parseInt(xpMatch[1]) : 50; // Default to 50 if not found
                    
                    onCompleteQuest(challenge, relatedBadge, xpEarned);
                  } else {
                    onClose();
                  }
                }}
              >
                <Text style={styles.continueQuestButtonText}>
                  {challenge?.progress === 100 ? 'Claim Reward' : 'Continue Quest'}
                </Text>
              </TouchableOpacity>
            )}
            
            {(relatedBadge && relatedBadge.earned) && (
              <View style={[styles.alreadyClaimedContainer, { backgroundColor: '#1565C0' }]}>
                <Text style={styles.alreadyClaimedText}>
                  Reward already claimed
                </Text>
              </View>
            )}
            
            {!challenge.active && (
              <TouchableOpacity 
                style={[
                  styles.acceptChallengeButton,
                  { backgroundColor: '#1565C0' }
                ]}
                onPress={() => onAcceptChallenge(challenge.id)}
              >
                <Text style={styles.acceptChallengeButtonText}>
                  Accept Challenge
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ChallengesScreen = () => {
  // Badge and Quest data
  const badgesData = [
    {
      id: 1,
      name: 'Micro-Saver',
      iconType: 'microSaver',
      earned: true,
      description: "Awarded for saving $10 in a week, proving small cuts lead to big gains.",
      questTask: "Save $10/week by cutting one unnecessary expense.",
      questName: "Weekly Savings Quest",
      questCategory: "Savings Quests",
      special: 'savings',
      lastEarned: null, // Track when the badge was last earned
      weeklyReset: true // Flag to indicate this badge can be earned weekly
    },
    {
      id: 2,
      name: 'Safety Net Starter',
      iconType: 'safetyNetStarter',
      earned: true,
      description: "Earned by saving $50 for emergencies, preparing for life's surprises.",
      questTask: "Save $50/month towards emergency fund.",
      questName: "Emergency Fund Quest",
      questCategory: "Savings Quests",
      special: 'emergency'
    },
    {
      id: 3,
      name: 'Auto-Saver',
      iconType: 'autoSaver',
      earned: false,
      description: "Given for automating savings, building wealth without thinking.",
      questTask: "Automate $5 weekly transfer to savings.",
      questName: "Savings Automation Quest",
      questCategory: "Savings Quests",
      special: 'automation'
    },
    {
      id: 4,
      name: 'Goal Getter',
      iconType: 'goalGetter',
      earned: false,
      description: "Awarded for hitting a savings goal, achieving financial focus.",
      questTask: "Set and achieve a short-term savings goal in 30 days.",
      questName: "Savings Goal Quest",
      questCategory: "Savings Quests",
      special: 'savings'
    },
    {
      id: 5,
      name: 'Budget Beginner',
      iconType: 'budgetBeginner',
      earned: true,
      description: "Earned by budgeting for a week, laying financial foundations.",
      questTask: "Create and follow a budget for 7 days.",
      questName: "Budget Starter Quest",
      questCategory: "Budgeting Quests",
      special: 'budget-beginner'
    },
    {
      id: 6,
      name: 'Spending Sleuth',
      iconType: 'spendingSleuth',
      earned: false,
      description: "Given for tracking expenses daily, revealing hidden savings.",
      questTask: "Log all expenses for 5 consecutive days.",
      questName: "Expense Tracker Quest",
      questCategory: "Budgeting Quests",
      special: 'tracker'
    },
    {
      id: 7,
      name: 'Spending Freeze',
      iconType: 'spendingFreeze',
      earned: true,
      description: "Awarded for mastering spending restraint.",
      questTask: "Complete 3 no-spend days in one week.",
      questName: "No-Spend Day Quest",
      questCategory: "Budgeting Quests",
      special: 'freeze'
    },
    {
      id: 8,
      name: 'Debt Slasher',
      iconType: 'debtSlasher',
      earned: false,
      description: "Given for striking debt.",
      questTask: "Extra $25 payment toward debt.",
      questName: "Debt Payment Quest",
      questCategory: "Debt Management Quests",
      special: 'debt-payment'
    },
    {
      id: 9,
      name: 'Snowball Starter',
      iconType: 'snowballStarter',
      earned: true,
      description: "Earned by gaining momentum toward freedom.",
      questTask: "Pay off smallest debt balance under $500.",
      questName: "Debt Snowball Quest",
      questCategory: "Debt Management Quests",
      special: 'debt-snowball'
    },
    {
      id: 10,
      name: 'Card Crusher',
      iconType: 'cardCrusher',
      earned: false,
      description: "Awarded for tackling credit card debt.",
      questTask: "Pay above minimum for 2 consecutive months.",
      questName: "Credit Card Payoff Quest",
      questCategory: "Debt Management Quests",
      special: 'card-crusher'
    },
    {
      id: 11,
      name: 'Avalanche Attacker',
      iconType: 'avalancheAttacker',
      earned: false,
      description: "Earned by optimizing debt repayment.",
      questTask: "Extra $50 payment on highest-interest debt.",
      questName: "Debt Avalanche Quest",
      questCategory: "Debt Management Quests",
      special: 'debt-avalanche'
    },
    {
      id: 12,
      name: 'Freedom Fighter',
      iconType: 'freedomFighter',
      earned: false,
      description: "Advancing toward debt-free living.",
      questTask: "Pay off an entire debt account.",
      questName: "Debt-Free Milestone Quest",
      questCategory: "Debt Management Quests",
      special: 'debt-free'
    },
    {
      id: 13,
      name: 'Savings Milestone',
      iconType: 'savingsSuperstar',
      earned: false,
      description: "Achieved a significant savings milestone on your financial journey.",
      questTask: "Reach $1,000 in your savings account.",
      questName: "Savings Milestone Quest",
      questCategory: "Savings Quests",
      special: 'savings-milestone'
    },
    {
      id: 14,
      name: 'Debt Free Milestone',
      iconType: 'debtFreeMilestone',
      earned: false,
      description: "Successfully paid off a significant debt, moving closer to financial freedom.",
      questTask: "Pay off a debt account with a balance of at least $1,000.",
      questName: "Debt Free Milestone Quest",
      questCategory: "Debt Management Quests",
      special: 'debt-free-milestone'
    },
    {
      id: 15,
      name: 'Financial Mastery',
      iconType: 'financialMaster',
      earned: false,
      description: "Demonstrated exceptional financial knowledge and discipline across multiple areas.",
      questTask: "Complete quests in savings, budgeting, and debt management categories.",
      questName: "Financial Mastery Quest",
      questCategory: "Milestone Quests",
      special: 'financial-mastery'
    },
    {
      id: 16,
      name: 'Debt Demolisher',
      iconType: 'debtDemolisher',
      earned: false,
      description: "Aggressively reduced debt through consistent extra payments.",
      questTask: "Make extra payments totaling $500 across all debts in one month.",
      questName: "Debt Demolisher Quest",
      questCategory: "Debt Management Quests",
      special: 'debt-demolisher'
    }
  ];

  const challengesData = [
    // Savings Quests
    { 
      id: 1, 
      title: badgesData[0].questName, 
      description: badgesData[0].questTask, 
      reward: '50 XP + Micro-Saver Badge', 
      progress: 0, 
      duration: '7 days',
      active: false,
      category: 'savings',
      weeklyReset: true, // Flag to indicate this challenge resets weekly
      lastCompleted: null // Track when the challenge was last completed
    },
    { 
      id: 2, 
      title: badgesData[1].questName, 
      description: badgesData[1].questTask, 
      reward: '75 XP + Safety Net Starter Badge', 
      progress: 0, 
      duration: '3 days',
      active: false,
      category: 'savings',
      priority: 'high',
      special: 'emergency'
    },
    { 
      id: 3, 
      title: badgesData[2].questName, 
      description: badgesData[2].questTask, 
      reward: '60 XP + Auto-Saver Badge', 
      progress: 0, 
      duration: '2 days',
      active: false,
      category: 'savings',
      priority: 'high'
    },
    
    // Budgeting Quests
    { 
      id: 5, 
      title: badgesData[4].questName, 
      description: badgesData[4].questTask, 
      reward: '50 XP + Budget Beginner Badge', 
      progress: 0, 
      duration: '2 days',
      active: false,
      category: 'budgeting',
      special: 'budget-beginner'
    },
    { 
      id: 6, 
      title: badgesData[5].questName, 
      description: badgesData[5].questTask, 
      reward: '40 XP + Spending Sleuth Badge', 
      progress: 0, 
      duration: '3 days',
      active: false,
      category: 'budgeting',
      special: 'tracker'
    },
    
    // Debt Management Quests
    { 
      id: 10, 
      title: badgesData[7].questName, 
      description: badgesData[7].questTask, 
      reward: '50 XP + Debt Destroyer Badge', 
      progress: 0, 
      duration: '9 days',
      active: false,
      category: 'debt',
      special: 'debt-payment'
    },
    { 
      id: 11, 
      title: badgesData[8].questName, 
      description: badgesData[8].questTask, 
      reward: '75 XP + Debt Snowballer Badge', 
      progress: 0, 
      duration: '12 days',
      active: false,
      category: 'debt',
      special: 'debt-snowball'
    },
    { 
      id: 12, 
      title: badgesData[9].questName, 
      description: badgesData[9].questTask, 
      reward: '75 XP + Debt Avalanche Badge', 
      progress: 0, 
      duration: '18 days',
      active: false,
      category: 'debt',
      special: 'debt-avalanche'
    },
    { 
      id: 13, 
      title: badgesData[10].questName, 
      description: badgesData[10].questTask, 
      reward: '100 XP + Debt-Free Milestone Badge', 
      progress: 0, 
      duration: '3 days',
      active: false,
      category: 'debt',
      special: 'debt-free',
      featured: true
    },
    { 
      id: 14, 
      title: badgesData[11].questName, 
      description: badgesData[11].questTask, 
      reward: '60 XP + Card Crusher Badge', 
      progress: 0, 
      duration: '10 days',
      active: false,
      category: 'debt',
      special: 'card-crusher'
    },
    
    // Milestone Quests
    { 
      id: 17, 
      title: badgesData[12].questName, 
      description: badgesData[12].questTask, 
      reward: '100 XP + Savings Milestone Badge', 
      progress: 0, 
      duration: '30 days',
      active: false,
      category: 'savings',
      priority: 'medium',
      special: 'savings-milestone'
    },
    { 
      id: 18, 
      title: badgesData[13].questName, 
      description: badgesData[13].questTask, 
      reward: '150 XP + Debt Free Milestone Badge', 
      progress: 0, 
      duration: 'Ongoing',
      active: false,
      category: 'debt',
      priority: 'high',
      special: 'debt-free-milestone'
    },
    { 
      id: 19, 
      title: badgesData[14].questName, 
      description: badgesData[14].questTask, 
      reward: '200 XP + Financial Mastery Badge', 
      progress: 0, 
      duration: 'Ongoing',
      active: false,
      category: 'milestone',
      priority: 'high',
      special: 'financial-mastery',
      featured: true
    },
    { 
      id: 20, 
      title: badgesData[15].questName, 
      description: badgesData[15].questTask, 
      reward: '125 XP + Debt Demolisher Badge', 
      progress: 0, 
      duration: '25 days',
      active: false,
      category: 'debt',
      priority: 'medium',
      special: 'debt-demolisher'
    },
  ];

  const [challenges, setChallenges] = useState(challengesData);

  const [badges, setBadges] = useState(badgesData);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState('quests');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  const [badgeEarnedModalVisible, setBadgeEarnedModalVisible] = useState(false);
  const [createQuestModalVisible, setCreateQuestModalVisible] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    category: 'savings',
    duration: '7 days',
  });
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get totalXP from FinancialDataContext
  const { totalXP, addXP } = useFinancialData();

  // Add a function to check if a weekly challenge is ready to be reset
  const isWeeklyChallengeResetReady = (lastCompletedDate) => {
    if (!lastCompletedDate) return true;
    
    const now = new Date();
    const lastCompleted = new Date(lastCompletedDate);
    
    // Calculate the difference in days
    const diffTime = Math.abs(now - lastCompleted);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Reset if it's been 7 or more days since last completion
    return diffDays >= 7;
  };

  // Add useEffect to check for weekly challenge resets
  useEffect(() => {
    const loadChallengesData = async () => {
      try {
        // Load challenges from AsyncStorage
        const storedChallenges = await AsyncStorage.getItem(`challenges`);
        if (storedChallenges) {
          setChallenges(JSON.parse(storedChallenges));
        } else {
          // For new users, initialize with empty active challenges
          // They will need to manually accept challenges
          const initialChallenges = challengesData.map(template => ({
            ...template,
            active: false,
            progress: 0,
            lastUpdated: new Date().toISOString()
          }));
          setChallenges(initialChallenges);
          await AsyncStorage.setItem(`challenges`, JSON.stringify(initialChallenges));
        }
        
        // Load badges from AsyncStorage
        const storedBadges = await AsyncStorage.getItem(`badges`);
        if (storedBadges) {
          setBadges(JSON.parse(storedBadges));
        } else {
          // For new users, initialize with all badges as not earned
          const initialBadges = badgesData.map(template => ({
            ...template,
            earned: false,
            dateEarned: null
          }));
          setBadges(initialBadges);
          await AsyncStorage.setItem(`badges`, JSON.stringify(initialBadges));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading challenges data:', error);
        setLoading(false);
      }
    };
    
    loadChallengesData();
  }, []);

  // Function to check and reset weekly challenges
  const checkWeeklyChallengeResets = () => {
    // Check if any weekly challenges need to be reset
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.weeklyReset && challenge.lastCompleted) {
        // Check if it's been at least 7 days since the challenge was completed
        if (isWeeklyChallengeResetReady(challenge.lastCompleted)) {
          // Reset the challenge
          return {
            ...challenge,
            progress: 0,
            duration: '7 days',
            lastCompleted: null
          };
        }
      }
      return challenge;
    });

    // Check if any weekly badges need to be reset
    const updatedBadges = badges.map(badge => {
      if (badge.weeklyReset && badge.lastEarned) {
        // Check if it's been at least 7 days since the badge was earned
        if (isWeeklyChallengeResetReady(badge.lastEarned)) {
          // Reset the badge earned status
          return {
            ...badge,
            earned: false,
            lastEarned: null
          };
        }
      }
      return badge;
    });

    // Update state if changes were made
    if (JSON.stringify(updatedChallenges) !== JSON.stringify(challenges)) {
      setChallenges(updatedChallenges);
    }
    
    if (JSON.stringify(updatedBadges) !== JSON.stringify(badges)) {
      setBadges(updatedBadges);
    }
  };

  // Filter active challenges
  const activeQuests = challenges.filter(challenge => challenge.active);
  
  // Count earned badges
  const earnedBadges = badges.filter(badge => badge.earned);
  
  // Filter challenges by category
  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.category === selectedCategory);

  const handleChallengePress = (challenge) => {
    setSelectedChallenge(challenge);
    setChallengeModalVisible(true);
  };

  const handleBadgePress = (badge) => {
    setSelectedBadge(badge);
    setBadgeModalVisible(true);
  };

  const handleCompleteQuest = (challenge, badge, xpEarned) => {
    console.log('Completing quest:', challenge.title);
    console.log('XP to be earned:', xpEarned);
    
    // Update challenge progress
    setChallenges(prevChallenges => {
      const updatedChallenges = prevChallenges.map(c => {
        if (c.id === challenge.id) {
          return {
            ...c,
            progress: 100,
            completed: true
          };
        }
        return c;
      });
      
      // Save to AsyncStorage
      AsyncStorage.setItem('challenges', JSON.stringify(updatedChallenges));
      
      return updatedChallenges;
    });
    
    // Award XP to the user
    addXP(xpEarned);
    console.log('XP awarded:', xpEarned);
    
    // Check if a badge should be earned
    if (badge && !badge.earned) {
      setBadges(prevBadges => {
        const updatedBadges = prevBadges.map(b => {
          if (b.id === badge.id) {
            return {
              ...b,
              earned: true,
              dateEarned: new Date().toISOString()
            };
          }
          return b;
        });
        
        // Save to AsyncStorage
        AsyncStorage.setItem('badges', JSON.stringify(updatedBadges));
        
        return updatedBadges;
      });
      
      // Show badge earned modal
      setSelectedBadge(badge);
      setBadgeEarnedModalVisible(true);
    } else {
      // Just show a completion alert
      Alert.alert(
        "Quest Completed!",
        `Congratulations! You've completed the ${challenge.title} quest and earned ${xpEarned} XP!`,
        [{ text: "Awesome!" }]
      );
      setSelectedChallenge(null); // Close challenge detail modal
    }
  };

  const handleBadgeEarned = (badge, xpEarned) => {
    setSelectedBadge(badge);
    setBadgeEarnedModalVisible(true);
  };

  const handleAcceptChallenge = (challengeId) => {
    setChallenges(prevChallenges => {
      const updatedChallenges = prevChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            active: true,
            startDate: new Date().toISOString()
          };
        }
        return challenge;
      });
      
      // Save to AsyncStorage
      AsyncStorage.setItem(`challenges`, JSON.stringify(updatedChallenges));
      
      return updatedChallenges;
    });
    
    // Close the modal
    setSelectedChallenge(null);
    
    // Show confirmation
    Alert.alert(
      "Challenge Accepted!",
      "You've started a new challenge. Complete it to earn XP and badges!",
      [{ text: "Let's Go!" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1565C0', '#0D47A1']}
        style={styles.header}
      >
        <Text style={styles.title}>Quests & Challenges</Text>
        <Text style={styles.subtitle}>Complete quests to earn rewards</Text>
      </LinearGradient>
      
      {/* Stats Container */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#FFFFFF', '#F5F7FA']}
          style={styles.statsGradient}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{earnedBadges.length}</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{activeQuests.length}</Text>
            <Text style={styles.statLabel}>Active Quests</Text>
          </View>
        </LinearGradient>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Quests/Badges Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'quests' && styles.activeTabButton]} 
            onPress={() => setSelectedTab('quests')}
          >
            <TrendingUp size={20} color={selectedTab === 'quests' ? '#000' : '#757575'} />
            <Text style={[styles.tabButtonText, selectedTab === 'quests' && styles.activeTabText]}>Quests</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'badges' && styles.activeTabButton]} 
            onPress={() => setSelectedTab('badges')}
          >
            <Award size={20} color={selectedTab === 'badges' ? '#000' : '#757575'} />
            <Text style={[styles.tabButtonText, selectedTab === 'badges' && styles.activeTabText]}>Badges</Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'quests' ? (
          <>
            {/* Category Filters */}
            <View style={styles.categoryFiltersContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categoryButtonsContainer}
              >
                <TouchableOpacity 
                  style={[styles.categoryFilterButton, selectedCategory === 'all' && styles.activeCategoryButton]} 
                  onPress={() => setSelectedCategory('all')}
                >
                  <Text style={[styles.categoryFilterText, selectedCategory === 'all' && styles.activeCategoryText]}>
                    All Quests
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.categoryFilterButton, selectedCategory === 'savings' && styles.activeCategoryButton]} 
                  onPress={() => setSelectedCategory('savings')}
                >
                  <PiggyBank size={18} color={selectedCategory === 'savings' ? '#fff' : '#000'} />
                  <Text style={[styles.categoryFilterText, selectedCategory === 'savings' && styles.activeCategoryText]}>
                    Savings
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.categoryFilterButton, selectedCategory === 'debt' && styles.activeCategoryButton]} 
                  onPress={() => setSelectedCategory('debt')}
                >
                  <CreditCard size={18} color={selectedCategory === 'debt' ? '#fff' : '#000'} />
                  <Text style={[styles.categoryFilterText, selectedCategory === 'debt' && styles.activeCategoryText]}>
                    Debt
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.categoryFilterButton, selectedCategory === 'budgeting' && styles.activeCategoryButton]} 
                  onPress={() => setSelectedCategory('budgeting')}
                >
                  <Wallet size={18} color={selectedCategory === 'budgeting' ? '#fff' : '#000'} />
                  <Text style={[styles.categoryFilterText, selectedCategory === 'budgeting' && styles.activeCategoryText]}>
                    Budget
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Create Custom Quest Button */}
            <TouchableOpacity 
              style={styles.createCustomQuestButton}
              onPress={() => setCreateQuestModalVisible(true)}
            >
              <LinearGradient
                colors={['#1565C0', '#0D47A1']}
                style={styles.createCustomQuestGradient}
              >
                <View style={styles.createCustomQuestContent}>
                  <Plus size={20} color="#fff" />
                  <Text style={styles.createCustomQuestText}>Create Custom Quest</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Active Quests Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Quests</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{activeQuests.length}</Text>
              </View>
            </View>

            {/* Challenges List */}
            <View style={styles.challengesContainer}>
              {filteredChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  reward={challenge.reward}
                  progress={challenge.progress}
                  duration={challenge.duration}
                  active={challenge.active}
                  onPress={() => handleChallengePress(challenge)}
                />
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Badges</Text>
            <View style={styles.badgesContainer}>
              {badges.map(badge => (
                <BadgeItem
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  earned={badge.earned}
                  iconType={badge.iconType}
                  onPress={() => handleBadgePress(badge)}
                  featured={badge.featured}
                  special={badge.special}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Challenge Detail Modal */}
      <ChallengeDetailModal 
        visible={challengeModalVisible} 
        challenge={selectedChallenge} 
        onClose={() => setChallengeModalVisible(false)} 
        badges={badges}
        onCompleteQuest={(challenge, badge, xpEarned) => {
          handleCompleteQuest(challenge, badge, xpEarned);
        }}
        onAcceptChallenge={handleAcceptChallenge}
      />

      {/* Badge Detail Modal */}
      <BadgeDetailModal 
        visible={badgeModalVisible} 
        badge={selectedBadge} 
        onClose={() => setBadgeModalVisible(false)} 
        challenges={challenges}
      />

      {/* Badge Earned Modal */}
      <BadgeEarnedModal 
        visible={badgeEarnedModalVisible} 
        badge={selectedBadge} 
        onClose={() => setBadgeEarnedModalVisible(false)} 
        xpEarned={selectedChallenge ? 
          parseInt(selectedChallenge.reward.match(/(\d+)\s*XP/i)?.[1] || "50") : 50}
      />

      {/* Create Custom Quest Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createQuestModalVisible}
        onRequestClose={() => setCreateQuestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.customQuestContainer}>
            <Text style={styles.customQuestTitle}>Create Custom Quest</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Quest Title"
              placeholderTextColor="#B0BEC5"
              value={newQuest.title}
              onChangeText={(text) => setNewQuest({...newQuest, title: text})}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Description"
              placeholderTextColor="#B0BEC5"
              multiline
              value={newQuest.description}
              onChangeText={(text) => setNewQuest({...newQuest, description: text})}
            />
            <Text style={styles.categoryLabel}>Category</Text>
            <TouchableOpacity 
              style={styles.categoryDropdown}
              onPress={() => setShowCategoryOptions(!showCategoryOptions)}
            >
              <Text style={styles.selectedCategoryText}>
                {newQuest.category.charAt(0).toUpperCase() + newQuest.category.slice(1)}
              </Text>
              <Ionicons name={showCategoryOptions ? "chevron-up" : "chevron-down"} size={24} color="#2196F3" />
            </TouchableOpacity>
            
            {showCategoryOptions && (
              <View style={styles.dropdownOptions}>
                <TouchableOpacity 
                  style={[
                    styles.dropdownOption,
                    newQuest.category === 'savings' && styles.dropdownOptionSelected
                  ]} 
                  onPress={() => {
                    setNewQuest({...newQuest, category: 'savings'});
                    setShowCategoryOptions(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    newQuest.category === 'savings' && styles.dropdownOptionTextSelected
                  ]}>Savings</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.dropdownOption,
                    newQuest.category === 'debt' && styles.dropdownOptionSelected
                  ]} 
                  onPress={() => {
                    setNewQuest({...newQuest, category: 'debt'});
                    setShowCategoryOptions(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    newQuest.category === 'debt' && styles.dropdownOptionTextSelected
                  ]}>Debt</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.dropdownOption,
                    newQuest.category === 'budgeting' && styles.dropdownOptionSelected
                  ]} 
                  onPress={() => {
                    setNewQuest({...newQuest, category: 'budgeting'});
                    setShowCategoryOptions(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    newQuest.category === 'budgeting' && styles.dropdownOptionTextSelected
                  ]}>Budgeting</Text>
                </TouchableOpacity>
              </View>
            )}
            <TextInput
              style={styles.inputField}
              placeholder="Duration (days)"
              placeholderTextColor="#B0BEC5"
              keyboardType="numeric"
              value={newQuest.duration}
              onChangeText={(text) => setNewQuest({...newQuest, duration: text})}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCreateQuestModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={() => {
                const newChallenge = {
                  id: challenges.length + 1,
                  title: newQuest.title,
                  description: newQuest.description,
                  reward: '75 XP + Custom Badge',
                  progress: 0,
                  duration: newQuest.duration,
                  active: false,
                  category: newQuest.category,
                };
                setChallenges([...challenges, newChallenge]);
                setNewQuest({
                  title: '',
                  description: '',
                  category: 'savings',
                  duration: '7 days',
                });
                setCreateQuestModalVisible(false);
              }}>
                <LinearGradient
                  colors={['#1976D2', '#0D47A1']}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>Create Quest</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
  statsContainer: {
    marginTop: -20,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGradient: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginHorizontal: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#757575',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  categoryFiltersContainer: {
    marginVertical: 10,
  },
  categoryButtonsContainer: {
    paddingHorizontal: 15,
  },
  categoryFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
  },
  activeCategoryButton: {
    backgroundColor: '#000',
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  createCustomQuestButton: {
    marginHorizontal: 15,
    marginVertical: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  createCustomQuestGradient: {
    width: '100%',
    paddingVertical: 15,
  },
  createCustomQuestContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createCustomQuestText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 10,
  },
  countBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  countBadgeText: {
    color: '#1565C0',
    fontWeight: '600',
    fontSize: 14,
  },
  challengesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  challengeCardContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeCard: {
    padding: 15,
    borderRadius: 12,
  },
  activeChallenge: {
    borderWidth: 0,
  },
  activeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activeBadgeGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#212121',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    marginRight: 60, // Make space for the badge
  },
  challengeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 4,
  },
  rewardValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  badgeItem: {
    alignItems: 'center',
    marginBottom: 20,
    width: 90,
    marginHorizontal: 8, // Add horizontal margin for spacing between badges
  },
  badgeImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  badgeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  badgeGlowOuter: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 1,
  },
  automationGlowOuter: {
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
  },
  freezeGlowOuter: {
    backgroundColor: 'rgba(0, 188, 212, 0.15)',
  },
  emergencyGlowOuter: {
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
  },
  trackerGlowOuter: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  debtPaymentGlowOuter: {
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
  },
  debtSnowballGlowOuter: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  debtAvalancheGlowOuter: {
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
  },
  debtFreeGlowOuter: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
  },
  cardCrusherGlowOuter: {
    backgroundColor: 'rgba(156, 39, 176, 0.15)',
  },
  budgetBeginnerGlowOuter: {
    backgroundColor: 'rgba(63, 81, 181, 0.15)',
  },
  savingsSuperstarGlowOuter: {
    backgroundColor: 'rgba(255, 87, 34, 0.15)',
  },
  financialMasterGlowOuter: {
    backgroundColor: 'rgba(139, 195, 74, 0.15)',
  },
  debtDemolisherGlowOuter: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
  },
  automationGearContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  automationGear: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  freezeEffectContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 3,
  },
  freezeCrystal: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  freezeBadgeIndicator: {
    backgroundColor: '#00BCD4',
  },
  freezeBadgeName: {
    color: '#0097A7',
    fontWeight: 'bold',
  },
  freezeAchievementText: {
    color: '#0097A7',
  },
  freezeInfoContainer: {
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    padding: 15,
  },
  freezeInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0097A7',
    marginBottom: 10,
    textAlign: 'center',
  },
  freezeCalendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  freezeCalendarDay: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#B2EBF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  freezeCalendarDayComplete: {
    backgroundColor: '#00BCD4',
  },
  freezeCalendarDayText: {
    fontSize: 12,
    color: '#0097A7',
  },
  freezeCalendarDayTextComplete: {
    color: 'white',
    fontWeight: 'bold',
  },
  freezeSavingsContainer: {
    marginTop: 10,
  },
  freezeSavingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  freezeSavingsLabel: {
    fontSize: 13,
    color: '#424242',
  },
  freezeSavingsValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0097A7',
  },
  
  masterAchievementContainer: {
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    padding: 15,
  },
  masterAchievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#689F38',
    marginBottom: 10,
    textAlign: 'center',
  },
  masterAchievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  masterAchievementBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8BC34A',
    marginRight: 8,
  },
  masterAchievementText: {
    fontSize: 14,
    color: '#424242',
  },
  debtDemolisherContainer: {
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
  },
  debtDemolisherTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 10,
    textAlign: 'center',
  },
  debtDemolisherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  debtDemolisherBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
    marginRight: 8,
  },
  debtDemolisherText: {
    fontSize: 14,
    color: '#424242',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalScrollView: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 5,
  },
  badgeModalContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  badgeModalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeIconContainerModal: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeModalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ACC1',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badgeDetailSection: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    margin: 15,
    marginTop: 0,
  },
  badgeDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
    textAlign: 'center',
  },
  badgeDetailContent: {
    alignItems: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  questInfoContainer: {
    width: '100%',
    marginTop: 10,
  },
  questCategoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 10,
  },
  questNameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ACC1',
    marginBottom: 20,
  },
  questTaskContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  questTaskLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#757575',
    marginRight: 8,
  },
  questTaskDescription: {
    fontSize: 20,
    color: '#424242',
    flex: 1,
    lineHeight: 28,
  },
  closeModalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
    marginVertical: 20,
    minWidth: 150,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  badgeName: {
    fontSize: 12, // Reduce font size from 14 to 12
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    color: '#00ACC1',
    width: '100%',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unearnedText: {
    color: '#9E9E9E',
    fontWeight: 'normal',
  },
  questInfoContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  questCategoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 5,
  },
  questNameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ACC1',
    marginBottom: 10,
  },
  questTaskContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  questTaskLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
    marginRight: 5,
  },
  questTaskDescription: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
  },
  // Challenge Detail Modal Styles
  questModalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  exitButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 5,
  },
  questModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20, // Add padding to the top of the header
  },
  questModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ACC1',
  },
  completedCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  questProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  questCompletionStatus: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 20,
  },
  questDetailsContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    margin: 15,
    marginTop: 0,
  },
  questDetailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
    textAlign: 'center',
  },
  questDescription: {
    fontSize: 18,
    color: '#424242',
    marginBottom: 20,
    lineHeight: 26,
  },
  questRewardContainer: {
    flexDirection: 'column',
    marginBottom: 25,
  },
  questRewardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    marginBottom: 5,
  },
  questRewardValue: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  questBadgeInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  questBadgeImageContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  questBadgeImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  questBadgeIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questBadgeTextContainer: {
    flex: 1,
  },
  questBadgeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ACC1',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questBadgeDescription: {
    fontSize: 16,
    color: '#616161',
    lineHeight: 22,
  },
  continueQuestButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  continueQuestButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lockIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }], // Center the icon
  },
  customQuestContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    width: '90%',
    position: 'relative',
  },
  customQuestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
  },
  inputField: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#424242',
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  categoryDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1976D2',
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  selectedCategoryText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownOptions: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  dropdownOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownOptionSelected: {
    backgroundColor: '#E3F2FD',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#424242',
  },
  dropdownOptionTextSelected: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#757575',
    fontWeight: 'bold',
  },
  createButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  badgeEarnedContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    width: '90%',
    position: 'relative',
  },
  badgeEarnedIconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeEarnedImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  badgeIconContainerEarned: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  badgeEarnedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00ACC1',
    marginBottom: 10,
  },
  badgeEarnedDescription: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 20,
    textAlign: 'center',
  },
  xpEarnedContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  xpEarnedText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  claimBadgeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 10,
    minWidth: 150,
  },
  claimBadgeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alreadyClaimedContainer: {
    backgroundColor: '#1565C0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  alreadyClaimedText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  acceptChallengeButton: {
    backgroundColor: '#1565C0',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  acceptChallengeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChallengesScreen;
