import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

// Create the context
const FinancialDataContext = createContext();

// Create a provider component
export const FinancialDataProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Initialize state for financial data
  const [debts, setDebts] = useState([]);
  const [savings, setSavings] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [dailyTasksCompleted, setDailyTasksCompleted] = useState({
    debtPayment: false,
    savingsDeposit: false
  });
  const [lastTaskCheckDate, setLastTaskCheckDate] = useState(null);
  
  // Calculate totals
  const totalDebt = debts.reduce((sum, debt) => sum + (debt.amount || 0), 0);
  const totalSavings = savings.reduce((sum, goal) => sum + (goal.current || 0), 0);
  
  // Load data from AsyncStorage when component mounts or user changes
  useEffect(() => {
    const loadFinancialData = async () => {
      try {
        if (user) {
          // Load debts
          const storedDebts = await AsyncStorage.getItem(`debts_${user.id}`);
          if (storedDebts) {
            setDebts(JSON.parse(storedDebts));
          }
          
          // Load savings
          const storedSavings = await AsyncStorage.getItem(`savings_${user.id}`);
          if (storedSavings) {
            setSavings(JSON.parse(storedSavings));
          }
          
          // Load XP
          const storedXP = await AsyncStorage.getItem(`xp_${user.id}`);
          if (storedXP) {
            setTotalXP(parseInt(storedXP));
          }
          
          // Load transactions
          const storedTransactions = await AsyncStorage.getItem(`transactions_${user.id}`);
          if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
          }
          
          // Load daily tasks completion status
          const storedTasksStatus = await AsyncStorage.getItem(`dailyTasks_${user.id}`);
          if (storedTasksStatus) {
            const { tasks, lastCheckDate } = JSON.parse(storedTasksStatus);
            
            // Check if we need to reset tasks for a new day
            const today = new Date().toISOString().split('T')[0];
            if (lastCheckDate !== today) {
              // Reset tasks for a new day
              setDailyTasksCompleted({
                debtPayment: false,
                savingsDeposit: false
              });
              setLastTaskCheckDate(today);
            } else {
              // Use stored task status
              setDailyTasksCompleted(tasks);
              setLastTaskCheckDate(lastCheckDate);
            }
          } else {
            // Initialize with today's date
            setLastTaskCheckDate(new Date().toISOString().split('T')[0]);
          }
        }
      } catch (error) {
        console.error('[FinancialDataContext] Error loading financial data:', error);
      }
    };
    
    loadFinancialData();
  }, [user]);
  
  // Save debts to AsyncStorage whenever they change
  useEffect(() => {
    const saveDebts = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem(`debts_${user.id}`, JSON.stringify(debts));
          
          // Update the financial summary in userData
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsedData = JSON.parse(userData);
            await AsyncStorage.setItem('userData', JSON.stringify({
              ...parsedData,
              financialInfo: {
                ...parsedData.financialInfo,
                totalDebt
              }
            }));
          }
        }
      } catch (error) {
        console.error('[FinancialDataContext] Error saving debts:', error);
      }
    };
    
    saveDebts();
  }, [debts, user]);
  
  // Save savings to AsyncStorage whenever they change
  useEffect(() => {
    const saveSavings = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem(`savings_${user.id}`, JSON.stringify(savings));
          
          // Update the financial summary in userData
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsedData = JSON.parse(userData);
            await AsyncStorage.setItem('userData', JSON.stringify({
              ...parsedData,
              financialInfo: {
                ...parsedData.financialInfo,
                totalSavings
              }
            }));
          }
        }
      } catch (error) {
        console.error('[FinancialDataContext] Error saving savings:', error);
      }
    };
    
    saveSavings();
  }, [savings, user]);
  
  // Save XP to AsyncStorage whenever it changes
  useEffect(() => {
    const saveXP = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem(`xp_${user.id}`, JSON.stringify(totalXP));
          
          // Update the financial summary in userData
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsedData = JSON.parse(userData);
            await AsyncStorage.setItem('userData', JSON.stringify({
              ...parsedData,
              financialInfo: {
                ...parsedData.financialInfo,
                totalXP
              }
            }));
          }
        }
      } catch (error) {
        console.error('[FinancialDataContext] Error saving XP:', error);
      }
    };
    
    saveXP();
  }, [totalXP, user]);
  
  // Save transactions to AsyncStorage
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
        }
      } catch (error) {
        console.error('Error saving transactions:', error);
      }
    };
    
    saveTransactions();
  }, [transactions, user]);
  
  // Save daily tasks completion status to AsyncStorage
  useEffect(() => {
    const saveDailyTasksStatus = async () => {
      try {
        if (user && lastTaskCheckDate) {
          const tasksData = {
            tasks: dailyTasksCompleted,
            lastCheckDate: lastTaskCheckDate
          };
          await AsyncStorage.setItem(`dailyTasks_${user.id}`, JSON.stringify(tasksData));
        }
      } catch (error) {
        console.error('Error saving daily tasks status:', error);
      }
    };
    
    saveDailyTasksStatus();
  }, [dailyTasksCompleted, lastTaskCheckDate, user]);
  
  // Function to add a debt
  const addDebt = (newDebt) => {
    setDebts(prevDebts => [...prevDebts, newDebt]);
  };
  
  // Function to update a debt
  const updateDebt = (updatedDebt) => {
    setDebts(prevDebts => 
      prevDebts.map(debt => debt.id === updatedDebt.id ? updatedDebt : debt)
    );
  };
  
  // Function to delete a debt
  const deleteDebt = (debtId) => {
    setDebts(prevDebts => prevDebts.filter(debt => debt.id !== debtId));
  };
  
  // Function to add a savings goal
  const addSavingsGoal = (newGoal) => {
    setSavings(prevSavings => [...prevSavings, newGoal]);
  };
  
  // Function to update a savings goal
  const updateSavingsGoal = (updatedGoal) => {
    setSavings(prevSavings => 
      prevSavings.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal)
    );
  };
  
  // Function to delete a savings goal
  const deleteSavingsGoal = (goalId) => {
    setSavings(prevSavings => prevSavings.filter(goal => goal.id !== goalId));
  };
  
  // Function to add XP
  const addXP = (amount) => {
    setTotalXP(prevXP => prevXP + amount);
  };
  
  // Add a new transaction
  const addTransaction = (transaction) => {
    setTransactions(prevTransactions => {
      const newTransactions = [...prevTransactions, transaction];
      return newTransactions;
    });
    
    // Add XP for tracking finances
    addXP(10);
  };
  
  // Get recent transactions (limited to a specific count)
  const getRecentTransactions = (count = 5) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, count);
  };
  
  // Function to update a debt with a payment
  const makeDebtPayment = (debtId, paymentAmount) => {
    setDebts(prevDebts => {
      const updatedDebts = prevDebts.map(debt => {
        if (debt.id === debtId) {
          // Calculate the new amount and paid percentage
          const newAmount = debt.amount - paymentAmount;
          const newPaidPercentage = Math.round(((debt.totalAmount - newAmount) / debt.totalAmount) * 100);
          
          // Add to the history
          const currentDate = new Date();
          const newHistory = [...(debt.history || []), newAmount];
          const newHistoryDates = [...(debt.historyDates || []), currentDate.toISOString()];
          
          return {
            ...debt,
            amount: newAmount,
            paidPercentage: newPaidPercentage,
            history: newHistory,
            historyDates: newHistoryDates
          };
        }
        return debt;
      });
      
      // Mark the debt payment task as completed
      if (!dailyTasksCompleted.debtPayment) {
        setDailyTasksCompleted(prev => ({
          ...prev,
          debtPayment: true
        }));
        
        // Add XP for completing the task
        addXP(25);
        
        // Show notification
        Alert.alert(
          "Task Completed!",
          "You've made a debt payment and earned 25 XP. Keep up the good work!",
          [{ text: "Great!" }]
        );
      }
      
      return updatedDebts;
    });
  };
  
  // Function to update a savings goal with a deposit
  const makeSavingsDeposit = (savingsId, depositAmount) => {
    setSavings(prevSavings => {
      const updatedSavings = prevSavings.map(goal => {
        if (goal.id === savingsId) {
          // Calculate the new amount
          const newAmount = goal.current + depositAmount;
          
          // Add to the history
          const currentDate = new Date();
          const newHistory = [...(goal.history || []), newAmount];
          const newHistoryDates = [...(goal.historyDates || []), currentDate.toISOString()];
          
          return {
            ...goal,
            current: newAmount,
            history: newHistory,
            historyDates: newHistoryDates
          };
        }
        return goal;
      });
      
      // Mark the savings deposit task as completed
      if (!dailyTasksCompleted.savingsDeposit) {
        setDailyTasksCompleted(prev => ({
          ...prev,
          savingsDeposit: true
        }));
        
        // Add XP for completing the task
        addXP(25);
        
        // Show notification
        Alert.alert(
          "Task Completed!",
          "You've made a savings deposit and earned 25 XP. Keep up the good work!",
          [{ text: "Great!" }]
        );
      }
      
      return updatedSavings;
    });
  };
  
  // Function to complete a mini quest
  const completeMiniQuest = (questId, reward) => {
    // Add XP for completing the quest
    addXP(reward);
    
    // Show notification
    Alert.alert(
      "Quest Completed!",
      `You've completed a quest and earned ${reward} XP!`,
      [{ text: "Awesome!" }]
    );
  };
  
  return (
    <FinancialDataContext.Provider
      value={{
        debts,
        savings,
        totalDebt,
        totalSavings,
        totalXP,
        transactions,
        dailyTasksCompleted,
        getRecentTransactions,
        addDebt,
        updateDebt,
        deleteDebt,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        addXP,
        addTransaction,
        makeDebtPayment,
        makeSavingsDeposit,
        completeMiniQuest
      }}
    >
      {children}
    </FinancialDataContext.Provider>
  );
};

// Custom hook to use the financial data context
export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
