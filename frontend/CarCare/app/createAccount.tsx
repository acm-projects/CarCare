import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, Alert, Button, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { globalStyles, GradientText } from '../styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import { auth } from "../firebase";
import { apiFetch } from "../api"; // from app/login.tsx or app/vinEnter.tsx
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import MaskedView from '@react-native-masked-view/masked-view';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';


export default function CreateAccount() {
  
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

  const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
 // SIGN UP (new user)
   const handleSignUp = async () => {
     if (!email || !password) {
       Alert.alert('Missing info', 'Please enter email and password.');
       return;
     }
 
     try {
       const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
 
       const token = await cred.user.getIdToken();
       console.log("FIREBASE ID TOKEN (signup):", token);
 
       const me = await apiFetch("/api/me");
       console.log("BACKEND ME (signup):", me);
 
       Alert.alert('Account created', 'Your account was created successfully!');
       router.push("/vinEnter");
     } catch (err: any) {
       Alert.alert("Sign up failed", err?.message ?? "Unknown error");
     }
   };

  return (
      <LinearGradient
    colors={['#386FA4', '#84D2F6']}
    start={{ x: 1, y: 0.5 }}
    end={{ x: 0, y: 0.5 }}
    style={{ flex: 1 }}
  >
    <View style={globalStyles.container2}>
      <TouchableOpacity style={{ alignSelf: 'flex-start', bottom: 350, right: 10}}
              onPress={() => { router.back() }}>
              <Text style={globalStyles.whiteBackButton}>{`< Back`}</Text>
      </TouchableOpacity>
      <View style =  {{position: 'absolute', top: 100, alignItems: 'center'}}>
        <Image source = {require('../assets/images/CarCareLogoNoTextWhite.png')}
          style={{width: 100, height: 100}}></Image>
        <Text style = {globalStyles.whiteTitle}>Welcome!</Text>
        <Text style = {globalStyles.whiteTitle}>Sign up</Text>
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
            placeholderTextColor={'#8d8d8d'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            />
          <GradientText style={globalStyles.gradientH2}>Password</GradientText>
          <TextInput
            style={styles.logInBox}
            placeholder="Create password"
            placeholderTextColor={'#8d8d8d'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry

            />
            </View>
            <TouchableOpacity style={[globalStyles.whiteButton, {bottom: 75, position:'absolute'}]} onPress={handleSignUp}>
              <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#53c1f3', '#3272ae']} style={globalStyles.gradientButton}>
                <Text style={globalStyles.whiteButtonText}>
                  Sign up
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
