import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TermsOfServiceScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#0D47A1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Terms of Service</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.subtitle}>Last Updated: April 7, 2025</Text>
      </LinearGradient>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.paragraph}>
            Welcome to FinQuest! These Terms of Service ("Terms") govern your use of the FinQuest app, including all features, content, and services (collectively, the "Service"). By accessing or using FinQuest, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
          </Text>
          
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By creating an account or using FinQuest, you confirm that you are at least 13 years old (or 16 in some jurisdictions) and have the legal capacity to enter into this agreement. If you are using FinQuest on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
          </Text>
          
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            FinQuest is a financial literacy app designed to help users learn about debt management, savings, and budgeting through lessons, quizzes, challenges, and AI-driven insights. Features include:
          </Text>
          <Text style={styles.bulletPoint}>• Educational content (lessons and quizzes).</Text>
          <Text style={styles.bulletPoint}>• Gamified challenges with badges.</Text>
          <Text style={styles.bulletPoint}>• AI-powered financial insights based on user-provided data.</Text>
          <Text style={styles.bulletPoint}>• Financial tracking tools (e.g., debt and savings progress).</Text>
          
          <Text style={styles.sectionTitle}>3. Account Registration</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Account Creation:</Text> You must register an account to access most features. Provide accurate information during registration (e.g., name, email, gender).</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Account Security:</Text> You are responsible for keeping your login credentials confidential and for all activities under your account. Notify us immediately of any unauthorized access at support@finquest.com.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Account Deletion:</Text> You may delete your account at any time via the profile settings. Deletion removes your personal data, subject to our Privacy Policy.</Text>
          
          <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
          <Text style={styles.paragraph}>
            You agree to:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Provide Accurate Data:</Text> Input truthful financial data (e.g., debt balances, income) to ensure accurate insights and recommendations.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Use Lawfully:</Text> Use FinQuest in compliance with all applicable laws and regulations.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Not Misuse:</Text> Do not attempt to hack, reverse-engineer, or interfere with the Service, or use it to harm others (e.g., uploading malicious content).</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Respect Content:</Text> Do not reproduce, distribute, or modify FinQuest's content (e.g., lessons, quizzes) without permission.</Text>
          
          <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Ownership:</Text> FinQuest and its content (e.g., lessons, avatars, badges) are owned by FinQuest Inc. and protected by copyright, trademark, and other laws.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>License:</Text> We grant you a limited, non-exclusive, non-transferable license to use the Service for personal, non-commercial purposes.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>User Content:</Text> You retain ownership of content you provide (e.g., bio, financial data). By submitting content, you grant FinQuest a worldwide, royalty-free license to use, store, and process it to provide the Service (e.g., generating AI insights).</Text>
          
          <Text style={styles.sectionTitle}>6. AI-Driven Insights</Text>
          <Text style={styles.paragraph}>
            FinQuest uses AI to provide financial insights based on your data. You acknowledge that:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>General Guidance:</Text> AI insights are for informational purposes only and do not constitute financial advice. Consult a certified financial advisor for personalized advice.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Third-Party Processing:</Text> Anonymized data may be processed by third-party AI providers (e.g., OpenAI). See our Privacy Policy for details.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Accuracy:</Text> While we strive for accuracy, AI recommendations may not always be correct or suitable for your situation.</Text>
          
          <Text style={styles.sectionTitle}>7. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            FinQuest may integrate with third-party services (e.g., Plaid for bank linking, OpenAI for AI insights). These services are governed by their own terms and privacy policies. FinQuest is not responsible for their performance or practices.
          </Text>
          
          <Text style={styles.sectionTitle}>8. Payments and Subscriptions</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Free Features:</Text> Most FinQuest features are free, including lessons, quizzes, and challenges.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Premium Features (Future):</Text> We may introduce paid features or subscriptions. Pricing and terms will be disclosed at the time of purchase.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Partner Offers:</Text> FinQuest may display promotional offers (e.g., high-yield savings accounts). We are not responsible for third-party products or services.</Text>
          
          <Text style={styles.sectionTitle}>9. Termination</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>By You:</Text> You may stop using FinQuest and delete your account at any time.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>By Us:</Text> We may suspend or terminate your account if you violate these Terms, engage in illegal activity, or for any other reason at our discretion. We will notify you of termination via email.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Effect of Termination:</Text> Upon termination, your access to the Service will cease, and your data will be deleted per our Privacy Policy.</Text>
          
          <Text style={styles.sectionTitle}>10. Disclaimers</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>No Financial Advice:</Text> FinQuest provides general financial education and tools. We are not a financial advisor, and our content (including AI insights) does not constitute financial, legal, or tax advice. Consult a professional for personalized advice.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>As-Is Service:</Text> The Service is provided "as is" without warranties of any kind, express or implied (e.g., fitness for a particular purpose, accuracy).</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Third-Party Links:</Text> We are not responsible for third-party content or services linked from FinQuest.</Text>
          
          <Text style={styles.sectionTitle}>11. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the fullest extent permitted by law, FinQuest and its affiliates, officers, employees, or agents will not be liable for:
          </Text>
          <Text style={styles.bulletPoint}>• Indirect, incidental, or consequential damages (e.g., loss of profits, data, or opportunities) arising from your use of the Service.</Text>
          <Text style={styles.bulletPoint}>• Any decisions you make based on FinQuest's content or AI insights.</Text>
          <Text style={styles.bulletPoint}>• Damages exceeding $100 or the amount you paid to FinQuest in the past 12 months, whichever is greater.</Text>
          
          <Text style={styles.sectionTitle}>12. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to indemnify and hold FinQuest harmless from any claims, losses, or damages (including legal fees) arising from your use of the Service, violation of these Terms, or infringement of third-party rights.
          </Text>
          
          <Text style={styles.sectionTitle}>13. Governing Law and Dispute Resolution</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Governing Law:</Text> These Terms are governed by the laws of the State of California, USA, without regard to conflict of law principles.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Dispute Resolution:</Text> Any disputes arising from these Terms will be resolved through binding arbitration in San Francisco, CA, under the rules of the American Arbitration Association. You waive the right to participate in class actions.</Text>
          
          <Text style={styles.sectionTitle}>14. Changes to These Terms</Text>
          <Text style={styles.paragraph}>
            We may update these Terms to reflect changes in our Service or legal requirements. We will notify you of significant changes via email or in-app notification at least 30 days before they take effect. Your continued use of FinQuest after updates constitutes acceptance of the revised Terms.
          </Text>
          
          <Text style={styles.sectionTitle}>15. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about these Terms, please contact us at:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Email:</Text> support@finquest.com</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Address:</Text> FinQuest Inc., 123 Financial Freedom Lane, Suite 100, San Francisco, CA 94105, USA</Text>
          
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              Thank you for using FinQuest! Let's achieve financial freedom together.
            </Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    marginBottom: 12,
    paddingLeft: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  disclaimer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginBottom: 40,
  },
  disclaimerText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#0D47A1',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TermsOfServiceScreen;
