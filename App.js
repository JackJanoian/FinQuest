import React from 'react';
import { StyleSheet, View } from 'react-native';
import NestedApp from './FinQuest/App';

// This is a wrapper that simply renders the nested FinQuest App
export default function App() {
  console.log('Root App.js: Forwarding to nested FinQuest App');
  
  return (
    <View style={styles.container}>
      <NestedApp />
    </View>
  );
}

// Simple container style to ensure the app fills the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
