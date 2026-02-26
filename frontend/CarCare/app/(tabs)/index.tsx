import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, TextInput, Alert, Button, View, type TextStyle } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {

  const handlePress = () => {
    Alert.alert('CarCare Log In', 'You have logged in successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style = {styles.headerText}>Log In</Text>
        <View style={styles.logInBox}>
          <TextInput style = {styles.logInText} placeholder="Enter email"></TextInput>
        </View>
        <View style = {styles.logInBox}>
          <TextInput style = {styles.logInText} placeholder="Enter password" secureTextEntry= {true}></TextInput>
        </View>

        <Button onPress={handlePress} title = "Log In"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#386FA4',
  },

  headerText: {
    color: '#ffffff',
    fontSize: 50,
  },

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
