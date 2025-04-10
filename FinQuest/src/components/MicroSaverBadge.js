import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const MicroSaverBadge = () => {
  return (
    <Image 
      source={require('../BadgeIcons/MicroSaverBadge.png')} 
      style={styles.coinImage} 
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  coinImage: {
    width: 50,
    height: 50,
  },
});

export default MicroSaverBadge;
