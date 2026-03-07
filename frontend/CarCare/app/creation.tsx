import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedGradientBackground from '../components/animatedBackground';

const MyCarProfile = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push('/myGarage');
  };

  return (
    <View style={styles.root}>
      <AnimatedGradientBackground />

      <View style={styles.content}>
        {/* your creation page content */}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
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
  buttonContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#5BA3D0',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MyCarProfile;