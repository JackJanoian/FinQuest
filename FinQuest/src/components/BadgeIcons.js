import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import MicroSaverBadge from './MicroSaverBadge';

// Common style for all badge icons
const iconStyle = { width: 50, height: 50 };

// Badge icon paths
const badgeIconPaths = {
  // Savings Badges
  microSaver: require('../BadgeIcons/MicroSaverBadge.png'),
  safetyNetStarter: require('../BadgeIcons/EmergencyFundBadge.png'),
  autoSaver: require('../BadgeIcons/SavingAutomationBadge.png'),
  goalGetter: require('../BadgeIcons/SavingsGoalBadge.png'),

  // Budgeting Badges
  budgetBeginner: require('../BadgeIcons/BudgetStarterBadge.png'),
  spendingSleuth: require('../BadgeIcons/ExpenseTrackerBadge.png'),
  spendingFreeze: require('../BadgeIcons/No-SpendDayBadge.png'),
  subscriptionSlayer: require('../BadgeIcons/ExpenseTrackerBadge.png'), // Using ExpenseTracker badge as a substitute

  // Debt Management Badges
  debtSlasher: require('../BadgeIcons/DebtPaymentBadge.png'),
  snowballStarter: require('../BadgeIcons/DebtSnowballBadge.png'),
  cardCrusher: require('../BadgeIcons/CreditCardPayoffBadge.png'),
  avalancheAttacker: require('../BadgeIcons/DebtAvalancheBadge.png'),
  interestEliminator: require('../BadgeIcons/CreditCardPayoffBadge.png'), // Using CreditCardPayoff badge as a substitute
  freedomFighter: require('../BadgeIcons/DebtFreeMilestoneBadge.png'),
  debtDestroyer: require('../BadgeIcons/DebtPaymentBadge.png'),
  debtSnowballer: require('../BadgeIcons/DebtSnowballBadge.png'),
  debtAvalanche: require('../BadgeIcons/DebtAvalancheBadge.png'),
  debtFreeMilestone: require('../BadgeIcons/DebtFreeMilestoneBadge.png'),
  
  // Milestone badges
  debtDemolisher: require('../BadgeIcons/DebtDemolisherBadge.png'),
  savingsSuperstar: require('../BadgeIcons/SavingsSuperstarBadge.png'),
  financialMaster: require('../BadgeIcons/FinancialMasterBadge.png'),
};

const styles = StyleSheet.create({
  microSaverContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinImage: {
    width: 50,
    height: 50,
    // Remove background by making the image slightly larger
    transform: [{scale: 1.2}],
  },
});

const BadgeIcons = {
  // Savings Badges
  microSaver: () => <MicroSaverBadge />,
  safetyNetStarter: () => <Image source={badgeIconPaths.safetyNetStarter} style={iconStyle} resizeMode="contain" />,
  autoSaver: () => <Image source={badgeIconPaths.autoSaver} style={iconStyle} resizeMode="contain" />,
  goalGetter: () => <Image source={badgeIconPaths.goalGetter} style={iconStyle} resizeMode="contain" />,

  // Budgeting Badges
  budgetBeginner: () => <Image source={badgeIconPaths.budgetBeginner} style={iconStyle} resizeMode="contain" />,
  spendingSleuth: () => <Image source={badgeIconPaths.spendingSleuth} style={iconStyle} resizeMode="contain" />,
  spendingFreeze: () => <Image source={badgeIconPaths.spendingFreeze} style={iconStyle} resizeMode="contain" />,
  subscriptionSlayer: () => <Image source={badgeIconPaths.subscriptionSlayer} style={iconStyle} resizeMode="contain" />,

  // Debt Management Badges
  debtSlasher: () => <Image source={badgeIconPaths.debtSlasher} style={iconStyle} resizeMode="contain" />,
  snowballStarter: () => <Image source={badgeIconPaths.snowballStarter} style={iconStyle} resizeMode="contain" />,
  cardCrusher: () => <Image source={badgeIconPaths.cardCrusher} style={iconStyle} resizeMode="contain" />,
  avalancheAttacker: () => <Image source={badgeIconPaths.avalancheAttacker} style={iconStyle} resizeMode="contain" />,
  interestEliminator: () => <Image source={badgeIconPaths.interestEliminator} style={iconStyle} resizeMode="contain" />,
  freedomFighter: () => <Image source={badgeIconPaths.freedomFighter} style={iconStyle} resizeMode="contain" />,
  debtDestroyer: () => <Image source={badgeIconPaths.debtDestroyer} style={iconStyle} resizeMode="contain" />,
  debtSnowballer: () => <Image source={badgeIconPaths.debtSnowballer} style={iconStyle} resizeMode="contain" />,
  debtAvalanche: () => <Image source={badgeIconPaths.debtAvalanche} style={iconStyle} resizeMode="contain" />,
  debtFreeMilestone: () => <Image source={badgeIconPaths.debtFreeMilestone} style={iconStyle} resizeMode="contain" />,
  
  // Milestone badges
  debtDemolisher: () => <Image source={badgeIconPaths.debtDemolisher} style={iconStyle} resizeMode="contain" />,
  savingsSuperstar: () => <Image source={badgeIconPaths.savingsSuperstar} style={iconStyle} resizeMode="contain" />,
  financialMaster: () => <Image source={badgeIconPaths.financialMaster} style={iconStyle} resizeMode="contain" />,
  
  // Helper method to get the icon path by type
  getIconPath: (type) => {
    return badgeIconPaths[type] || badgeIconPaths.microSaver; // Default to microSaver if type not found
  }
};

export default BadgeIcons;
