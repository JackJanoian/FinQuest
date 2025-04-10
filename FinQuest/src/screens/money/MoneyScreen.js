import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Modal,
  Alert,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinancialData } from '../../context/FinancialDataContext';

const { width } = Dimensions.get('window');

// Debt item component
const DebtItem = ({ debt, onPress, onDelete }) => {
  // Function to get the appropriate icon based on debt type
  const getDebtIcon = (type) => {
    switch(type) {
      case 'credit':
        return <FontAwesome5 name="credit-card" size={24} color="#64B5F6" />;
      case 'student':
        return <FontAwesome5 name="graduation-cap" size={24} color="#64B5F6" />;
      case 'car':
        return <FontAwesome5 name="car" size={24} color="#64B5F6" />;
      case 'personal':
        return <FontAwesome5 name="dollar-sign" size={24} color="#64B5F6" />;
      default:
        return <FontAwesome5 name="file-invoice-dollar" size={24} color="#64B5F6" />;
    }
  };

  return (
    <TouchableOpacity style={styles.debtCard} onPress={() => onPress(debt)}>
      <View style={styles.debtCardHeader}>
        <View style={styles.debtIconContainer}>
          {getDebtIcon(debt.type)}
        </View>
        <View style={styles.debtTitleContainer}>
          <Text style={styles.debtTitle}>{debt.name}</Text>
          <Text style={styles.debtInterest}>{debt.interestRate}% interest</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onPress
            onDelete(debt.id);
          }}
        >
          <FontAwesome5 name="trash" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.debtAmountsRow}>
        <View>
          <Text style={styles.debtAmountLabel}>Remaining</Text>
          <Text style={styles.debtRemainingAmount}>${debt.amount ? debt.amount : '0'}</Text>
        </View>
        <View style={styles.debtTotalContainer}>
          <Text style={styles.debtAmountLabel}>Total</Text>
          <Text style={styles.debtTotalAmount}>${debt.totalAmount ? debt.totalAmount : '0'}</Text>
        </View>
      </View>
      
      <View style={styles.debtProgressContainer}>
        <View style={styles.debtProgressBar}>
          <View style={[styles.debtProgressFill, { width: `${debt.paidPercentage || 0}%` }]} />
        </View>
      </View>
      
      <View style={styles.debtFooter}>
        <Text style={styles.debtPaymentInfo}>Minimum payment: ${debt.minimumPayment ? debt.minimumPayment : '0'}/month</Text>
        <Text style={styles.debtPaidPercentage}>{debt.paidPercentage || 0}% paid</Text>
      </View>
    </TouchableOpacity>
  );
};

// Savings item component
const SavingsItem = ({ goal, onPress, onDelete }) => {
  const progressPercentage = goal.target ? (goal.current / goal.target) * 100 : 0;
  const savedPercentage = Math.round(progressPercentage);
  
  return (
    <TouchableOpacity style={styles.savingsCard} onPress={() => onPress(goal)}>
      <View style={styles.savingsCardHeader}>
        <View style={styles.savingsIconContainer}>
          {goal.type === 'emergency' ? (
            <FontAwesome5 name="shield-alt" size={24} color="#64B5F6" />
          ) : (
            <FontAwesome5 name="umbrella-beach" size={24} color="#64B5F6" />
          )}
        </View>
        <View style={styles.savingsTitleContainer}>
          <Text style={styles.savingsTitle}>{goal.name}</Text>
          <Text style={styles.savingsDeadline}>Target: ${goal.target ? goal.target : '0'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onPress
            onDelete(goal.id);
          }}
        >
          <FontAwesome5 name="trash" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.savingsAmountsRow}>
        <View>
          <Text style={styles.savingsAmountLabel}>Saved</Text>
          <Text style={styles.savingsSavedAmount}>${goal.current ? goal.current : '0'}</Text>
        </View>
        <View style={styles.savingsTotalContainer}>
          <Text style={styles.savingsAmountLabel}>Remaining</Text>
          <Text style={styles.savingsRemainingAmount}>${goal.target && goal.current !== undefined ? (goal.target - goal.current) : '0'}</Text>
        </View>
      </View>
      
      <View style={styles.savingsProgressContainer}>
        <View style={styles.savingsProgressBar}>
          <View style={[styles.savingsProgressFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>
      
      <View style={styles.savingsFooter}>
        <Text style={styles.savingsDeadlineInfo}>Target date: {goal.deadline || 'Not set'}</Text>
        <Text style={styles.savingsSavedPercentage}>{savedPercentage}% saved</Text>
      </View>
    </TouchableOpacity>
  );
};

const MoneyScreen = () => {
  const { 
    debts, 
    savings, 
    addDebt, 
    updateDebt, 
    deleteDebt, 
    addSavingsGoal, 
    updateSavingsGoal, 
    deleteSavingsGoal,
    makeDebtPayment,
    makeSavingsDeposit
  } = useFinancialData();
  
  // State for UI
  const [activeTab, setActiveTab] = useState('debts');
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemType, setNewItemType] = useState('debt');
  const [newItemInterestRate, setNewItemInterestRate] = useState('');
  const [newItemMinPayment, setNewItemMinPayment] = useState('');
  const [newItemDeadline, setNewItemDeadline] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  
  // Calculate totals
  const totalDebt = debts && debts.length > 0 
    ? debts.reduce((sum, debt) => sum + (debt && debt.amount ? Number(debt.amount) : 0), 0)
    : 0;
    
  const totalSavings = savings && savings.length > 0 
    ? savings.reduce((sum, goal) => sum + (goal && goal.current ? Number(goal.current) : 0), 0)
    : 0;
  
  // Handle debt item press
  const handleDebtPress = (debt) => {
    setSelectedItem(debt);
    setPaymentModalVisible(true);
  };
  
  // Handle savings item press
  const handleSavingsPress = (goal) => {
    setSelectedItem(goal);
    setPaymentModalVisible(true);
  };
  
  // Handle add new item
  const handleAddNew = () => {
    // Set the newItemType based on the active tab
    setNewItemType(activeTab === 'debts' ? 'debt' : 'savings');
    setModalVisible(true);
  };

  // Handle add payment
  const handleAddPayment = () => {
    const payment = parseFloat(paymentAmount);
    
    if (isNaN(payment) || payment <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }
    
    if (activeTab === 'debts') {
      // For debts, we subtract the payment
      if (payment > selectedItem.amount) {
        Alert.alert(
          'Payment Too Large', 
          `The payment amount ($${payment}) is larger than the remaining debt ($${selectedItem.amount}). Would you like to pay off this debt completely?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {}
            },
            {
              text: 'Pay In Full', 
              style: 'default',
              onPress: () => {
                // Pay the full amount
                makeDebtPayment(selectedItem.id, selectedItem.amount);
                
                setPaymentModalVisible(false);
                setPaymentAmount('');
                
                // Show success message
                Alert.alert(
                  'Debt Paid Off!', 
                  `Congratulations! You've paid off your ${selectedItem.name} debt completely!`,
                  [{ text: 'Celebrate!' }]
                );
              }
            }
          ]
        );
        return;
      }
      
      // Make the debt payment
      makeDebtPayment(selectedItem.id, payment);
      
      setPaymentModalVisible(false);
      setPaymentAmount('');
      
      // Show success message
      Alert.alert(
        'Payment Added!', 
        `You've added a payment of $${payment} to your ${selectedItem.name} debt!`,
        [{ text: 'Great!' }]
      );
    } else {
      // For savings, we add the payment
      if (payment + selectedItem.current > selectedItem.target) {
        Alert.alert(
          'Deposit Too Large', 
          `The deposit amount ($${payment}) would exceed your target ($${selectedItem.target}). Would you like to reach your goal completely?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {}
            },
            {
              text: 'Complete Goal', 
              style: 'default',
              onPress: () => {
                // Add just enough to reach the target
                const remainingAmount = selectedItem.target - selectedItem.current;
                
                // Make the savings deposit
                makeSavingsDeposit(selectedItem.id, remainingAmount);
                
                setPaymentModalVisible(false);
                setPaymentAmount('');
                
                // Show success message
                Alert.alert(
                  'Goal Reached!', 
                  `Congratulations! You've reached your ${selectedItem.name} savings goal!`,
                  [{ text: 'Celebrate!' }]
                );
              }
            }
          ]
        );
        return;
      }
      
      // Make the savings deposit
      makeSavingsDeposit(selectedItem.id, payment);
      
      setPaymentModalVisible(false);
      setPaymentAmount('');
      
      // Show success message
      Alert.alert(
        'Deposit Added!', 
        `You've added a deposit of $${payment} to your ${selectedItem.name} savings goal!`,
        [{ text: 'Great!' }]
      );
    }
  };
  
  // Handle delete debt
  const handleDeleteDebt = (id) => {
    Alert.alert(
      'Delete Debt',
      'Are you sure you want to delete this debt?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteDebt(id);
          }
        }
      ]
    );
  };
  
  // Handle delete savings
  const handleDeleteSavings = (id) => {
    Alert.alert(
      'Delete Savings Goal',
      'Are you sure you want to delete this savings goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteSavingsGoal(id);
          }
        }
      ]
    );
  };
  
  // Handle add item
  const handleAddItem = () => {
    if (newItemType === 'debt') {
      // Generate a new unique ID
      const newId = `debt-${Date.now()}`;
      const currentDate = new Date();
      
      // Create the new debt object
      const newDebt = {
        id: newId,
        name: newItemName,
        type: 'credit',
        amount: parseFloat(newItemAmount),
        totalAmount: parseFloat(newItemAmount) * 1.2, // Example calculation
        interestRate: parseFloat(newItemInterestRate),
        minimumPayment: parseFloat(newItemMinPayment),
        paidPercentage: 0,
        createdAt: currentDate.toISOString(),
        history: [parseFloat(newItemAmount)], // Initialize history with the current amount
        historyDates: [currentDate.toISOString()] // Track the date for this amount
      };
      
      // Add the new debt to the state
      addDebt(newDebt);
      
      // Close the modal and reset the form
      setModalVisible(false);
      setNewItemName('');
      setNewItemAmount('');
      setNewItemInterestRate('');
      setNewItemMinPayment('');
      setNewItemDeadline('');
    } else {
      // Generate a new unique ID
      const newId = `savings-${Date.now()}`;
      const currentDate = new Date();
      
      // Create the new savings goal object
      const newSavingsGoal = {
        id: newId,
        name: newItemName,
        type: 'emergency',
        current: 0,
        target: parseFloat(newItemAmount),
        deadline: newItemDeadline,
        createdAt: currentDate.toISOString(),
        history: [0], // Initialize history with 0
        historyDates: [currentDate.toISOString()] // Track the date for this amount
      };
      
      // Add the new savings goal to the state
      addSavingsGoal(newSavingsGoal);
      
      // Close the modal and reset the form
      setModalVisible(false);
      setNewItemName('');
      setNewItemAmount('');
      setNewItemInterestRate('');
      setNewItemMinPayment('');
      setNewItemDeadline('');
    }
  };

  // Render the Money Manager screen
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#0D47A1']}
        style={styles.header}
      >
        <Text style={styles.title}>Money Manager</Text>
        <Text style={styles.subtitle}>Track your debts and savings goals</Text>
      </LinearGradient>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryAmount}>${totalDebt ? totalDebt : '0'}</Text>
            <Text style={styles.statLabel}>Total Debt</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryAmount}>${totalSavings ? totalSavings : '0'}</Text>
            <Text style={styles.statLabel}>Total Savings</Text>
          </View>
        </View>
        
        <View style={styles.addButtonContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddNew}
          >
            <FontAwesome5 name="plus-circle" size={30} color="#FFFFFF" solid />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'debts' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('debts')}
        >
          <Text 
            style={[
              styles.tabButtonText,
              activeTab === 'debts' && styles.activeTabButtonText
            ]}
          >
            Debts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'savings' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('savings')}
        >
          <Text 
            style={[
              styles.tabButtonText,
              activeTab === 'savings' && styles.activeTabButtonText
            ]}
          >
            Savings
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'debts' ? (
          debts.map(debt => (
            <DebtItem 
              key={debt.id} 
              debt={debt} 
              onPress={handleDebtPress} 
              onDelete={handleDeleteDebt} 
            />
          ))
        ) : (
          savings.map(goal => (
            <SavingsItem 
              key={goal.id} 
              goal={goal} 
              onPress={handleSavingsPress} 
              onDelete={handleDeleteSavings} 
            />
          ))
        )}
      </ScrollView>
      
      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {activeTab === 'debts' ? 'Make a Payment' : 'Add to Savings'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedItem?.name}
            </Text>
            <Text style={styles.modalAmount}>
              {activeTab === 'debts' 
                ? `Remaining: $${selectedItem?.amount ? selectedItem.amount : '0'}`
                : `Current: $${selectedItem?.current ? selectedItem.current : '0'} / $${selectedItem?.target ? selectedItem.target : '0'}`
              }
            </Text>
            
            <TextInput
              style={styles.amountInput}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPaymentModalVisible(false);
                  setPaymentAmount('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddPayment}
              >
                <Text style={styles.confirmButtonText}>
                  {activeTab === 'debts' ? 'Make Payment' : 'Add to Goal'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Add New Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setNewItemName('');
          setNewItemAmount('');
          setNewItemInterestRate('');
          setNewItemMinPayment('');
          setNewItemDeadline('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add New {newItemType === 'debt' ? 'Debt' : 'Savings Goal'}
            </Text>
            
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  newItemType === 'debt' && styles.segmentButtonActive
                ]}
                onPress={() => setNewItemType('debt')}
              >
                <Text style={[
                  styles.segmentButtonText,
                  newItemType === 'debt' && styles.segmentButtonTextActive
                ]}>Debt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  newItemType === 'savings' && styles.segmentButtonActive
                ]}
                onPress={() => setNewItemType('savings')}
              >
                <Text style={[
                  styles.segmentButtonText,
                  newItemType === 'savings' && styles.segmentButtonTextActive
                ]}>Savings</Text>
              </TouchableOpacity>
            </View>
            
            {newItemType === 'debt' ? (
              <View style={styles.formContainer}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Credit Card"
                  value={newItemName}
                  onChangeText={setNewItemName}
                />
                
                <Text style={styles.formLabel}>Current Amount ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={newItemAmount}
                  onChangeText={setNewItemAmount}
                />
                
                <Text style={styles.formLabel}>Interest Rate (%)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={newItemInterestRate}
                  onChangeText={setNewItemInterestRate}
                />
                
                <Text style={styles.formLabel}>Minimum Monthly Payment</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={newItemMinPayment}
                  onChangeText={setNewItemMinPayment}
                />
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Vacation Fund"
                  value={newItemName}
                  onChangeText={setNewItemName}
                />
                
                <Text style={styles.formLabel}>Target Amount ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={newItemAmount}
                  onChangeText={setNewItemAmount}
                />
                
                <Text style={styles.formLabel}>Target Date</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={newItemDeadline}
                  onChangeText={setNewItemDeadline}
                />
              </View>
            )}
            
            <View style={styles.formButtonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setNewItemName('');
                  setNewItemAmount('');
                  setNewItemInterestRate('');
                  setNewItemMinPayment('');
                  setNewItemDeadline('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddItem}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  summaryContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    position: 'relative',
    marginBottom: 15,
  },
  summaryContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingRight: 80,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  addButtonContainer: {
    position: 'absolute',
    right: 35, 
    top: '35%', 
    marginTop: -20,
    zIndex: 1,
  },
  addButton: {
    backgroundColor: '#1976D2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  activeTabButton: {
    backgroundColor: '#F5F7FA',
    borderBottomWidth: 2,
    borderBottomColor: '#1565C0',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9E9E9E',
  },
  activeTabButtonText: {
    color: '#1565C0',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 20,
  },
  debtCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  debtCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  debtIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  debtTitleContainer: {
    flex: 1,
  },
  debtTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  debtInterest: {
    fontSize: 16,
    color: '#757575',
  },
  deleteButton: {
    padding: 10,
  },
  debtAmountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  debtAmountLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  debtRemainingAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F44336',
  },
  debtTotalContainer: {
    alignItems: 'flex-end',
  },
  debtTotalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  debtProgressContainer: {
    marginBottom: 15,
  },
  debtProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  debtProgressFill: {
    height: '100%',
    backgroundColor: '#F44336',
    borderRadius: 4,
  },
  debtFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtPaymentInfo: {
    fontSize: 14,
    color: '#757575',
  },
  debtPaidPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#757575',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#1565C0',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#212121',
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#212121',
  },
  pickerItemTextSelected: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  savingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  savingsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  savingsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  savingsTitleContainer: {
    flex: 1,
  },
  savingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  savingsDeadline: {
    fontSize: 16,
    color: '#757575',
  },
  savingsAmountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  savingsAmountLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  savingsSavedAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  savingsTotalContainer: {
    alignItems: 'flex-end',
  },
  savingsRemainingAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  savingsProgressContainer: {
    marginBottom: 15,
  },
  savingsProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  savingsProgressFill: {
    height: '100%',
    backgroundColor: '#1976D2',
    borderRadius: 4,
  },
  savingsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsDeadlineInfo: {
    fontSize: 14,
    color: '#757575',
  },
  savingsSavedPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentButtonText: {
    fontSize: 16,
    color: '#757575',
  },
  segmentButtonTextActive: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  formLabel: {
    fontSize: 16,
    color: '#616161',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  formButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#757575',
    fontWeight: 'bold',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#1976D2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MoneyScreen;
