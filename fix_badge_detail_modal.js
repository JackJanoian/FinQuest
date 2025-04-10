// This script will fix the duplicate BadgeDetailModal declaration in ChallengesScreen.js
// Run this script with: node fix_badge_detail_modal.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'screens', 'challenges', 'ChallengesScreen.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Fix the duplicate BadgeDetailModal declaration
content = content.replace(
  /const BadgeDetailModalconst BadgeDetailModal/g,
  'const BadgeDetailModal'
);

// Write the fixed content back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed BadgeDetailModal declaration in ChallengesScreen.js');
