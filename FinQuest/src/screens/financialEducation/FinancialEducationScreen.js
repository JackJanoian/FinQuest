import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// Lesson card component
const LessonCard = ({ lesson, onPress }) => (
  <TouchableOpacity style={styles.lessonCard} onPress={() => onPress(lesson)}>
    <View style={styles.lessonHeader}>
      <View style={[styles.iconContainer, { backgroundColor: lesson.completed ? '#E8F5E9' : '#E3F2FD' }]}>
        <FontAwesome5 
          name={lesson.icon} 
          size={24} 
          color={lesson.completed ? '#4CAF50' : '#2196F3'} 
        />
      </View>
      <View style={styles.lessonTitleContainer}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonSubtitle}>{lesson.duration} min • {lesson.completed ? 'Completed' : 'Not started'}</Text>
      </View>
      <FontAwesome5 
        name="chevron-right" 
        size={16} 
        color="#BDBDBD" 
      />
    </View>
    
    <Text style={styles.lessonDescription}>{lesson.description}</Text>
    
    {lesson.completed && (
      <View style={styles.completedBadge}>
        <FontAwesome5 name="check-circle" size={16} color="#4CAF50" />
        <Text style={styles.completedText}>Completed</Text>
      </View>
    )}
  </TouchableOpacity>
);

// Quiz card component
const QuizCard = ({ quiz, onPress }) => (
  <TouchableOpacity style={styles.quizCard} onPress={() => onPress(quiz)}>
    <View style={styles.quizHeader}>
      <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
        <FontAwesome5 
          name="question-circle" 
          size={24} 
          color="#FF9800" 
        />
      </View>
      <View style={styles.quizTitleContainer}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <Text style={styles.quizSubtitle}>{quiz.questions} questions • {quiz.points} points</Text>
      </View>
      <FontAwesome5 
        name="chevron-right" 
        size={16} 
        color="#BDBDBD" 
      />
    </View>
    
    <Text style={styles.quizDescription}>{quiz.description}</Text>
    
    {quiz.completed && (
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreText}>{quiz.score}/{quiz.questions}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const FinancialEducationScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('lessons');
  
  // Mock lessons data
  const lessons = [
    {
      id: 1,
      title: 'Budgeting Basics',
      description: 'Learn the fundamentals of creating and maintaining a budget that works for your lifestyle.',
      duration: 10,
      icon: 'calculator',
      completed: true
    },
    {
      id: 2,
      title: 'Debt Management Strategies',
      description: 'Discover effective strategies for paying down debt and becoming debt-free.',
      duration: 15,
      icon: 'credit-card',
      completed: false
    },
    {
      id: 3,
      title: 'Saving for Emergencies',
      description: 'Learn why emergency funds are important and how to build one quickly.',
      duration: 12,
      icon: 'piggy-bank',
      completed: false
    },
    {
      id: 4,
      title: 'Investing for Beginners',
      description: 'Get started with investing with this beginner-friendly introduction.',
      duration: 20,
      icon: 'chart-line',
      completed: false
    },
  ];
  
  // Mock quizzes data
  const quizzes = [
    {
      id: 1,
      title: 'Budgeting Basics Quiz',
      description: 'Test your knowledge of budgeting fundamentals.',
      questions: 5,
      points: 100,
      completed: true,
      score: 4
    },
    {
      id: 2,
      title: 'Debt Management Quiz',
      description: 'See how much you know about effective debt management.',
      questions: 7,
      points: 140,
      completed: false
    },
    {
      id: 3,
      title: 'Emergency Fund Challenge',
      description: 'Test your knowledge about emergency savings.',
      questions: 5,
      points: 100,
      completed: false
    },
  ];
  
  const handleLessonPress = (lesson) => {
    // Navigate to lesson details screen
    console.log('Lesson pressed:', lesson.title);
    // navigation.navigate('LessonDetails', { lesson });
    
    // For now, just show an alert
    alert(`Opening lesson: ${lesson.title}`);
  };
  
  const handleQuizPress = (quiz) => {
    // Navigate to quiz screen
    console.log('Quiz pressed:', quiz.title);
    // navigation.navigate('QuizScreen', { quiz });
    
    // For now, just show an alert
    alert(`Opening quiz: ${quiz.title}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Financial Education</Text>
      </View>
      
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Learn & Grow</Text>
        <Text style={styles.screenSubtitle}>Improve your financial knowledge</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'lessons' && styles.activeTabButton]}
          onPress={() => setActiveTab('lessons')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'lessons' && styles.activeTabButtonText]}>Lessons</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'quizzes' && styles.activeTabButton]}
          onPress={() => setActiveTab('quizzes')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'quizzes' && styles.activeTabButtonText]}>Quizzes</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'lessons' ? (
          <>
            <Text style={styles.sectionTitle}>Available Lessons</Text>
            {lessons.map(lesson => (
              <LessonCard 
                key={lesson.id}
                lesson={lesson}
                onPress={handleLessonPress}
              />
            ))}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Available Quizzes</Text>
            {quizzes.map(quiz => (
              <QuizCard 
                key={quiz.id}
                quiz={quiz}
                onPress={handleQuizPress}
              />
            ))}
          </>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBar: {
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  screenSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  activeTabButtonText: {
    color: '#2196F3',
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
  },
  lessonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lessonTitleContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  lessonSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  completedText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 5,
    fontWeight: '500',
  },
  quizCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quizTitleContainer: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  quizSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  quizDescription: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  scoreText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
  },
  spacer: {
    height: 40,
  },
});

export default FinancialEducationScreen;
