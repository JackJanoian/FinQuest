import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a custom storage implementation that handles errors gracefully
class CustomStorage {
  async getItem(key) {
    try {
      // Validate key to ensure it's a proper string
      if (typeof key !== 'string' || key === '@anonymous') {
        console.warn('Invalid storage key:', key);
        return null;
      }
      
      // Ensure key has a proper prefix
      const safeKey = key.startsWith('@') ? key : `@FinQuest:${key}`;
      return await AsyncStorage.getItem(safeKey);
    } catch (error) {
      console.warn('Error in CustomStorage.getItem:', error.message);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      // Validate key and value
      if (typeof key !== 'string' || key === '@anonymous') {
        console.warn('Invalid storage key:', key);
        return Promise.resolve();
      }
      
      if (value === undefined || value === null) {
        console.warn('Attempted to store null/undefined value for key:', key);
        return Promise.resolve();
      }
      
      // Ensure key has a proper prefix
      const safeKey = key.startsWith('@') ? key : `@FinQuest:${key}`;
      const safeValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      return await AsyncStorage.setItem(safeKey, safeValue);
    } catch (error) {
      console.warn('Error in CustomStorage.setItem:', error.message);
      // Return a resolved promise to prevent crashes
      return Promise.resolve();
    }
  }

  async removeItem(key) {
    try {
      // Validate key
      if (typeof key !== 'string' || key === '@anonymous') {
        console.warn('Invalid storage key for removal:', key);
        return Promise.resolve();
      }
      
      // Ensure key has a proper prefix
      const safeKey = key.startsWith('@') ? key : `@FinQuest:${key}`;
      return await AsyncStorage.removeItem(safeKey);
    } catch (error) {
      console.warn('Error in CustomStorage.removeItem:', error.message);
      return Promise.resolve();
    }
  }
  
  // Helper method to clear all app data
  async clearAll() {
    try {
      return await AsyncStorage.clear();
    } catch (error) {
      console.warn('Error in CustomStorage.clearAll:', error.message);
      return Promise.resolve();
    }
  }
}

export default new CustomStorage();
