import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert,
  SafeAreaView
} from 'react-native';

// This would be a custom component with animations in a real app
const DebtMonster = ({ name, amount, totalAmount, color, onPress }) => {
  // Calculate size based on remaining debt (smaller as debt is paid off)
  const sizePercentage = Math.max(0.3, amount / totalAmount);
  
  return (
    <TouchableOpacity 
      style={[
        styles.monsterContainer, 
        { 
          backgroundColor: color,
          transform: [{ scale: sizePercentage }]
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.monsterBody}>
        <Text style={styles.monsterEye}>👁️</Text>
        <Text style={styles.monsterEye}>👁️</Text>
      </View>
      <Text style={styles.monsterName}>{name}</Text>
      <Text style={styles.monsterAmount}>${amount}</Text>
    </TouchableOpacity>
  );
};

const DebtTrackerScreen = () => {
  // Mock data - would come from your Supabase database in a real app
  const [debts, setDebts] = useState([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalOriginalDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
  const progressPercentage = (1 - (totalDebt / totalOriginalDebt)) * 100;
  
  const handleDebtPress = (debt) => {
    setSelectedDebt(debt);
    setModalVisible(true);
    setPaymentAmount('');
  };
  
  const handleAddPayment = () => {
    const payment = parseFloat(paymentAmount);
    
    if (isNaN(payment) || payment <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount');
      return;
    }
    
    if (payment > selectedDebt.amount) {
      Alert.alert('Payment Too Large', `The payment amount cannot exceed the remaining debt of $${selectedDebt.amount}`);
      return;
    }
    
    // Update the debt with the payment
    const updatedDebts = debts.map(debt => {
      if (debt.id === selectedDebt.id) {
        return {
          ...debt,
          amount: debt.amount - payment
        };
      }
      return debt;
    });
    
    setDebts(updatedDebts);
    setModalVisible(false);
    
    // Show success message
    Alert.alert(
      'Payment Added!', 
      `You've defeated $${payment} of the ${selectedDebt.name} Monster!`,
      [{ text: 'Awesome!' }]
    );
  };
  
  const handleAddDebt = () => {
    // This would open a form to add a new debt in a real app
    Alert.alert(
      'Coming Soon', 
      'The ability to add new debt monsters will be available in the next update!',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Debt Monsters</Text>
          <Text style={styles.subtitle}>Defeat them with regular payments!</Text>
        </View>
        
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Total Progress</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {progressPercentage.toFixed(1)}% Defeated • ${(totalOriginalDebt - totalDebt).toFixed(2)} / ${totalOriginalDebt.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.monstersContainer}>
          {debts.map(debt => (
            <DebtMonster
              key={debt.id}
              name={debt.name}
              amount={debt.amount}
              totalAmount={debt.totalAmount}
              color={debt.color}
              onPress={() => handleDebtPress(debt)}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddDebt}>
          <Text style={styles.addButtonText}>+ Add New Debt Monster</Text>
        </TouchableOpacity>
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Debt Slaying Tips</Text>
          <Text style={styles.tipText}>• Focus on high-interest debts first</Text>
          <Text style={styles.tipText}>• Make regular payments, even if small</Text>
          <Text style={styles.tipText}>• Consider debt consolidation for multiple monsters</Text>
        </View>
      </ScrollView>
      
      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Make a Payment on {selectedDebt?.name}
            </Text>
            
            <Text style={styles.modalSubtitle}>
              Current Balance: ${selectedDebt?.amount}
            </Text>
            
            <TextInput
              style={styles.paymentInput}
              placeholder="Enter payment amount"
              keyboardType="numeric"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddPayment}
              >
                <Text style={styles.confirmButtonText}>Add Payment</Text>
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
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    backgroundColor: '#F44336', // Red
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  progressSection: {
    padding: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 10,
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50', // Green
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#757575',
  },
  monstersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  monsterContainer: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  monsterBody: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 5,
  },
  monsterEye: {
    fontSize: 16,
  },
  monsterName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  monsterAmount: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    margin: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F44336', // Red
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 20,
  },
  paymentInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#757575',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50', // Green
    marginLeft: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default DebtTrackerScreen;
