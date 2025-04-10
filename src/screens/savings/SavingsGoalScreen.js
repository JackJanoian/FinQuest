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

// This would be a custom SVG component in a real app
const PiggyBank = ({ fillPercentage }) => {
  return (
    <View style={styles.piggyContainer}>
      <View style={styles.piggyOutline}>
        <View 
          style={[
            styles.piggyFill, 
            { height: `${fillPercentage}%` }
          ]} 
        />
      </View>
      <View style={styles.piggyEars}>
        <View style={styles.piggyEar} />
        <View style={styles.piggyEar} />
      </View>
      <View style={styles.piggySnout}>
        <View style={styles.piggyNostril} />
        <View style={styles.piggyNostril} />
      </View>
    </View>
  );
};

const SavingsGoalScreen = () => {
  // Mock data - would come from your Supabase database in a real app
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: 'Emergency Fund', current: 1250, target: 5000, deadline: '2025-06-30' },
    { id: 2, name: 'Vacation', current: 800, target: 2000, deadline: '2025-08-15' },
    { id: 3, name: 'New Laptop', current: 400, target: 1500, deadline: '2025-05-01' },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;
  
  const handleGoalPress = (goal) => {
    setSelectedGoal(goal);
    setModalVisible(true);
    setDepositAmount('');
  };
  
  const handleAddDeposit = () => {
    const deposit = parseFloat(depositAmount);
    
    if (isNaN(deposit) || deposit <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid deposit amount');
      return;
    }
    
    // Update the goal with the deposit
    const updatedGoals = savingsGoals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const newAmount = goal.current + deposit;
        return {
          ...goal,
          current: newAmount > goal.target ? goal.target : newAmount
        };
      }
      return goal;
    });
    
    setSavingsGoals(updatedGoals);
    setModalVisible(false);
    
    // Show success message
    Alert.alert(
      'Deposit Added!', 
      `You've added $${deposit} to your ${selectedGoal.name} goal!`,
      [{ text: 'Great!' }]
    );
  };
  
  const handleAddGoal = () => {
    // This would open a form to add a new savings goal in a real app
    Alert.alert(
      'Coming Soon', 
      'The ability to add new savings goals will be available in the next update!',
      [{ text: 'OK' }]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Savings Goals</Text>
          <Text style={styles.subtitle}>Watch your piggy bank grow!</Text>
        </View>
        
        <View style={styles.overviewContainer}>
          <View style={styles.piggyBankWrapper}>
            <PiggyBank fillPercentage={overallProgress} />
            <Text style={styles.overallProgressText}>{overallProgress.toFixed(1)}%</Text>
          </View>
          
          <View style={styles.overviewStats}>
            <Text style={styles.overviewTitle}>Total Savings</Text>
            <Text style={styles.overviewAmount}>${totalSaved.toFixed(2)}</Text>
            <Text style={styles.overviewTarget}>of ${totalTarget.toFixed(2)} target</Text>
          </View>
        </View>
        
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Your Savings Goals</Text>
          
          {savingsGoals.map(goal => {
            const progressPercentage = (goal.current / goal.target) * 100;
            
            return (
              <TouchableOpacity 
                key={goal.id} 
                style={styles.goalCard}
                onPress={() => handleGoalPress(goal)}
              >
                <View style={styles.goalHeader}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalDeadline}>Due: {formatDate(goal.deadline)}</Text>
                </View>
                
                <View style={styles.goalProgress}>
                  <View style={styles.progressContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${progressPercentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)} ({progressPercentage.toFixed(1)}%)
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
            <Text style={styles.addButtonText}>+ Add New Savings Goal</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Savings Tips</Text>
          <Text style={styles.tipText}>• Set up automatic transfers to your savings</Text>
          <Text style={styles.tipText}>• Save unexpected income like tax refunds</Text>
          <Text style={styles.tipText}>• Try the 50/30/20 rule: needs, wants, and savings</Text>
        </View>
      </ScrollView>
      
      {/* Deposit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add to {selectedGoal?.name}
            </Text>
            
            <Text style={styles.modalSubtitle}>
              Current: ${selectedGoal?.current} / ${selectedGoal?.target}
            </Text>
            
            <TextInput
              style={styles.depositInput}
              placeholder="Enter deposit amount"
              keyboardType="numeric"
              value={depositAmount}
              onChangeText={setDepositAmount}
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
                onPress={handleAddDeposit}
              >
                <Text style={styles.confirmButtonText}>Add Deposit</Text>
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
    backgroundColor: '#4CAF50', // Green
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
  overviewContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  piggyBankWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  piggyContainer: {
    width: 100,
    height: 80,
    position: 'relative',
  },
  piggyOutline: {
    width: 80,
    height: 60,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF9800',
    overflow: 'hidden',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  piggyFill: {
    width: '100%',
    backgroundColor: '#FFCC80',
    position: 'absolute',
    bottom: 0,
  },
  piggyEars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 90,
    position: 'absolute',
    top: 0,
    left: 5,
  },
  piggyEar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF9800',
  },
  piggySnout: {
    width: 30,
    height: 20,
    borderRadius: 15,
    backgroundColor: '#FF9800',
    position: 'absolute',
    right: 0,
    top: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  piggyNostril: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E65100',
  },
  overallProgressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  overviewStats: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  overviewTitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 5,
  },
  overviewAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  overviewTarget: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  goalsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 15,
    marginLeft: 5,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
  goalDeadline: {
    fontSize: 14,
    color: '#757575',
  },
  goalProgress: {
    marginBottom: 5,
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50', // Green
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50', // Green
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    margin: 15,
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
  depositInput: {
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

export default SavingsGoalScreen;
