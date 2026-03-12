import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, TextInput, Alert, Button, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useRouter } from 'expo-router';
import { globalStyles, GradientText } from '../styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { apiFetch } from "../api"; // from app/login.tsx or app/vinEnter.tsx
import MaskedView from '@react-native-masked-view/masked-view';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export default function logIn() {
  
  const { height } = useWindowDimensions();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOG IN (existing user)
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      const token = await cred.user.getIdToken();
      console.log("FIREBASE ID TOKEN (login):", token);

      const me = await apiFetch("/api/me");
      console.log("BACKEND ME (login):", me);

      Alert.alert('CarCare Log In', 'You have logged in successfully!');
      router.push("../vinEnter");
    } catch (err: any) {
      Alert.alert("Login failed", err?.message ?? "Unknown error");
    }
  };

  

  return (
      <LinearGradient
    colors={['#386FA4', '#84D2F6']}
    start={{ x: 1, y: 0.5 }}
    end={{ x: 0, y: 0.5 }}
    style={{ flex: 1 }}
  >
    <View style={globalStyles.container}>
      <View style =  {{position: 'absolute', top: 100, alignItems: 'center'}}>
        <Image source = {require('../assets/images/carCareLogoWhite.png')}
          style={{width: 100, height: 100}}></Image>
        <Text style = {globalStyles.whiteTitle}>Welcome back!</Text>
        <Text style = {globalStyles.whiteTitle}>Log in</Text>
      </View>
      <View style = {[styles.logInContainer, { height: .55 * height}]}>
        <View style = {styles.subContainer}>
          <GradientText style={globalStyles.gradientH2}>Email</GradientText>
          <TextInput
            style={styles.logInBox}
            placeholder="Enter email"
            placeholderTextColor={'#8d8d8d'}/>
          <GradientText style={globalStyles.gradientH2}>Password</GradientText>
          <TextInput
            style={styles.logInBox}
            placeholder="Enter password"
            placeholderTextColor={'#8d8d8d'}
            />
            </View>
            <TouchableOpacity style={[globalStyles.whiteButton, {bottom: 75, position: 'absolute'}]} onPress={handleLogin}>
              <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#84D2F6', '#386FA4']} style={globalStyles.gradientButton}>
                <Text style={globalStyles.whiteButtonText}>
                  Log In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
      </View>
    </View>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({
  
  subContainer: {
    width: 300,
    gap: 20,
  },

  logInContainer:{
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    height: 50,
    borderRadius: 50,
    width: 415,
    padding: 35,
    gap: 125,
    alignItems: 'center',
  },

  logInBox: {
    borderColor: 'transparent',
    borderWidth: 0.75,
    borderBottomColor: '#8d8d8d',
    width: 300,
    paddingBottom: 5
  },

});