import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFinancialData } from '../../context/FinancialDataContext';

const { width } = Dimensions.get('window');

const QuestDetailScreen = ({ route }) => {
  const { quest } = route.params;
  const navigation = useNavigation();
  const { addXP } = useFinancialData();
  
  const handleCompleteQuest = () => {
    // In a real app, we would verify if the quest is actually completed
    // For now, we'll just simulate completion
    Alert.alert(
      "Quest Completed!",
      `Congratulations! You've completed the ${quest.title} quest and earned ${quest.reward} XP!`,
      [
        { 
          text: "Claim Reward", 
          onPress: () => {
            addXP(quest.reward);
            navigation.goBack();
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#0D47A1']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quest Details</Text>
        <View style={styles.placeholderView} />
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        <View style={styles.questCard}>
          <View style={styles.questHeader}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{quest.difficulty}</Text>
            </View>
          </View>
          
          <Text style={styles.questDescription}>{quest.description}</Text>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Progress</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${quest.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{quest.progress}%</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Deadline</Text>
              <Text style={styles.detailValue}>{quest.deadline}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Reward</Text>
              <Text style={styles.detailValue}>{quest.reward} XP</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompleteQuest}
          >
            <LinearGradient
              colors={['#4CAF50', '#388E3C']}
              style={styles.completeButtonGradient}
            >
              <Text style={styles.completeButtonText}>Complete Quest</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips to Complete</Text>
          <View style={styles.tipItem}>
            <Ionicons name="bulb-outline" size={20} color="#FFC107" />
            <Text style={styles.tipText}>Break down your goal into smaller steps</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="calendar-outline" size={20} color="#FFC107" />
            <Text style={styles.tipText}>Set reminders to make regular progress</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="trending-up-outline" size={20} color="#FFC107" />
            <Text style={styles.tipText}>Track your progress to stay motivated</Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholderView: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0',
    flex: 1,
  },
  difficultyBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  questDescription: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 20,
    lineHeight: 24,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'right',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
  },
  detailValue: {
    fontSize: 14,
    color: '#424242',
    fontWeight: 'bold',
  },
  completeButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#424242',
    marginLeft: 10,
    flex: 1,
  },
});

export default QuestDetailScreen;
