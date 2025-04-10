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
import { LineChart } from 'react-native-chart-kit';

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
          <Text style={styles.debtRemainingAmount}>${debt.amount ? debt.amount.toLocaleString() : '0'}</Text>
        </View>
        <View style={styles.debtTotalContainer}>
          <Text style={styles.debtAmountLabel}>Total</Text>
          <Text style={styles.debtTotalAmount}>${debt.totalAmount ? debt.totalAmount.toLocaleString() : '0'}</Text>
        </View>
      </View>
      
      <View style={styles.debtProgressContainer}>
        <View style={styles.debtProgressBar}>
          <View style={[styles.debtProgressFill, { width: `${debt.paidPercentage || 0}%` }]} />
        </View>
      </View>
      
      <View style={styles.debtFooter}>
        <Text style={styles.debtPaymentInfo}>Minimum payment: ${debt.minimumPayment ? debt.minimumPayment.toLocaleString() : '0'}/month</Text>
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
          <Text style={styles.savingsDeadline}>Target: ${goal.target ? goal.target.toLocaleString() : '0'}</Text>
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
          <Text style={styles.savingsSavedAmount}>${goal.current ? goal.current.toLocaleString() : '0'}</Text>
        </View>
        <View style={styles.savingsTotalContainer}>
          <Text style={styles.savingsAmountLabel}>Remaining</Text>
          <Text style={styles.savingsRemainingAmount}>${goal.target && goal.current !== undefined ? (goal.target - goal.current).toLocaleString() : '0'}</Text>
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

const MoneyScreen = ({ navigation }) => {
  // State for tabs
  const [activeTab, setActiveTab] = useState('debts');
  
  // State for modals
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  
  // State for new item
  const [newItemType, setNewItemType] = useState('debt');
  const [debtType, setDebtType] = useState('credit');
  const [customDebtType, setCustomDebtType] = useState('');
  const [savingsType, setSavingsType] = useState('emergency');
  const [customSavingsType, setCustomSavingsType] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [targetDate, setTargetDate] = useState('');
  
  // State for custom picker modals
  const [isTypePickerVisible, setIsTypePickerVisible] = useState(false);
  const [isSavingsTypePickerVisible, setIsSavingsTypePickerVisible] = useState(false);
  
  // State for analytics data
  const [debtHistoryData, setDebtHistoryData] = useState(null);
  const [savingsHistoryData, setSavingsHistoryData] = useState(null);
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
    }
  };
  
  // Mock data - would come from your Supabase database in a real app
  const [debts, setDebts] = useState([
    { 
      id: 1, 
      name: 'Credit Card', 
      amount: 5000, 
      totalAmount: 15000, 
      interestRate: 18.99, 
      minimumPayment: 150,
      type: 'credit',
      paidPercentage: 33,
      history: [15000, 14000, 12000, 9000, 7000, 5000] // Last 6 months of debt amounts
    },
    { 
      id: 2, 
      name: 'Student Loan', 
      amount: 25000, 
      totalAmount: 30000, 
      interestRate: 4.5, 
      minimumPayment: 300,
      type: 'student',
      paidPercentage: 17,
      history: [30000, 29000, 28000, 27000, 26000, 25000] // Last 6 months of debt amounts
    },
  ]);
  
  const [savings, setSavings] = useState([
    { 
      id: 1, 
      name: 'Emergency Fund', 
      current: 3000, 
      target: 10000, 
      deadline: 'Dec 30, 2023',
      type: 'emergency',
      history: [500, 1000, 1500, 2000, 2500, 3000] // Last 6 months of savings amounts
    },
    { 
      id: 2, 
      name: 'Vacation', 
      current: 1500, 
      target: 3000, 
      deadline: 'Aug 14, 2023',
      type: 'vacation',
      history: [0, 300, 600, 900, 1200, 1500] // Last 6 months of savings amounts
    },
    { 
      id: 3, 
      name: 'Down Payment', 
      current: 15000, 
      target: 50000, 
      deadline: 'Dec 31, 2024',
      type: 'vacation',
      history: [5000, 7000, 9000, 11000, 13000, 15000] // Last 6 months of savings amounts
    },
  ]);
  
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
    setIsAddModalVisible(true);
  };

  // Handle add payment
  const handleAddPayment = () => {
    const payment = parseFloat(paymentAmount);
    
    if (isNaN(payment) || payment <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    if (activeTab === 'debts') {
      if (payment > selectedItem.amount) {
        Alert.alert('Payment Too Large', `The payment amount cannot exceed the remaining debt of $${selectedItem.amount}`);
        return;
      }
      
      // Update the debt with the payment
      const updatedDebts = debts.map(debt => {
        if (debt.id === selectedItem.id) {
          const newAmount = debt.amount - payment;
          const newPaidPercentage = Math.round(((debt.totalAmount - newAmount) / debt.totalAmount) * 100);
          
          // Update history - add the new amount to the history
          let newHistory = debt.history || [];
          // If history exists, create a new array with the latest amount
          if (newHistory.length > 0) {
            // Keep only the last 5 entries and add the new amount
            newHistory = [...newHistory.slice(-5), newAmount];
          } else {
            // Initialize with 6 entries of the same value if no history exists
            newHistory = Array(5).fill(debt.amount).concat([newAmount]);
          }
          
          return {
            ...debt,
            amount: newAmount,
            paidPercentage: newPaidPercentage,
            history: newHistory
          };
        }
        return debt;
      });
      
      setDebts(updatedDebts);
      setPaymentModalVisible(false);
      setPaymentAmount('');
      
      // Show success message
      Alert.alert(
        'Payment Added!', 
        `You've paid $${payment} towards your ${selectedItem.name}!`,
        [{ text: 'Great!' }]
      );
    } else {
      // Update the savings goal with the deposit
      const updatedGoals = savings.map(goal => {
        if (goal.id === selectedItem.id) {
          const newAmount = goal.current + payment;
          const finalAmount = newAmount > goal.target ? goal.target : newAmount;
          
          // Update history - add the new amount to the history
          let newHistory = goal.history || [];
          // If history exists, create a new array with the latest amount
          if (newHistory.length > 0) {
            // Keep only the last 5 entries and add the new amount
            newHistory = [...newHistory.slice(-5), finalAmount];
          } else {
            // Initialize with 6 entries of increasing values if no history exists
            newHistory = Array(5).fill(goal.current).concat([finalAmount]);
          }
          
          return {
            ...goal,
            current: finalAmount,
            history: newHistory
          };
        }
        return goal;
      });
      
      setSavings(updatedGoals);
      setPaymentModalVisible(false);
      setPaymentAmount('');
      
      // Show success message
      Alert.alert(
        'Deposit Added!', 
        `You've added $${payment} to your ${selectedItem.name} goal!`,
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
            const updatedDebts = debts.filter(debt => debt.id !== id);
            setDebts(updatedDebts);
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
            const updatedGoals = savings.filter(goal => goal.id !== id);
            setSavings(updatedGoals);
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
      
      // Get the actual debt type (custom or selected)
      const actualDebtType = debtType === 'custom' ? customDebtType : debtType;
      
      // Create the new debt object
      const newDebt = {
        id: newId,
        name: itemName,
        type: actualDebtType,
        amount: parseFloat(itemAmount),
        totalAmount: parseFloat(itemAmount) * 1.2, // Example calculation
        interestRate: parseFloat(interestRate),
        minimumPayment: parseFloat(minimumPayment),
        paidPercentage: 0,
        history: [parseFloat(itemAmount)] // Initialize history with the current amount
      };
      
      // Add the new debt to the state
      setDebts([...debts, newDebt]);
    } else {
      // Generate a new unique ID
      const newId = `savings-${Date.now()}`;
      
      // Get the actual savings type (custom or selected)
      const actualSavingsType = savingsType === 'custom' ? customSavingsType : savingsType;
      
      // Create the new savings goal object
      const newSavingsGoal = {
        id: newId,
        name: itemName,
        type: actualSavingsType,
        current: 0,
        target: parseFloat(itemAmount),
        deadline: targetDate,
        history: [0] // Initialize history with 0
      };
      
      // Add the new savings goal to the state
      setSavings([...savings, newSavingsGoal]);
    }
    
    // Close the modal and reset the form
    setIsAddModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setNewItemType('debt');
    setDebtType('credit');
    setCustomDebtType('');
    setSavingsType('emergency');
    setCustomSavingsType('');
    setItemName('');
    setItemAmount('');
    setInterestRate('');
    setMinimumPayment('');
    setTargetDate('');
  };

  // Function to generate analytics data based on user's debt and savings
  const generateAnalyticsData = () => {
    // Get the last 6 months for labels
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(month.toLocaleString('default', { month: 'short' }));
    }
    
    // Generate debt history data
    if (debts && debts.length > 0) {
      // Calculate total debt for each month across all debts
      const debtData = Array(6).fill(0);
      
      debts.forEach(debt => {
        if (debt.history && debt.history.length === 6) {
          for (let i = 0; i < 6; i++) {
            debtData[i] += debt.history[i];
          }
        }
      });
      
      setDebtHistoryData({
        labels: months,
        datasets: [
          {
            data: debtData,
            color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Red color for debt
            strokeWidth: 2
          }
        ]
      });
    }
    
    // Generate savings history data
    if (savings && savings.length > 0) {
      // Calculate total savings for each month across all savings goals
      const savingsData = Array(6).fill(0);
      
      savings.forEach(goal => {
        if (goal.history && goal.history.length === 6) {
          for (let i = 0; i < 6; i++) {
            savingsData[i] += goal.history[i];
          }
        }
      });
      
      setSavingsHistoryData({
        labels: months,
        datasets: [
          {
            data: savingsData,
            color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Green color for savings
            strokeWidth: 2
          }
        ]
      });
    }
  };
  
  // Generate analytics data when component mounts or when debts/savings change
  useEffect(() => {
    generateAnalyticsData();
  }, [debts, savings]);

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
            <Text style={styles.summaryAmount}>${totalDebt ? totalDebt.toLocaleString() : '0'}</Text>
            <Text style={styles.statLabel}>Total Debt</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryAmount}>${totalSavings ? totalSavings.toLocaleString() : '0'}</Text>
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
        {/* Analytics Graph Section */}
        <View style={styles.analyticsContainer}>
          <Text style={styles.analyticsTitle}>
            {activeTab === 'debts' ? 'Debt Trend' : 'Savings Growth'}
          </Text>
          <View style={styles.chartContainer}>
            {(activeTab === 'debts' && debtHistoryData) || (activeTab === 'savings' && savingsHistoryData) ? (
              <LineChart
                data={activeTab === 'debts' ? debtHistoryData : savingsHistoryData}
                width={width - 40}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => activeTab === 'debts' 
                    ? `rgba(231, 76, 60, ${opacity})` 
                    : `rgba(46, 204, 113, ${opacity})`
                }}
                bezier
                style={styles.chart}
                withVerticalLines={false}
                withHorizontalLines={true}
                withDots={true}
                withShadow={false}
                yAxisLabel="$"
                yAxisSuffix=""
              />
            ) : (
              <View style={[styles.chartContainer, styles.chartPlaceholder]}>
                <Text style={styles.chartPlaceholderText}>Loading chart data...</Text>
              </View>
            )}
          </View>
          {activeTab === 'debts' && debtHistoryData ? (
            <Text style={styles.chartDescription}>
              {debtHistoryData.datasets[0].data[0] - debtHistoryData.datasets[0].data[5] > 0 
                ? `Your debt has decreased by $${(debtHistoryData.datasets[0].data[0] - debtHistoryData.datasets[0].data[5]).toLocaleString()} in the last 6 months. Keep it up!` 
                : debtHistoryData.datasets[0].data[0] - debtHistoryData.datasets[0].data[5] < 0
                  ? `Your debt has increased by $${Math.abs(debtHistoryData.datasets[0].data[0] - debtHistoryData.datasets[0].data[5]).toLocaleString()} in the last 6 months. Let's work on reducing it!`
                  : `Your debt has remained stable over the last 6 months.`
              }
            </Text>
          ) : activeTab === 'savings' && savingsHistoryData ? (
            <Text style={styles.chartDescription}>
              {savingsHistoryData.datasets[0].data[5] - savingsHistoryData.datasets[0].data[0] > 0 
                ? `Your savings have increased by $${(savingsHistoryData.datasets[0].data[5] - savingsHistoryData.datasets[0].data[0]).toLocaleString()} in the last 6 months. Great job!` 
                : savingsHistoryData.datasets[0].data[5] - savingsHistoryData.datasets[0].data[0] < 0
                  ? `Your savings have decreased by $${Math.abs(savingsHistoryData.datasets[0].data[5] - savingsHistoryData.datasets[0].data[0]).toLocaleString()} in the last 6 months. Let's work on building them back up!`
                  : `Your savings have remained stable over the last 6 months.`
              }
            </Text>
          ) : (
            <Text style={styles.chartDescription}>
              Start tracking your {activeTab === 'debts' ? 'debt payments' : 'savings deposits'} to see your progress over time.
            </Text>
          )}
        </View>
        
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
                ? `Remaining: $${selectedItem?.amount.toLocaleString() || '0'}`
                : `Current: $${selectedItem?.current.toLocaleString() || '0'} / $${selectedItem?.target.toLocaleString() || '0'}`
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
        visible={isAddModalVisible}
        onRequestClose={() => {
          setIsAddModalVisible(false);
          resetForm();
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
                <Text style={styles.formLabel}>Debt Type</Text>
                <TouchableOpacity 
                  style={styles.dropdownSelector}
                  onPress={() => {
                    setIsTypePickerVisible(true);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    {debtType === 'credit' ? 'Credit Card' : 
                     debtType === 'student' ? 'Student Loan' : 
                     debtType === 'car' ? 'Car Loan' : 
                     debtType === 'personal' ? 'Personal Loan' : 
                     debtType === 'custom' ? 'Custom' : 'Select Debt Type'}
                  </Text>
                  <FontAwesome5 name="chevron-down" size={16} color="#757575" />
                </TouchableOpacity>
                
                {/* Debt Type Picker Modal */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isTypePickerVisible}
                  onRequestClose={() => setIsTypePickerVisible(false)}
                >
                  <TouchableOpacity 
                    style={styles.pickerModalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsTypePickerVisible(false)}
                  >
                    <View style={styles.pickerModalContent}>
                      <Text style={styles.pickerModalTitle}>Select Debt Type</Text>
                      
                      <TouchableOpacity 
                        style={styles.pickerItem}
                        onPress={() => {
                          setDebtType('credit');
                          setIsTypePickerVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          debtType === 'credit' && styles.pickerItemTextSelected
                        ]}>Credit Card</Text>
                        {debtType === 'credit' && (
                          <FontAwesome5 name="check" size={16} color="#1976D2" />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerItem}
                        onPress={() => {
                          setDebtType('student');
                          setIsTypePickerVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          debtType === 'student' && styles.pickerItemTextSelected
                        ]}>Student Loan</Text>
                        {debtType === 'student' && (
                          <FontAwesome5 name="check" size={16} color="#1976D2" />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerItem}
                        onPress={() => {
                          setDebtType('car');
                          setIsTypePickerVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          debtType === 'car' && styles.pickerItemTextSelected
                        ]}>Car Loan</Text>
                        {debtType === 'car' && (
                          <FontAwesome5 name="check" size={16} color="#1976D2" />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerItem}
                        onPress={() => {
                          setDebtType('personal');
                          setIsTypePickerVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          debtType === 'personal' && styles.pickerItemTextSelected
                        ]}>Personal Loan</Text>
                        {debtType === 'personal' && (
                          <FontAwesome5 name="check" size={16} color="#1976D2" />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerItem}
                        onPress={() => {
                          setDebtType('custom');
                          setIsTypePickerVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          debtType === 'custom' && styles.pickerItemTextSelected
                        ]}>Custom</Text>
                        {debtType === 'custom' && (
                          <FontAwesome5 name="check" size={16} color="#1976D2" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
                
                {debtType === 'custom' && (
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter custom debt type"
                    value={customDebtType}
                    onChangeText={setCustomDebtType}
                  />
                )}
                
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Credit Card"
                  value={itemName}
                  onChangeText={setItemName}
                />
                
                <Text style={styles.formLabel}>Current Amount ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={itemAmount}
                  onChangeText={setItemAmount}
                />
                
                <Text style={styles.formLabel}>Interest Rate (%)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={interestRate}
                  onChangeText={setInterestRate}
                />
                
                <Text style={styles.formLabel}>Minimum Monthly Payment</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={minimumPayment}
                  onChangeText={setMinimumPayment}
                />
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.formLabel}>Savings Type</Text>
                <TouchableOpacity 
                  style={styles.dropdownSelector}
                  onPress={() => {
                    setIsSavingsTypePickerVisible(true);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    {savingsType === 'emergency' ? 'Emergency Fund' : 
                     savingsType === 'vacation' ? 'Vacation' : 
                     savingsType === 'custom' ? 'Custom' : 'Select Savings Type'}
                  </Text>
                  <FontAwesome5 name="chevron-down" size={16} color="#757575" />
                </TouchableOpacity>
                
                {/* Savings Type Picker Modal */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isSavingsTypePickerVisible}
                  onRequestClose={() => setIsSavingsTypePickerVisible(false)}
                >
                  <TouchableOpacity 
                    style={styles.pickerModalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsSavingsTypePickerVisible(false)}
                  >
                    <View style={styles.pickerModalContent}>
                      <Text style={styles.pickerModalTitle}>Select Savings Type</Text>
                      
                      <TouchableOpacity 
                        style={styles.pickerItem}
                        onPress={() => {
                          setSavingsType('emergency');
                          setIsSavingsTypePickerVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          savingsType === 'emergency' && styles.pickerItemTextSelected
                        ]}>Emergency Fund</Text>
                        {savingsType === 'emergency' && (
                          <FontAwesome5 name="check" size={16} color="#1976D2" />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerItem}
                        onPress={() => {
                          setSavingsType('vacation');
                          setIsSavingsTypePickerVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          savingsType === 'vacation' && styles.pickerItemTextSelected
                        ]}>Vacation</Text>
                        {savingsType === 'vacation' && (
                          <FontAwesome5 name="check" size={16} color="#1976D2" />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerItem}
                        onPress={() => {
                          setSavingsType('custom');
                          setIsSavingsTypePickerVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          savingsType === 'custom' && styles.pickerItemTextSelected
                        ]}>Custom</Text>
                        {savingsType === 'custom' && (
                          <FontAwesome5 name="check" size={16} color="#1976D2" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
                
                {savingsType === 'custom' && (
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter custom savings type"
                    value={customSavingsType}
                    onChangeText={setCustomSavingsType}
                  />
                )}
                
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Vacation Fund"
                  value={itemName}
                  onChangeText={setItemName}
                />
                
                <Text style={styles.formLabel}>Target Amount ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={itemAmount}
                  onChangeText={setItemAmount}
                />
                
                <Text style={styles.formLabel}>Target Date</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={targetDate}
                  onChangeText={setTargetDate}
                />
              </View>
            )}
            
            <View style={styles.formButtonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setIsAddModalVisible(false);
                  resetForm();
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
  analyticsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  chartContainer: {
    height: 220,
    marginBottom: 15,
  },
  chart: {
    borderRadius: 16,
  },
  chartDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  chartPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: '#757575',
  },
});

export default MoneyScreen;
