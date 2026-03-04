import React from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedGradientBackground from '../components/animatedBackground';

const MyCarProfile = () => {
  return (
    <View style={styles.root}>
      <AnimatedGradientBackground />

      <View style={styles.content}>
        {/* your creation page content */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#05030F',
  },
  content: {
    flex: 1,
    padding: 24,
  },
});

export default MyCarProfile;