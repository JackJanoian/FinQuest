#!/bin/bash

# This script removes all badge bubble indicators from ChallengesScreen.js

FILE_PATH="/Users/jackjanoian/windsurf_projects/FinQuest/src/screens/challenges/ChallengesScreen.js"

# Create a backup of the original file
cp "$FILE_PATH" "${FILE_PATH}.backup"

# Remove all badge bubble indicator blocks
sed -i '' '
/earned && featured && (/,+3d
/earned && special === "automation" && (/,+3d
/earned && special === "freeze" && (/,+3d
/earned && special === "emergency" && (/,+3d
/earned && special === "tracker" && (/,+3d
/earned && special === "chef" && (/,+3d
/earned && special === "debt-payment" && (/,+3d
/earned && special === "debt-snowball" && (/,+3d
/earned && special === "debt-avalanche" && (/,+3d
/earned && special === "debt-free" && (/,+3d
/earned && special === "card-crusher" && (/,+3d
/earned && special === "budget-beginner" && (/,+3d
/earned && special === "savings-superstar" && (/,+3d
/earned && special === "financial-master" && (/,+3d
/earned && special === "debt-demolisher" && (/,+3d
' "$FILE_PATH"

echo "All badge bubble indicators have been removed from ChallengesScreen.js"
echo "A backup of the original file has been created at ${FILE_PATH}.backup"
