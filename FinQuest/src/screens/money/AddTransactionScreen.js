import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFinancialData } from '../../context/FinancialDataContext';

const AddTransactionScreen = () => {
  const navigation = useNavigation();
  const { addTransaction } = useFinancialData();
  
  // State for form
  const [transactionType, setTransactionType] = useState('expense'); // 'expense' or 'income'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  // Categories
  const expenseCategories = [
    'Food', 'Transportation', 'Housing', 'Entertainment', 
    'Utilities', 'Healthcare', 'Education', 'Shopping', 'Other'
  ];
  
  const incomeCategories = [
    'Salary', 'Freelance', 'Gift', 'Investment', 'Refund', 'Other'
  ];
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate inputs
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    
    // Create transaction object
    const transaction = {
      id: `transaction-${Date.now()}`,
      type: transactionType,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString(),
    };
    
    // Add transaction to context
    addTransaction(transaction);
    
    // Show success message
    Alert.alert(
      'Success', 
      'Transaction added successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Transaction</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Transaction Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              transactionType === 'expense' && styles.activeTypeButton
            ]}
            onPress={() => setTransactionType('expense')}
          >
            <Text style={[
              styles.typeButtonText, 
              transactionType === 'expense' && styles.activeTypeButtonText
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              transactionType === 'income' && styles.activeTypeButton
            ]}
            onPress={() => setTransactionType('income')}
          >
            <Text style={[
              styles.typeButtonText, 
              transactionType === 'income' && styles.activeTypeButtonText
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor="#BDBDBD"
            />
          </View>
        </View>
        
        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {(transactionType === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.activeCategoryButton
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  category === cat && styles.activeCategoryButtonText
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor="#BDBDBD"
            multiline
          />
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTypeButton: {
    backgroundColor: '#1976D2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  currencySymbol: {
    fontSize: 18,
    color: '#333333',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 15,
    color: '#333333',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  activeCategoryButton: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#757575',
  },
  activeCategoryButtonText: {
    color: '#FFFFFF',
  },
  descriptionInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#333333',
  },
  submitButton: {
    backgroundColor: '#1976D2',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AddTransactionScreen;
