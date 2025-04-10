// This script will fix the syntax error in ChallengesScreen.js
// Run this script with: node fix_badge_item.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'screens', 'challenges', 'ChallengesScreen.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Find the BadgeItem component
const badgeItemStartPattern = /const BadgeItem = \(\{ name, description, earned, iconType, onPress, featured, special \}\) => \(/;
const badgeItemStart = content.match(badgeItemStartPattern);

if (badgeItemStart) {
  const startIndex = badgeItemStart.index;
  
  // Find the end of the BadgeItem component
  const badgeItemEndPattern = /\);\s*\n\s*const BadgeDetailModal/;
  const badgeItemEnd = content.match(badgeItemEndPattern);
  
  if (badgeItemEnd) {
    const endIndex = badgeItemEnd.index + badgeItemEnd[0].length - "const BadgeDetailModal".length;
    
    // Create a clean version of the BadgeItem component
    const cleanBadgeItem = `const BadgeItem = ({ name, description, earned, iconType, onPress, featured, special }) => (
  <TouchableOpacity 
    style={styles.badgeItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.badgeImageContainer}>
      {earned ? (
        name === 'Micro-Saver' ? (
          <View style={styles.microSaverContainer}>
            {BadgeIcons[iconType] ? BadgeIcons[iconType]() : <Text style={styles.badgeEmoji}>?</Text>}
          </View>
        ) : (
        <LinearGradient
          colors={
            featured ? ['#4CAF50', '#2E7D32'] : 
            special === 'automation' ? ['#2196F3', '#1565C0'] :
            special === 'freeze' ? ['#00BCD4', '#0097A7'] :
            special === 'emergency' ? ['#FF9800', '#FFC107'] :
            special === 'tracker' ? ['#4CAF50', '#2E7D32'] :
            special === 'chef' ? ['#FFC107', '#FFD54F'] :
            special === 'debt-payment' ? ['#FF9800', '#FFC107'] :
            special === 'debt-snowball' ? ['#4CAF50', '#2E7D32'] :
            special === 'debt-avalanche' ? ['#2196F3', '#1565C0'] :
            special === 'debt-free' ? ['#FFC107', '#FFD54F'] :
            special === 'card-crusher' ? ['#9C27B0', '#7B1FA2'] :
            special === 'budget-beginner' ? ['#3F51B5', '#303F9F'] :
            special === 'savings-superstar' ? ['#FF5722', '#E64A19'] :
            special === 'financial-master' ? ['#8BC34A', '#689F38'] :
            special === 'debt-demolisher' ? ['#F44336', '#D32F2F'] :
            ['#FFC107', '#FFD54F']
          }
          style={[
            styles.badgeImage, 
            featured && styles.featuredBadgeImage,
            special === 'automation' && styles.automationBadgeImage,
            special === 'freeze' && styles.freezeBadgeImage,
            special === 'emergency' && styles.emergencyBadgeImage,
            special === 'tracker' && styles.trackerBadgeImage,
            special === 'chef' && styles.chefBadgeImage,
            special === 'debt-payment' && styles.debtPaymentBadgeImage,
            special === 'debt-snowball' && styles.debtSnowballBadgeImage,
            special === 'debt-avalanche' && styles.debtAvalancheBadgeImage,
            special === 'debt-free' && styles.debtFreeBadgeImage,
            special === 'card-crusher' && styles.cardCrusherBadgeImage,
            special === 'budget-beginner' && styles.budgetBeginnerBadgeImage,
            special === 'savings-superstar' && styles.savingsSuperstarBadgeImage,
            special === 'financial-master' && styles.financialMasterBadgeImage,
            special === 'debt-demolisher' && styles.debtDemolisherBadgeImage
          ]}
        >
          <View style={styles.badgeIconContainer}>
            {BadgeIcons[iconType] ? BadgeIcons[iconType]() : <Text style={styles.badgeEmoji}>?</Text>}
          </View>
          {special === 'automation' && (
            <View style={styles.automationGearContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.automationGear, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'freeze' && (
            <View style={styles.freezeEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.freezeCrystal, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                  width: 4 + Math.random() * 4,
                  height: 4 + Math.random() * 4,
                }]} />
              ))}
            </View>
          )}
          {special === 'emergency' && (
            <View style={styles.emergencyEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.emergencyIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'tracker' && (
            <View style={styles.trackerEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.trackerIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'chef' && (
            <View style={styles.chefEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.chefIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          <View style={[
            styles.badgeGlowOuter,
            featured && styles.featuredBadgeGlowOuter,
            special === 'automation' && styles.automationBadgeGlowOuter,
            special === 'freeze' && styles.freezeBadgeGlowOuter,
            special === 'emergency' && styles.emergencyBadgeGlowOuter,
            special === 'tracker' && styles.trackerBadgeGlowOuter,
            special === 'chef' && styles.chefBadgeGlowOuter,
            special === 'debt-payment' && styles.debtPaymentBadgeGlowOuter,
            special === 'debt-snowball' && styles.debtSnowballBadgeGlowOuter,
            special === 'debt-avalanche' && styles.debtAvalancheBadgeGlowOuter,
            special === 'debt-free' && styles.debtFreeBadgeGlowOuter,
            special === 'card-crusher' && styles.cardCrusherBadgeGlowOuter,
            special === 'budget-beginner' && styles.budgetBeginnerGlowOuter,
            special === 'savings-superstar' && styles.savingsSuperstarGlowOuter,
            special === 'financial-master' && styles.financialMasterGlowOuter,
            special === 'debt-demolisher' && styles.debtDemolisherGlowOuter
          ]} />
        </LinearGradient>
        )
      ) : (
        <LinearGradient
          colors={['#BDBDBD', '#E0E0E0']}
          style={styles.lockedBadge}
        >
          <Text style={styles.lockedText}>?</Text>
        </LinearGradient>
      )}
      {/* All badge bubble indicators removed for cleaner UI */}
    </View>
    <Text style={[
      styles.badgeName, 
      !earned && styles.unearnedText, 
      featured && styles.featuredBadgeName,
      special === 'automation' && styles.automationBadgeName,
      special === 'freeze' && styles.freezeBadgeName,
      special === 'emergency' && styles.emergencyBadgeName,
      special === 'tracker' && styles.trackerBadgeName,
      special === 'chef' && styles.chefBadgeName,
      special === 'debt-payment' && styles.debtPaymentBadgeName,
      special === 'debt-snowball' && styles.debtSnowballBadgeName,
      special === 'debt-avalanche' && styles.debtAvalancheBadgeName,
      special === 'debt-free' && styles.debtFreeBadgeName,
      special === 'card-crusher' && styles.cardCrusherBadgeName,
      special === 'budget-beginner' && styles.budgetBeginnerBadgeName,
      special === 'savings-superstar' && styles.savingsSuperstarBadgeName,
      special === 'financial-master' && styles.financialMasterBadgeName,
      special === 'debt-demolisher' && styles.debtDemolisherBadgeName
    ]}>{name}</Text>
  </TouchableOpacity>
);

const BadgeDetailModal`;
    
    // Replace the BadgeItem component with the clean version
    content = content.substring(0, startIndex) + cleanBadgeItem + content.substring(endIndex);
    
    // Add the microSaverContainer style to the StyleSheet if it doesn't exist
    if (!content.includes('microSaverContainer')) {
      const styleSheetEndPattern = /}\);\s*export default/;
      const styleSheetEnd = content.match(styleSheetEndPattern);
      
      if (styleSheetEnd) {
        const styleIndex = styleSheetEnd.index;
        const microSaverStyle = `
  microSaverContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
`;
        content = content.substring(0, styleIndex) + microSaverStyle + content.substring(styleIndex);
      }
    }
    
    // Make sure Image is imported
    if (!content.includes('import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated, Image }')) {
      content = content.replace(
        /import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated[^}]*}/,
        'import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated, Image }'
      );
    }
    
    // Write the fixed content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully fixed BadgeItem component in ChallengesScreen.js');
  } else {
    console.error('Could not find end of BadgeItem component');
  }
} else {
  console.error('Could not find BadgeItem component');
}
