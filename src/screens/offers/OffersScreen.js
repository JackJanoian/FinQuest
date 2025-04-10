import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Linking,
  Alert,
  Clipboard
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Offer Card Component
const OfferCard = ({ title, subtitle, description, benefits, icon, color, onLearnMore }) => (
  <View style={styles.offerCard}>
    <View style={styles.offerHeader}>
      <View style={[styles.offerIconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={styles.offerTitleContainer}>
        <Text style={styles.offerTitle}>{title}</Text>
        <Text style={styles.offerSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Text style={styles.offerDescription}>{description}</Text>
    
    {benefits && benefits.length > 0 && (
      <View style={styles.benefitsContainer}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <FontAwesome5 name="check-circle" size={16} color={color} style={styles.benefitIcon} />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>
    )}
    
    <TouchableOpacity style={[styles.learnMoreButton, { backgroundColor: color }]} onPress={onLearnMore}>
      <Text style={styles.learnMoreText}>Apply Now</Text>
    </TouchableOpacity>
  </View>
);

const OffersScreen = ({ navigation }) => {
  // Real offers data with actual links
  const offers = [
    {
      id: 1,
      title: 'Chase Sapphire Preferred',
      subtitle: 'Travel Rewards Card',
      description: 'Earn 60,000 bonus points after you spend $4,000 on purchases in the first 3 months from account opening.',
      benefits: [
        '5x points on travel purchased through Chase',
        '3x points on dining and online groceries',
        '2x points on other travel purchases'
      ],
      icon: <FontAwesome5 name="plane" size={24} color="#FFFFFF" />,
      color: '#0A4DA2',
      link: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred?CELL=6259&jp_aid_a=T_91449&jp_aid_p=chasehome_3/hero'
    },
    {
      id: 2,
      title: 'Chase Total Checking',
      subtitle: 'Up to $300 bonus',
      description: 'Open a new Chase Total Checking account and set up direct deposit within 90 days.',
      benefits: [
        'Access to 16,000 Chase ATMs',
        'Mobile banking with Chase app',
        'No monthly service fee options available'
      ],
      icon: <FontAwesome5 name="university" size={24} color="#FFFFFF" />,
      color: '#0A4DA2',
      link: 'https://account.chase.com/consumer/banking/seo?jp_aid_a=T_90465&jp_aid_p=chasehome_3/trip1'
    },
    {
      id: 3,
      title: 'Capital One Quicksilver',
      subtitle: 'Cash Back Rewards',
      description: 'Unlimited 1.5% cash back on every purchase, every day.',
      benefits: [
        'One-time $200 cash bonus after spending $500',
        'No annual fee',
        'No foreign transaction fees'
      ],
      icon: <FontAwesome5 name="credit-card" size={24} color="#FFFFFF" />,
      color: '#A12D37',
      link: 'https://www.capitalone.com/credit-cards/preapprove/lp/mp-dc/?external_id=WWW_XXXXX_ZZZ_ONL-SE_ZZZZZ_T_SEM2_ZZZZ_c_Zg__kenshoo_clickid__687052895229_779509&target_id=kwd-26250459431&oC=0bQ0noocw8&gad_source=1&gbraid=0AAAAAD--QXD9waFQQ21wa1dpkjEa_ROjt&gclid=Cj0KCQjw782_BhDjARIsABTv_JBafpMdcQp4JC5B08s4b0KQgjQKZrh-h3nlpQ8xmwp0z5dFcWJwqBwaAs5HEALw_wcB'
    },
    {
      id: 4,
      title: 'American Express Gold',
      subtitle: 'Premium Rewards Card',
      description: 'Earn 60,000 Membership Rewards® points after spending $4,000 in the first 6 months.',
      benefits: [
        '4X points at restaurants worldwide',
        '4X points at U.S. supermarkets (up to $25,000 per year)',
        '$120 dining credit annually'
      ],
      icon: <FontAwesome5 name="crown" size={24} color="#FFFFFF" />,
      color: '#E0B142',
      link: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/?eep=28810&gclsrc=aw.ds&utm_cmpid=18507429079&utm_adid=741398451076&utm_mcid=&utm_source=google&utm_medium=cpc&utm_term=%2Bamerican+%2Bexpress+%2Bgold&utm_campaign=p%3AG%7Ca%3AAXCB%7C%5EB%7CD%7Cd%3AGold-CPS%7Cm%3APhrase&utm_adgroup=American+Express+Gold%7Cp%3AG%7Ca%3AAXCB%7C%5EB%7CD%7Cd%3AGold-CPS%7Cm%3APhrase&utm_adgid=141451150545&utm_tgtid=aud-1718160133397%3Akwd-378783604257&utm_mt=p&utm_dvc=c&utm_ntwk=g&utm_adpos=&utm_plcmnt=&utm_locphysid=9031193&utm_locintid=&utm_feeditemid=&utm_devicemdl=&utm_plcmnttgt=&utm_programname=brandcps&utm_cmp=Gold&utm_sl=&gad_source=1&gbraid=0AAAAADfV22uL7ZGuWEDvrUXG9jZ1k2b-k&gclid=Cj0KCQjw782_BhDjARIsABTv_JCsFJfr1tM2anx6rJRRdbAYAzkWXLuz7DregxKOErI_wuPa862meKoaAswWEALw_wcB'
    },
    {
      id: 5,
      title: 'Capital One 360 Checking',
      subtitle: '$250 Cash Bonus',
      description: 'Earn a $250 bonus when you open a new 360 Checking account and receive at least $1,000 in direct deposits within 90 days.',
      benefits: [
        'No monthly fees or minimum balances',
        '70,000+ fee-free ATMs',
        'Mobile check deposit'
      ],
      icon: <FontAwesome5 name="university" size={24} color="#FFFFFF" />,
      color: '#A12D37',
      link: 'https://www.capitalone.com/bank/checking250/?gclsrc=aw.ds&gad_source=1&gbraid=0AAAAADtpBjduwbx2MP7WoVSRBxYNYhmR-&gclid=Cj0KCQjw782_BhDjARIsABTv_JBhbvS3hUPoQOXzUHZg4ppGmt3wsYZMW8O0u599C8uJa-v7hxH1oOcaAtwpEALw_wcB'
    },
    {
      id: 6,
      title: 'Discover Online Checking',
      subtitle: 'No Monthly Fees',
      description: 'Experience a checking account with no monthly fees, no minimum balance requirements, and no overdraft fees.',
      benefits: [
        'Get paid up to 2 days early with direct deposit',
        'Free online bill pay',
        '60,000+ fee-free ATMs'
      ],
      icon: <FontAwesome5 name="university" size={24} color="#FFFFFF" />,
      color: '#FF6000',
      link: 'https://www.discover.com/online-banking/checking-lp-lng-01/?cmpgnid=ps-bk-ggl-gen-bnd-brd-offer&src=S000017UX&van=dbank&gclsrc=aw.ds&gad_source=1&gbraid=0AAAAAoeZn45uLoSO0X4Ge3oXCnmY0tHNI&gclid=Cj0KCQjw782_BhDjARIsABTv_JBxX10Sc7d_ZPj4I54zbP4Y9FEKmCyIL6Mzng_UfMLcEyEUydS1bT8aAm5sEALw_wcB'
    }
  ];

  // Handle learn more button press - opens the offer URL
  const handleLearnMore = (url) => {
    // Properly encode the URL to handle special characters in query parameters
    const encodedUrl = encodeURI(url);
    
    Linking.canOpenURL(encodedUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(encodedUrl);
        } else {
          console.log(`Cannot open URL: ${encodedUrl}`);
          // Show a fallback option if the URL can't be opened directly
          Alert.alert(
            "Cannot Open Link",
            "Would you like to copy the link to clipboard instead?",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Copy Link", 
                onPress: () => {
                  Clipboard.setString(url);
                  Alert.alert("Success", "Link copied to clipboard");
                }
              }
            ]
          );
        }
      })
      .catch(err => console.error('An error occurred with the link:', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#0D47A1']}
        style={styles.header}
      >
        <Text style={styles.title}>Exclusive Offers</Text>
        <Text style={styles.subtitle}>Personalized financial products to help you grow</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.offersContainer}>
          {offers.map(offer => (
            <OfferCard
              key={offer.id}
              title={offer.title}
              subtitle={offer.subtitle}
              description={offer.description}
              benefits={offer.benefits}
              icon={offer.icon}
              color={offer.color}
              onLearnMore={() => handleLearnMore(offer.link)}
            />
          ))}
        </View>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            These offers are from our trusted partners. FinQuest may receive compensation when you click on links to these products. Terms and conditions apply to each offer. Please review all terms before applying.
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  offersContainer: {
    paddingTop: 20,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  offerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  offerTitleContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  offerSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  offerDescription: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 15,
    lineHeight: 22,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  benefitIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  learnMoreButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  }
});

export default OffersScreen;
