
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { apiFetch } from "../api"; // from app/login.tsx or app/vinEnter.tsx
import { auth } from "../firebase";
import { globalStyles, GradientText } from '../styles/global';

export default function LogIn() {
  
  {/*Frontend Functions*/}
  const { height } = useWindowDimensions();
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      //Duration in ms
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  {/*Backend Functions*/}
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
      colors={['#3272ae', '#53c1f3']}
      start={{ x: 1, y: 0.5 }}
      end={{ x: 0, y: 0.5 }}
      style={{ flex: 1 }}
    >
    <View style={globalStyles.container}>
      <TouchableOpacity style={{ alignSelf: 'flex-start', bottom: 350, right: 10}}
        onPress={() => { router.back() }}>
        <Text style={globalStyles.whiteH1}>{`< Back`}</Text>
      </TouchableOpacity>
        <View style =  {{position: 'absolute', top: 100, alignItems: 'center'}}>
        <Image source = {require('../assets/images/CarCareLogoNoTextWhite.png')}
          style={{width: 100, height: 100}}></Image>
        <Text style = {globalStyles.whiteTitle}>Welcome back!</Text>
        <Text style = {globalStyles.whiteTitle}>Log in</Text>
      </View>
      <Animated.View
        style={{
            // Position the view at the bottom of its container
            position: 'absolute',
            bottom: 0, 
            left: 0,
            right: 0,
            // Apply the animated translateY value
            transform: [{ translateY: slideAnim }],
          }}>
        <View style = {[styles.logInContainer, { height: .6 * height, width: '100%'}]}>
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
              <TouchableOpacity
                style={[globalStyles.gradientButton, {bottom: 75, position: 'absolute'}]}
                onPress={() => router.push('/vinEnter')}
              >
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#53c1f3', '#3272ae']} style={globalStyles.gradientButton}>
                  <Text style={globalStyles.whiteButtonText}>
                    Log In
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
          </View>
        </Animated.View>
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

  tempGarageButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E8F6FF',
    borderWidth: 1,
    borderColor: '#5FA8D3',
  },

  tempGarageButtonText: {
    color: '#3272ae',
    fontSize: 14,
    fontWeight: '600',
  },

});
