#!/bin/bash

FILE_PATH="/Users/jackjanoian/windsurf_projects/FinQuest/src/screens/challenges/ChallengesScreen.js"

# Create a backup of the original file
cp "$FILE_PATH" "${FILE_PATH}.backup3"

# Use a different approach to remove all badge bubble indicators
# This will remove all code blocks from {earned && special === to the closing )}
perl -i -0pe 's/\{earned && (special === .*?|featured) && \(\n.*?<View style=\[.*?featuredBadgeIndicator.*?\]>\n.*?<Text.*?>.*?<\/Text>\n.*?<\/View>\n.*?\)\}//gs' "$FILE_PATH"

echo "All badge bubble indicators have been removed from ChallengesScreen.js"
echo "A backup of the original file has been created at ${FILE_PATH}.backup3"
