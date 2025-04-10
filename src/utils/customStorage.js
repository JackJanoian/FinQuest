import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Create a custom storage implementation that handles errors gracefully
class CustomStorage {
  constructor() {
    this.initialized = false;
    this.storagePrefix = 'finquest_';
  }

  getKeyWithPrefix(key) {
    // Ensure keys are properly namespaced and don't contain problematic characters
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    return `${this.storagePrefix}${sanitizedKey}`;
  }

  async getItem(key) {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      console.log('Getting item:', prefixedKey);
      const value = await AsyncStorage.getItem(prefixedKey);
      console.log('Got value:', value ? 'exists' : 'null');
      return value;
    } catch (error) {
      console.error('Error in CustomStorage.getItem:', error);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      console.log('Setting item:', prefixedKey);
      
      // Ensure value is a string
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(prefixedKey, stringValue);
      console.log('Item set successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error in CustomStorage.setItem:', error);
      return Promise.resolve();
    }
  }

  async removeItem(key) {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      console.log('Removing item:', prefixedKey);
      await AsyncStorage.removeItem(prefixedKey);
      console.log('Item removed successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error in CustomStorage.removeItem:', error);
      return Promise.resolve();
    }
  }

  // Helper method to clear all storage (useful for debugging)
  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const ourKeys = keys.filter(key => key.startsWith(this.storagePrefix));
      await AsyncStorage.multiRemove(ourKeys);
      console.log('Storage cleared successfully');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export default new CustomStorage();
