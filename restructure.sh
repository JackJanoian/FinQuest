#!/bin/bash

# Create the new directory structure
mkdir -p src/screens/auth src/screens/dashboard src/screens/debt src/screens/savings src/screens/education src/screens/challenges src/screens/profile src/screens/money src/context src/navigation src/components src/config assets

# Copy files from nested structure to the new root-level structure
cp -r FinQuest/src/screens/auth/* src/screens/auth/
cp -r FinQuest/src/screens/dashboard/* src/screens/dashboard/
cp -r FinQuest/src/screens/debt/* src/screens/debt/
cp -r FinQuest/src/screens/savings/* src/screens/savings/
cp -r FinQuest/src/screens/education/* src/screens/education/
cp -r FinQuest/src/screens/challenges/* src/screens/challenges/
cp -r FinQuest/src/screens/profile/* src/screens/profile/
cp -r FinQuest/src/screens/money/* src/screens/money/
cp -r FinQuest/src/context/* src/context/
cp -r FinQuest/src/navigation/* src/navigation/
cp -r FinQuest/src/components/* src/components/
cp -r FinQuest/src/config/* src/config/
cp -r FinQuest/assets/* assets/

echo "Files copied successfully!"
