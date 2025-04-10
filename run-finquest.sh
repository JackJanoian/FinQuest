#!/bin/bash

# Script to run FinQuest app from the correct directory
# Usage: ./run-finquest.sh [command]
# Example: ./run-finquest.sh start
# Example: ./run-finquest.sh ios

# Navigate to the correct FinQuest directory
cd "$(dirname "$0")/FinQuest" || exit

# Default command is 'start' if none provided
COMMAND=${1:-start}

# Run the appropriate expo command based on the argument
case "$COMMAND" in
  start)
    echo "Starting FinQuest app..."
    npx expo start
    ;;
  ios)
    echo "Starting FinQuest app on iOS simulator..."
    npx expo start --ios
    ;;
  android)
    echo "Starting FinQuest app on Android emulator..."
    npx expo start --android
    ;;
  web)
    echo "Starting FinQuest app on web..."
    npx expo start --web
    ;;
  build)
    echo "Building FinQuest app..."
    npx expo build
    ;;
  *)
    echo "Running custom command: npx expo $COMMAND"
    npx expo "$COMMAND"
    ;;
esac
