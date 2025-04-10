import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * A custom checkbox component that doesn't rely on native modules
 * and is fully compatible with Expo
 */
const CustomCheckbox = ({ value, onValueChange, tintColors = { true: '#4CAF50', false: '#757575' } }) => {
  const handlePress = () => {
    if (onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.checkbox, 
        { 
          backgroundColor: value ? tintColors.true : 'transparent',
          borderColor: value ? tintColors.true : tintColors.false
        }
      ]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {value && (
        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomCheckbox;
