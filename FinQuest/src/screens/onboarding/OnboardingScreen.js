import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path, Circle, G, Rect } from 'react-native-svg';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

// SVG Components for onboarding illustrations
const WelcomeIllustration = () => (
  <Svg width={width * 0.7} height={width * 0.7} viewBox="0 0 200 200">
    <Circle cx="100" cy="100" r="90" fill="#E3F2FD" />
    <Circle cx="100" cy="100" r="70" fill="#BBDEFB" />
    <Circle cx="100" cy="100" r="50" fill="#90CAF9" />
    <Circle cx="100" cy="100" r="30" fill="#64B5F6" />
    <Circle cx="100" cy="100" r="15" fill="#2196F3" />
    <G transform="translate(70, 70)">
      <Path d="M30 0L60 60H0L30 0Z" fill="#1976D2" />
    </G>
  </Svg>
);

const DebtIllustration = () => (
  <Svg width={width * 0.7} height={width * 0.7} viewBox="0 0 200 200">
    <Rect x="40" y="80" width="120" height="80" rx="10" fill="#E3F2FD" />
    <Circle cx="70" cy="70" r="30" fill="#64B5F6" />
    <Path d="M70 50 L70 90 M60 60 L80 80 M60 80 L80 60" stroke="#1976D2" strokeWidth="4" />
    <Path d="M100 110 L140 110 M100 130 L130 130" stroke="#1976D2" strokeWidth="4" />
    <Path d="M50 110 L90 110 M50 130 L80 130" stroke="#90CAF9" strokeWidth="4" />
  </Svg>
);

const SavingsIllustration = () => (
  <Svg width={width * 0.7} height={width * 0.7} viewBox="0 0 200 200">
    <Path d="M50 120 C50 80 150 80 150 120 L150 160 L50 160 Z" fill="#E3F2FD" />
    <Circle cx="100" cy="90" r="40" fill="#BBDEFB" />
    <Rect x="90" y="50" width="20" height="10" fill="#64B5F6" />
    <Path d="M60 140 L140 140" stroke="#1976D2" strokeWidth="4" />
    <Circle cx="80" cy="110" r="5" fill="#1976D2" />
    <Circle cx="120" cy="110" r="5" fill="#1976D2" />
    <Path d="M90 125 C90 135 110 135 110 125" stroke="#1976D2" strokeWidth="3" fill="none" />
  </Svg>
);

const LearnIllustration = () => (
  <Svg width={width * 0.7} height={width * 0.7} viewBox="0 0 200 200">
    <Rect x="40" y="60" width="120" height="100" rx="5" fill="#E3F2FD" />
    <Rect x="50" y="70" width="100" height="20" rx="2" fill="#BBDEFB" />
    <Rect x="50" y="100" width="100" height="10" rx="2" fill="#90CAF9" />
    <Rect x="50" y="120" width="80" height="10" rx="2" fill="#90CAF9" />
    <Rect x="50" y="140" width="60" height="10" rx="2" fill="#90CAF9" />
    <Circle cx="160" cy="50" r="20" fill="#2196F3" />
    <Path d="M150 50 L170 50 M160 40 L160 60" stroke="white" strokeWidth="4" />
  </Svg>
);

// Onboarding data with screen content
const onboardingData = [
  {
    id: '1',
    title: 'Welcome to FinQuest',
    description: 'Your journey to financial freedom starts here. Track, save, and learn about money in a fun way!',
    illustration: <WelcomeIllustration />,
    isGetStarted: true,
  },
  {
    id: '2',
    title: 'Track Your Debts',
    description: 'Visualize your debts as monsters that shrink as you pay them off. Conquer your financial challenges!',
    illustration: <DebtIllustration />,
  },
  {
    id: '3',
    title: 'Save With Goals',
    description: 'Set savings goals and watch your piggy bank fill up as you make progress. Every dollar counts!',
    illustration: <SavingsIllustration />,
  },
  {
    id: '4',
    title: 'Learn & Earn',
    description: 'Complete financial education lessons and earn rewards. Knowledge is power and money!',
    illustration: <LearnIllustration />,
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();
  const navigation = useNavigation();
  const { completeOnboarding } = useAuth();

  useEffect(() => {
    console.log('[OnboardingScreen] OnboardingScreen mounted');
    return () => {
      console.log('[OnboardingScreen] OnboardingScreen unmounted');
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      console.log(`[OnboardingScreen] Moving to slide ${currentIndex + 1}`);
      setCurrentIndex(currentIndex + 1);
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      console.log('[OnboardingScreen] Onboarding completed, calling completeOnboarding()');
      completeOnboarding().then(result => {
        console.log('[OnboardingScreen] completeOnboarding result:', result);
        console.log('[OnboardingScreen] Navigating to Login after completing onboarding');
        navigation.replace('Login');
      });
    }
  };

  const handleSkip = () => {
    console.log('[OnboardingScreen] Onboarding skipped, calling completeOnboarding()');
    completeOnboarding().then(result => {
      console.log('[OnboardingScreen] completeOnboarding result after skip:', result);
      console.log('[OnboardingScreen] Navigating to Login after skipping onboarding');
      navigation.replace('Login');
    });
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      console.log('[OnboardingScreen] Slide changed to:', viewableItems[0].index);
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          {item.isGetStarted ? (
            <View style={styles.welcomeContainer}>
              <Image 
                source={require('../../../assets/icon.png')} 
                style={styles.largeLogoImage} 
              />
              <View style={styles.illustrationContainer}>
                {item.illustration}
              </View>
            </View>
          ) : (
            <View style={styles.illustrationContainer}>
              {item.illustration}
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentIndex ? '#2196F3' : '#E0E0E0' },
              ]}
            />
          ))}
        </View>

        {currentIndex < onboardingData.length - 1 ? (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.getStartedButton} onPress={handleNext}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  console.log('[OnboardingScreen] Rendering OnboardingScreen');

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      {renderPagination()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeLogoImage: {
    width: width * 0.8, 
    height: width * 0.8,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2196F3',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#757575',
    lineHeight: 24,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#757575',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  getStartedButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 25,
  },
  getStartedButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
