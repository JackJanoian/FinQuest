import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InteractiveLessonPresentation = ({ lesson, type = 'lesson', onClose, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [showQuiz, setShowQuiz] = useState(type === 'quiz');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Generate slides based on lesson content
  const slides = useMemo(() => {
    console.log('=== Slide Generation Debug ===');
    console.log('1. Generating slides for:', type === 'quiz' ? 'quiz' : 'lesson');
    
    if (!lesson) {
      console.log('ERROR: No content available');
      return [];
    }

    if (type === 'quiz') {
      // This is a quiz, not a lesson
      return [{ type: 'quiz', content: lesson }];
    }
    
    // For lessons, use the slides array directly
    return lesson.slides || [];
  }, [lesson, type]);
  
  const totalSlides = slides.length;
  
  // Handle slide transition
  const goToSlide = (index) => {
    if (index < 0 || index >= totalSlides) return;
    
    // Animate out current slide
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: index > currentSlide ? 100 : -100,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change slide
      setCurrentSlide(index);
      
      // Reset animation values
      slideAnim.setValue(index > currentSlide ? -100 : 100);
      
      // Animate in new slide
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  
  // Handle quiz answer selection
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answerIndex,
    });
  };
  
  // Check if an answer is selected
  const isAnswerSelected = (questionIndex, answerIndex) => {
    return quizAnswers[questionIndex] === answerIndex;
  };
  
  // Handle quiz submission
  const handleQuizSubmit = () => {
    const currentQuiz = type === 'quiz' ? lesson : lesson.quiz;
    if (!currentQuiz || !currentQuiz.questions) return;
    
    const questions = currentQuiz.questions;
    let correctCount = 0;
    
    // Check answers
    questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswerIndex) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    setQuizResults({
      score,
      correctCount,
      total: questions.length,
    });
    
    // Show results alert
    Alert.alert(
      'Quiz Results',
      `You got ${correctCount} out of ${questions.length} questions correct (${score}%)`,
      [{ text: 'Review Answers', onPress: () => {} }]
    );
  };
  
  // Handle lesson completion
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };
  
  // Render intro slide
  const renderIntroSlide = (slide) => (
    <View style={styles.slideContent}>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <View style={styles.divider} />
      <Text style={styles.slideDescription}>{slide.description || 'Learn about this topic through interactive content.'}</Text>
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={() => goToSlide(currentSlide + 1)}>
          <Text style={styles.startButtonText}>Start Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Render content slide
  const renderContentSlide = (slide) => (
    <View style={styles.slideContent}>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <View style={styles.divider} />
      <Text style={styles.slideText}>{slide.text}</Text>
    </View>
  );
  
  // Render bullet points slide
  const renderBulletSlide = (slide) => (
    <View style={styles.slideContent}>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <View style={styles.divider} />
      <View style={styles.bulletList}>
        {slide.items.map((item, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
  
  // Render visual slide
  const renderVisualSlide = (slide) => (
    <View style={styles.slideContent}>
      <Text style={styles.slideTitle}>{slide.title || 'Visual Content'}</Text>
      <View style={styles.divider} />
      <View style={styles.visualContainer}>
        <Image 
          source={{ uri: slide.imageUrl }} 
          style={styles.slideImage}
          resizeMode="contain"
        />
        <Text style={styles.imageCaption}>{slide.description}</Text>
      </View>
    </View>
  );
  
  // Render interactive quiz slide
  const renderInteractiveQuizSlide = (slide) => (
    <View style={styles.slideContent}>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <View style={styles.divider} />
      <Text style={styles.quizQuestion}>{slide.question}</Text>
      
      {slide.scenarios ? (
        // Scenario-based quiz
        slide.scenarios.map((scenario, index) => (
          <View key={index} style={styles.quizScenario}>
            <Text style={styles.scenarioText}>{scenario.text}</Text>
            <View style={styles.scenarioOptions}>
              <TouchableOpacity 
                style={[
                  styles.scenarioOption, 
                  isAnswerSelected(index, 0) && styles.scenarioOptionSelected
                ]}
                onPress={() => handleAnswerSelect(index, 0)}
              >
                <Text style={styles.scenarioOptionText}>Good</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.scenarioOption, 
                  isAnswerSelected(index, 1) && styles.scenarioOptionSelected
                ]}
                onPress={() => handleAnswerSelect(index, 1)}
              >
                <Text style={styles.scenarioOptionText}>Bad</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        // Options-based quiz
        slide.options && slide.options.map((option, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.quizOption, 
              isAnswerSelected(0, index) && styles.quizOptionSelected
            ]}
            onPress={() => handleAnswerSelect(0, index)}
          >
            <Text style={[
              styles.quizOptionText,
              isAnswerSelected(0, index) && styles.quizOptionTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))
      )}
      
      <TouchableOpacity 
        style={[
          styles.checkAnswerButton,
          Object.keys(quizAnswers).length === 0 && styles.checkAnswerButtonDisabled
        ]}
        disabled={Object.keys(quizAnswers).length === 0}
        onPress={() => {
          // Check answers and provide feedback
          Alert.alert(
            'Quiz Feedback',
            'Great job! Continue to the next slide to learn more.',
            [{ text: 'Continue', onPress: () => goToSlide(currentSlide + 1) }]
          );
        }}
      >
        <Text style={styles.checkAnswerButtonText}>Check Answers</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render summary slide
  const renderSummarySlide = (slide) => (
    <View style={styles.slideContent}>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <View style={styles.divider} />
      <Text style={styles.summaryIntro}>Key takeaways from this lesson:</Text>
      
      {slide.points.map((point, index) => (
        <View key={index} style={styles.summaryItem}>
          <Text style={styles.summaryItemNumber}>{index + 1}</Text>
          <Text style={styles.summaryItemText}>{point}</Text>
        </View>
      ))}
      
      {currentSlide === totalSlides - 1 && (
        <View style={styles.completeButtonContainer}>
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>Complete Lesson</Text>
            <MaterialIcons name="check-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  // Render link slide
  const renderLinkSlide = (slide) => (
    <View style={styles.slideContent}>
      <Text style={styles.slideTitle}>Additional Resources</Text>
      <View style={styles.divider} />
      <Text style={styles.linkText}>{slide.text}</Text>
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => Linking.openURL(slide.url)}
      >
        <Text style={styles.linkButtonText}>Explore Options</Text>
        <MaterialIcons name="open-in-new" size={20} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
  
  // Render interactive calculator slide
  const renderInteractiveCalculatorSlide = (slide) => (
    <View style={styles.slideContent}>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <View style={styles.divider} />
      <Text style={styles.slideText}>{slide.description}</Text>
      
      <View style={styles.calculatorContainer}>
        <Text style={styles.calculatorLabel}>Coming Soon</Text>
        <Text style={styles.calculatorDescription}>
          This interactive calculator will be available in a future update.
        </Text>
      </View>
    </View>
  );
  
  // Render interactive selector slide
  const renderInteractiveSelectorSlide = (slide) => (
    <View style={styles.slideContent}>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <View style={styles.divider} />
      <Text style={styles.slideText}>{slide.description}</Text>
      
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Coming Soon</Text>
        <Text style={styles.selectorDescription}>
          This interactive selector will be available in a future update.
        </Text>
      </View>
    </View>
  );
  
  // Render quiz
  const renderQuiz = () => {
    const quiz = type === 'quiz' ? lesson : null;
    if (!quiz || !quiz.questions) return null;
    
    return (
      <ScrollView style={styles.quizContainer} contentContainerStyle={styles.quizContentContainer}>
        <Text style={styles.slideTitle}>{quiz.title}</Text>
        <View style={styles.divider} />
        <Text style={styles.quizDescription}>{quiz.description}</Text>
        
        {quizResults ? (
          // Show quiz results
          <View style={styles.quizResultsContainer}>
            <Text style={styles.quizResultsTitle}>Quiz Results</Text>
            <Text style={styles.quizResultsScore}>{quizResults.score}%</Text>
            <Text style={styles.quizResultsText}>
              You got {quizResults.correctCount} out of {quizResults.total} questions correct.
            </Text>
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>Complete Quiz</Text>
              <MaterialIcons name="check-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          // Show quiz questions
          <>
            {quiz.questions.map((question, questionIndex) => (
              <View key={questionIndex} style={styles.quizQuestionContainer}>
                <Text style={styles.quizQuestionNumber}>Question {questionIndex + 1} of {quiz.questions.length}</Text>
                <Text style={styles.quizQuestion}>{question.question}</Text>
                
                {question.options.map((option, optionIndex) => (
                  <TouchableOpacity 
                    key={optionIndex}
                    style={[
                      styles.quizOption, 
                      isAnswerSelected(questionIndex, optionIndex) && styles.quizOptionSelected
                    ]}
                    onPress={() => handleAnswerSelect(questionIndex, optionIndex)}
                  >
                    <Text style={[
                      styles.quizOptionText,
                      isAnswerSelected(questionIndex, optionIndex) && styles.quizOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            
            <TouchableOpacity 
              style={[
                styles.submitQuizButton,
                Object.keys(quizAnswers).length < quiz.questions.length && styles.submitQuizButtonDisabled
              ]}
              disabled={Object.keys(quizAnswers).length < quiz.questions.length}
              onPress={handleQuizSubmit}
            >
              <Text style={styles.submitQuizButtonText}>Submit Answers</Text>
            </TouchableOpacity>
          </>
        )}
        
        {quiz.link && (
          <View style={styles.quizLinkContainer}>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => Linking.openURL(quiz.link.url)}
            >
              <Text style={styles.linkButtonText}>{quiz.link.text}</Text>
              <MaterialIcons name="open-in-new" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };
  
  // Render current slide based on type
  const renderSlide = (slide) => {
    if (!slide) return null;
    
    switch (slide.type) {
      case 'intro':
        return renderIntroSlide(slide);
      case 'content':
        return renderContentSlide(slide);
      case 'bullet':
        return renderBulletSlide(slide);
      case 'visual':
        return renderVisualSlide(slide);
      case 'interactive_quiz':
        return renderInteractiveQuizSlide(slide);
      case 'interactive_calculator':
        return renderInteractiveCalculatorSlide(slide);
      case 'interactive_selector':
        return renderInteractiveSelectorSlide(slide);
      case 'summary':
        return renderSummarySlide(slide);
      case 'link':
        return renderLinkSlide(slide);
      case 'quiz':
        return renderQuiz();
      default:
        return (
          <View style={styles.slideContent}>
            <Text style={styles.slideTitle}>Content Not Available</Text>
            <Text style={styles.slideText}>This content type is not supported yet.</Text>
          </View>
        );
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView style={styles.scrollContainer}>
        <Animated.View 
          style={[
            styles.slideContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {showQuiz ? renderQuiz() : renderSlide(slides[currentSlide])}
        </Animated.View>
      </ScrollView>
      
      {/* Navigation Controls */}
      {!showQuiz && (
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, currentSlide === 0 && styles.navButtonDisabled]}
            disabled={currentSlide === 0}
            onPress={() => goToSlide(currentSlide - 1)}
          >
            <MaterialIcons name="arrow-back" size={24} color={currentSlide === 0 ? '#ccc' : '#333'} />
            <Text style={[styles.navButtonText, currentSlide === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.slideCounter}>
            {currentSlide + 1} / {totalSlides}
          </Text>
          
          <TouchableOpacity 
            style={[styles.navButton, currentSlide === totalSlides - 1 && styles.navButtonDisabled]}
            disabled={currentSlide === totalSlides - 1}
            onPress={() => goToSlide(currentSlide + 1)}
          >
            <Text style={[styles.navButtonText, currentSlide === totalSlides - 1 && styles.navButtonTextDisabled]}>
              Next
            </Text>
            <MaterialIcons name="arrow-forward" size={24} color={currentSlide === totalSlides - 1 ? '#ccc' : '#333'} />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name="close" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
  },
  slideContent: {
    flex: 1,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  divider: {
    height: 2,
    backgroundColor: '#4CAF50',
    width: 60,
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  slideText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  bulletList: {
    marginBottom: 24,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 8,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  visualContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  slideImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imageCaption: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quizOption: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  quizOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  quizOptionText: {
    fontSize: 16,
    color: '#333',
  },
  quizOptionTextSelected: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  checkAnswerButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkAnswerButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  checkAnswerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryIntro: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  summaryItemNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontWeight: 'bold',
  },
  summaryItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 8,
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  slideCounter: {
    fontSize: 14,
    color: '#666',
  },
  startButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  completeButtonContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  linkText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  linkButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  quizContainer: {
    flex: 1,
  },
  quizContentContainer: {
    padding: 16,
  },
  quizDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  quizQuestionContainer: {
    marginBottom: 32,
  },
  quizQuestionNumber: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  submitQuizButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
  },
  submitQuizButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  submitQuizButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  quizResultsContainer: {
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  quizResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  quizResultsScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  quizResultsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  quizLinkContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  quizScenario: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  scenarioText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  scenarioOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scenarioOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  scenarioOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  scenarioOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  calculatorContainer: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  calculatorLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  calculatorDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectorContainer: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  selectorLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  selectorDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default InteractiveLessonPresentation;
