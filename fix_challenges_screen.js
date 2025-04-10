// This script will fix the syntax error in ChallengesScreen.js
// Run this script with: node fix_challenges_screen.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'screens', 'challenges', 'ChallengesScreen.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the problematic code
// We need to replace the Micro-Saver badge rendering code with proper syntax
const badgeItemStartPattern = /const BadgeItem = \(\{ name, description, earned, iconType, onPress, featured, special \}\) => \(/;
const badgeItemStart = content.match(badgeItemStartPattern);

if (badgeItemStart) {
  const startIndex = badgeItemStart.index;
  
  // Find where to insert our fixed code
  const badgeImageContainerPattern = /<View style={styles\.badgeImageContainer}>/;
  const badgeImageContainer = content.match(badgeImageContainerPattern);
  
  if (badgeImageContainer) {
    const containerIndex = badgeImageContainer.index;
    
    // Create the fixed code
    const fixedCode = `<View style={styles.badgeImageContainer}>
      {earned ? (
        name === 'Micro-Saver' ? (
          <View style={styles.microSaverContainer}>
            {BadgeIcons[iconType] ? BadgeIcons[iconType]() : <Text style={styles.badgeEmoji}>?</Text>}
          </View>
        ) : (`;
    
    // Replace the problematic code
    content = content.substring(0, containerIndex) + fixedCode + content.substring(containerIndex + badgeImageContainer[0].length);
    
    // Add the missing closing parenthesis after LinearGradient
    const linearGradientClosePattern = /<\/LinearGradient>\n(\s+)\) : \(/;
    const linearGradientClose = content.match(linearGradientClosePattern);
    
    if (linearGradientClose) {
      const closeIndex = linearGradientClose.index + linearGradientClose[0].length - linearGradientClose[1].length - 6;
      content = content.substring(0, closeIndex) + ')' + content.substring(closeIndex);
    }
    
    // Add the microSaverContainer style to the StyleSheet
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
    
    // Write the fixed content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully fixed ChallengesScreen.js');
  } else {
    console.error('Could not find badgeImageContainer pattern');
  }
} else {
  console.error('Could not find BadgeItem pattern');
}
