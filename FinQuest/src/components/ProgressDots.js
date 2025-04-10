import React from 'react';
import { View, StyleSheet } from 'react-native';

export const ProgressDots = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.progressContainer}>
      {[...Array(totalSteps)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            currentStep > index ? styles.progressDotActive : null,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 20 
  },
  progressDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#CCC', 
    marginHorizontal: 4 
  },
  progressDotActive: { 
    backgroundColor: '#4CAF50' 
  },
});
