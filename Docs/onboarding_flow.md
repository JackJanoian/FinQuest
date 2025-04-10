# FinQuest Onboarding Flow Specification

## Overview
FinQuest is a mobile app designed to help users save money and pay off debt through gamified challenges and promotional financial offers. The onboarding flow introduces new users to the app's core features—Challenges, Offers, and Profile pages—while collecting essential data for personalization and ensuring legal compliance. This flow is streamlined to reflect the removal of lessons, quizzes, and AI insights, focusing on simplicity, engagement, and immediate action.

## Objective
The onboarding flow aims to:
- Welcome users and set expectations for FinQuest's purpose: saving money and paying off debt through gamified challenges and exclusive offers.
- Collect essential user data (e.g., name, gender, financial details) to enable personalized challenges and progress tracking on the Profile page.
- Introduce the core features: Challenges, Offers, and Profile pages.
- Ensure legal compliance by obtaining consent for the Privacy Policy and Terms of Service.
- Motivate users to take their first action (e.g., start a challenge, explore offers) to kickstart engagement.

## Target Audience
- New users of FinQuest, likely adults aged 18-45, seeking to save money and pay off debt through actionable challenges and financial offers.
- Users may have varying levels of financial experience but are motivated by gamification and practical tools.

## Onboarding Flow Steps

The onboarding flow consists of 4 steps, implemented in React Native using a navigation stack (e.g., React Navigation). Each step includes content, user interactions, and implementation details.

### Step 1: Welcome Screen
**Purpose:** Introduce FinQuest and set expectations for the user's journey.

- **Content:**
  - **Headline:** "Welcome to FinQuest!"
  - **Subheadline:** "Save money, pay off debt, and achieve financial freedom with gamified challenges and exclusive offers."
  - **Visual:** FinQuest logo or a friendly illustration (e.g., a blue monster holding a piggy bank).
  - **Button:** "Get Started" (primary action button in FinQuest's green color, e.g., `#4CAF50`).
- **User Interaction:**
  - Tap "Get Started" to proceed to the Sign-Up screen.
- **Implementation Notes:**
  - Use a full-screen background with a gradient (e.g., light green to white) for a welcoming vibe.
  - Example React Native component:
    ```jsx
    const WelcomeScreen = ({ navigation }) => (
      <View style={styles.welcomeContainer}>
        <Image source={require('../assets/finquest-logo.png')} style={styles.logo} />
        <Text style={styles.headline}>Welcome to FinQuest!</Text>
        <Text style={styles.subheadline}>
          Save money, pay off debt, and achieve financial freedom with gamified challenges and exclusive offers.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    );

    const styles = StyleSheet.create({
      welcomeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E9' },
      logo: { width: 150, height: 150, marginBottom: 20 },
      headline: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
      subheadline: { fontSize: 16, color: '#666', textAlign: 'center', marginHorizontal: 20 },
      button: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 30 },
      buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
    });
    ```

### Step 2: Sign-Up Screen
**Purpose:** Collect basic user information to create an account and personalize the experience.

- **Content:**
  - **Fields:**
    - Name (text input, required).
    - Email (text input, required, validated for format).
    - Password (secure text input, required, minimum 8 characters).
  - **Legal Consent:**
    - Checkbox: "I agree to the Terms of Service and Privacy Policy" (links to both documents).
    - Must be checked to enable the "Sign Up" button.
  - **Button:** "Sign Up" (disabled until all fields are filled and checkbox is checked).
  - **Alternative:** "Already have an account? Log in" (link to login screen).
- **User Interaction:**
  - Enter name, email, password, and select gender.
  - Check the consent box after reviewing Terms and Privacy Policy.
  - Tap "Sign Up" to create an account and proceed to the Financial Information screen.
- **Implementation Notes:**
  - Gender selection assigns a default avatar (Male Blue Monster for male, Female Blue Monster for female, neutral monster for other).
  - Validate inputs (e.g., email format, password length) before enabling the button.
  - Store user data in the backend (e.g., POST /auth/signup).
  - Example React Native component:
    ```jsx
    const SignUpScreen = ({ navigation }) => {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [gender, setGender] = useState('');
      const [consent, setConsent] = useState(false);
      const isFormValid = name && email && password && gender && consent;

      const handleSignUp = async () => {
        try {
          const response = await fetch('https://api.finquest.com/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, gender }),
          });
          const data = await response.json();
          if (data.success) {
            navigation.navigate('FinancialInfo');
          } else {
            alert('Sign-up failed. Please try again.');
          }
        } catch (error) {
          alert('Error: ' + error.message);
        }
      };

      return (
        <ScrollView style={styles.container}>
          <Text style={styles.header}>Create Your Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
          <View style={styles.consentContainer}>
            <CheckBox value={consent} onValueChange={setConsent} />
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
            disabled={!isFormValid}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
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
      );
    };

    const styles = StyleSheet.create({
      container: { padding: 16 },
      header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
      input: { borderWidth: 1, borderColor: '#CCC', padding: 10, marginBottom: 10, borderRadius: 5 },
      picker: { height: 50, marginBottom: 10 },
      consentContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
      consentText: { marginLeft: 10, fontSize: 14 },
      link: { color: '#2196F3', textDecorationLine: 'underline' },
      button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
      buttonDisabled: { backgroundColor: '#A5D6A7' },
      buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
      loginLink: { textAlign: 'center', marginTop: 20, fontSize: 14 },
    });
    ```

### Step 3: Financial Information Screen
**Purpose:** Collect financial data to enable personalized challenges and progress tracking on the Profile page.

- **Content:**
  - **Headline:** "Let's Set Up Your Financial Goals"
  - **Subheadline:** "Add your financial details to track your progress and unlock personalized challenges. You can skip this for now."
  - **Fields (Optional but Encouraged):**
    - Total Debt (numeric input, e.g., $7,000).
    - Total Savings (numeric input, e.g., $500).
    - Monthly Income (numeric input, e.g., $3,000).
    - Monthly Expenses (numeric input, e.g., $2,800).
  - **Bank Linking Option:** "Link Your Bank Account (Optional)" (via Plaid integration, with a "Learn More" link for privacy details).
  - **Buttons:**
    - "Continue" (proceeds with entered data).
    - "Skip" (navigates to the Feature Tour, with default values or prompts to add later).
- **User Interaction:**
  - Enter financial details or link a bank account for automatic data import.
  - Tap "Continue" to save data and proceed, or "Skip" to move on.
- **Implementation Notes:**
  - Financial data is used for personalizing challenges (e.g., suggesting Debt Payment Quest for high debt) and tracking progress on the Profile page.
  - Save data to the backend (e.g., POST /user/financials).
  - If skipped, prompt users to add financial data later via the Profile page.
  - Example React Native component:
    ```jsx
    const FinancialInfoScreen = ({ navigation }) => {
      const [totalDebt, setTotalDebt] = useState('');
      const [totalSavings, setTotalSavings] = useState('');
      const [income, setIncome] = useState('');
      const [expenses, setExpenses] = useState('');

      const handleContinue = async () => {
        const financialData = { totalDebt, totalSavings, income, expenses };
        try {
          await fetch('https://api.finquest.com/user/financials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(financialData),
          });
          navigation.navigate('FeatureTour');
        } catch (error) {
          alert('Error saving data: ' + error.message);
        }
      };

      return (
        <ScrollView style={styles.container}>
          <Text style={styles.header}>Let's Set Up Your Financial Goals</Text>
          <Text style={styles.subheadline}>
            Add your financial details to track your progress and unlock personalized challenges. You can skip this for now.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Total Debt ($)"
            keyboardType="numeric"
            value={totalDebt}
            onChangeText={setTotalDebt}
          />
          <TextInput
            style={styles.input}
            placeholder="Total Savings ($)"
            keyboardType="numeric"
            value={totalSavings}
            onChangeText={setTotalSavings}
          />
          <TextInput
            style={styles.input}
            placeholder="Monthly Income ($)"
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
          />
          <TextInput
            style={styles.input}
            placeholder="Monthly Expenses ($)"
            keyboardType="numeric"
            value={expenses}
            onChangeText={setExpenses}
          />
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('BankLinkInfo')}
          >
            <Text style={styles.link}>Link Your Bank Account (Optional)</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => navigation.navigate('FeatureTour')}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    };

    const styles = StyleSheet.create({
      container: { padding: 16 },
      header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
      subheadline: { fontSize: 16, color: '#666', marginBottom: 20 },
      input: { borderWidth: 1, borderColor: '#CCC', padding: 10, marginBottom: 10, borderRadius: 5 },
      linkButton: { marginBottom: 20 },
      link: { color: '#2196F3', textDecorationLine: 'underline', fontSize: 14 },
      buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
      button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, flex: 1, marginRight: 10 },
      buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
      skipButton: { padding: 12, flex: 1 },
      skipText: { color: '#666', fontSize: 16, textAlign: 'center' },
    });
    ```

### Step 4: Feature Tour (Interactive Walkthrough)
**Purpose:** Introduce FinQuest's core features to set users up for success.

- **Content:** A carousel-style walkthrough with 3 slides, each highlighting a feature:
  - **Slide 1: Challenges**
    - Headline: "Achieve Goals with Challenges"
    - Description: "Complete quests like saving $10 or paying off debt to earn badges."
    - Visual: Image of a badge (e.g., Debt Slasher).
  - **Slide 2: Offers**
    - Headline: "Discover Financial Offers"
    - Description: "Explore promotions like high-yield savings accounts and balance transfer cards."
    - Visual: Screenshot of an offer (e.g., Ally Bank 4.00% APY).
  - **Slide 3: Profile**
    - Headline: "Track Your Progress"
    - Description: "See your financial progress, earned badges, and manage your account."
    - Visual: Screenshot of the Profile page (e.g., showing debt/savings progress bars).
  - **Navigation:** Dots at the bottom indicate progress (e.g., 1/3, 2/3). "Next" button on slides 1-2, "Let's Begin" on slide 3.
- **User Interaction:**
  - Swipe left/right to navigate slides or tap "Next."
  - Tap "Let's Begin" on the final slide to proceed to the First Action Prompt.
- **Implementation Notes:**
  - Use react-native-swiper for the carousel.
  - Example React Native component:
    ```jsx
    import Swiper from 'react-native-swiper';

    const FeatureTourScreen = ({ navigation }) => (
      <Swiper showsButtons loop={false} nextButton={<Text>Next</Text>} prevButton={<Text>Prev</Text>}>
        <View style={styles.slide}>
          <Text style={styles.slideHeader}>Achieve Goals with Challenges</Text>
          <Text style={styles.slideText}>Complete quests like saving $10 or paying off debt to earn badges.</Text>
          <Image source={require('../assets/badge-screenshot.png')} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Text style={styles.slideHeader}>Discover Financial Offers</Text>
          <Text style={styles.slideText}>Explore promotions like high-yield savings accounts and balance transfer cards.</Text>
          <Image source={require('../assets/offer-screenshot.png')} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Text style={styles.slideHeader}>Track Your Progress</Text>
          <Text style={styles.slideText}>See your financial progress, earned badges, and manage your account.</Text>
          <Image source={require('../assets/profile-screenshot.png')} style={styles.image} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('FirstAction')}
          >
            <Text style={styles.buttonText}>Let's Begin</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    );

    const styles = StyleSheet.create({
      slide: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
      slideHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
      slideText: { fontSize: 16, color: '#666', textAlign: 'center', marginHorizontal: 20 },
      image: { width: 200, height: 200, marginVertical: 20 },
      button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8 },
      buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    });
    ```

### Step 5: First Action Prompt
**Purpose:** Encourage the user to take their first action to engage with FinQuest.

- **Content:**
  - **Headline:** "Ready to Start Your Financial Journey?"
  - **Subheadline:** "Choose an action to begin!"
  - **Options (Buttons):**
    - "Try a Challenge" (navigates to the Challenges screen, suggests "Weekly Savings Quest").
    - "Explore Offers" (navigates to the Offers screen, highlights a high-yield savings account offer).
  - **Footer:** "You can check your progress anytime on your Profile page."
- **User Interaction:**
  - Tap one of the two buttons to navigate to the chosen feature.
- **Implementation Notes:**
  - Example React Native component:
    ```jsx
    const FirstActionScreen = ({ navigation }) => (
      <View style={styles.container}>
        <Text style={styles.header}>Ready to Start Your Financial Journey?</Text>
        <Text style={styles.subheadline}>Choose an action to begin!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Challenges', { quest: 'Weekly Savings Quest' })}
        >
          <Text style={styles.buttonText}>Try a Challenge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Offers')}
        >
          <Text style={styles.buttonText}>Explore Offers</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>
          You can check your progress anytime on your Profile page.
        </Text>
      </View>
    );

    const styles = StyleSheet.create({
      container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
      header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
      subheadline: { fontSize: 16, color: '#666', marginBottom: 20 },
      button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, marginBottom: 10, width: '80%' },
      buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
      footer: { fontSize: 14, color: '#666', marginTop: 20, textAlign: 'center' },
    });
    ```

### Step 6: Navigation to Main App
**Purpose:** Transition the user to the main app experience after their first action.

- **Content:** After completing the first action (e.g., starting a challenge, viewing offers), redirect the user to the Home screen.
- **User Interaction:** Automatic navigation after the action, with a toast notification (e.g., "Great job! Explore more on the Home screen.").
- **Implementation Notes:**
  - Use React Navigation to redirect (e.g., navigation.navigate('Home')).
  - Show a toast using react-native-toast-message for feedback.
  - Example:
    ```jsx
    import Toast from 'react-native-toast-message';

    const handleActionComplete = () => {
      Toast.show({
        type: 'success',
        text1: 'Great job!',
        text2: 'Explore more on the Home screen.',
      });
      navigation.navigate('Home');
    };
    ```

## Additional Considerations

### Personalization
- Use the user's name (e.g., "Welcome, Alex!") and gender-based avatar (Male/Female Blue Monster) throughout the onboarding flow to create a personalized experience.
- If financial data is provided, suggest a relevant challenge (e.g., Debt Payment Quest for users with high debt).

### Progress Tracking
- Show a progress indicator during onboarding (e.g., "Step 2/4") to give users a sense of completion.
- Example: Add dots or a progress bar at the top of each screen using a component like:
  ```jsx
  <View style={styles.progressContainer}>
    {[...Array(4)].map((_, index) => (
      <View
        key={index}
        style={[
          styles.progressDot,
          currentStep > index ? styles.progressDotActive : null,
        ]}
      />
    ))}
  </View>

  const styles = StyleSheet.create({
    progressContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
    progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CCC', marginHorizontal: 4 },
    progressDotActive: { backgroundColor: '#4CAF50' },
  });
  ```

### Gamification
- Award a "Welcome Badge" after completing onboarding to kickstart the gamified experience.
- Example: On the Home screen, show a celebratory animation with "You've earned the Welcome Badge!" using react-native-confetti-cannon.