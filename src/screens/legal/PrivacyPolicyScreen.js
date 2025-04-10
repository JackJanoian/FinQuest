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

const PrivacyPolicyScreen = ({ navigation }) => {
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
          <Text style={styles.title}>Privacy Policy</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.subtitle}>Last Updated: April 7, 2025</Text>
      </LinearGradient>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.paragraph}>
            At FinQuest, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and safeguard your data when you use the FinQuest app. By using FinQuest, you agree to the practices described in this policy.
          </Text>
          
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect the following types of information to provide and improve our services:
          </Text>
          
          <Text style={styles.subsectionTitle}>1.1 Information You Provide</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Account Information:</Text> When you register, we collect your name, email address, and gender (to assign a default avatar). You may also provide a bio or financial goals.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Financial Data:</Text> You may input financial details such as debt balances, interest rates, savings amounts, income, and expenses to use features like AI-driven insights and financial tracking.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>User-Generated Content:</Text> Information you provide through lessons, quizzes, challenges, or other interactions (e.g., quiz answers, quest progress).</Text>
          
          <Text style={styles.subsectionTitle}>1.2 Information We Collect Automatically</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Usage Data:</Text> We collect data about how you use the app, such as pages visited, features used (e.g., lessons completed), and time spent in the app.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Device Information:</Text> We collect device details like your device type, operating system, IP address, and unique device identifiers.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Analytics Data:</Text> We use analytics tools to track app performance and user behavior (e.g., crash reports, feature usage).</Text>
          
          <Text style={styles.subsectionTitle}>1.3 Information from Third Parties</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Bank Account Data (Optional):</Text> If you link your bank accounts via third-party services (e.g., Plaid), we may collect financial data like account balances and transaction history, with your explicit consent.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Third-Party Analytics:</Text> We may receive aggregated data from analytics providers to improve our services.</Text>
          
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your information to provide, improve, and personalize FinQuest's services, including:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Service Delivery:</Text> To enable features like financial tracking, AI insights, lessons, quizzes, and challenges.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Personalization:</Text> To tailor recommendations, such as suggesting relevant quests or lessons based on your financial data.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Improvement:</Text> To analyze usage patterns and enhance app functionality (e.g., fixing bugs, optimizing features).</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Communication:</Text> To send you notifications, updates, or promotional offers (e.g., new lessons or partner offers). You can opt out of marketing communications.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Security:</Text> To protect against fraud, unauthorized access, or other illegal activities.</Text>
          
          <Text style={styles.sectionTitle}>3. How We Share Your Information</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information. We may share your data in the following cases:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Service Providers:</Text> With trusted third-party providers who assist with app operations (e.g., cloud hosting, analytics, payment processing). These providers are bound by confidentiality agreements.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>AI Processing:</Text> If you use the AI-driven insights feature, anonymized financial data may be sent to third-party AI providers (e.g., OpenAI) to generate recommendations. We remove identifiable information before sharing.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Legal Requirements:</Text> If required by law, regulation, or legal process (e.g., court order), we may disclose your information to authorities.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Business Transfers:</Text> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity, with notice to you.</Text>
          
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We take reasonable measures to protect your information, including:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Encryption:</Text> Sensitive data (e.g., financial details) is encrypted in transit (HTTPS, TLS) and at rest (AES-256).</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Access Controls:</Text> Only authorized personnel can access your data, under strict confidentiality.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Regular Audits:</Text> We conduct security audits to identify and address vulnerabilities.</Text>
          <Text style={styles.paragraph}>
            However, no system is 100% secure, and we cannot guarantee absolute security. You are responsible for keeping your login credentials confidential.
          </Text>
          
          <Text style={styles.sectionTitle}>5. Your Choices and Rights</Text>
          <Text style={styles.paragraph}>
            You have control over your data:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Access and Update:</Text> You can view and update your profile information (e.g., bio, financial data) in the app.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Data Deletion:</Text> You can delete your account via the profile settings, which removes all personal data from our systems (except as required by law).</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Opt-Out:</Text> You can opt out of marketing emails or push notifications in the app settings.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Data Sharing:</Text> You can toggle data sharing for analytics in the Privacy & Security settings.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Regional Rights:</Text> Depending on your location (e.g., GDPR for EU users, CCPA for California residents), you may have rights to access, correct, or delete your data, or restrict processing. Contact us to exercise these rights.</Text>
          
          <Text style={styles.sectionTitle}>6. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            FinQuest may integrate with third-party services (e.g., Plaid for bank linking, OpenAI for AI insights). These services have their own privacy policies, and we are not responsible for their practices. We encourage you to review their policies before using these features.
          </Text>
          
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            FinQuest is not intended for users under 13 years of age (or 16 in some jurisdictions). We do not knowingly collect data from children. If we learn that a child's data has been collected, we will delete it immediately.
          </Text>
          
          <Text style={styles.sectionTitle}>8. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your data for as long as your account is active or as needed to provide services. If you delete your account, we will remove your personal data within 30 days, except for data required for legal or auditing purposes (e.g., transaction records).
          </Text>
          
          <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            FinQuest operates globally, and your data may be transferred to and processed in countries other than your own (e.g., the United States). We ensure these transfers comply with applicable laws (e.g., GDPR's Standard Contractual Clauses).
          </Text>
          
          <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or in-app notification. Your continued use of FinQuest after updates constitutes acceptance of the revised policy.
          </Text>
          
          <Text style={styles.sectionTitle}>11. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions, concerns, or requests regarding your privacy, please contact us at:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Email:</Text> privacy@finquest.com</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Address:</Text> FinQuest Inc., 123 Financial Freedom Lane, Suite 100, San Francisco, CA 94105, USA</Text>
          
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              <Text style={styles.boldText}>Disclaimer:</Text> FinQuest provides general financial guidance. We are not a financial advisor. Consult a certified financial advisor for personalized advice.
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
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: 16,
    marginBottom: 8,
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
    fontSize: 14,
    lineHeight: 20,
    color: '#0D47A1',
    fontStyle: 'italic',
  },
});

export default PrivacyPolicyScreen;
