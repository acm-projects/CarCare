import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, TextInput, Alert, Button, View, type TextStyle } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { globalStyles } from '../styles/global';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {

  const handlePress = () => {
    Alert.alert('CarCare Log In', 'You have logged in successfully!');
  };

  return (
      <LinearGradient
    colors={['#386FA4', '#84D2F6']}
    start={{ x: 1, y: 0.5 }}
    end={{ x: 0, y: 0.5 }}
    style={{ flex: 1 }}
  >
    <View style={globalStyles.container}>
      <Text style={globalStyles.whiteTitle}>Log In</Text>

      <View style={styles.logInBox}>
        <TextInput
          style={styles.logInText}
          placeholder="Enter email"
        />
      </View>

      <View style={styles.logInBox}>
        <TextInput
          style={styles.logInText}
          placeholder="Enter password"
          secureTextEntry
        />
      </View>

      <Button onPress={handlePress} title="Log In" />
    </View>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({
  
  logInBox: {
    borderColor: '#ffffff',
    borderRadius: 25,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 5,
  },

  logInText: {
    color: '#ffffff',
  },

  logInButton: {
    backgroundColor: '#ffffff',
    color: '#386FA4'
  }
});
