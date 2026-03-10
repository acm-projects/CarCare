import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, TextInput, Alert, Button, View, type TextStyle } from 'react-native';
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

export default function HomeScreen() {
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
      router.push("/vinEnter");
    } catch (err: any) {
      Alert.alert("Login failed", err?.message ?? "Unknown error");
    }
  };

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
      <View style={globalStyles.container}>
        <Text style={globalStyles.whiteTitle}>Log In</Text>

        <View style={styles.logInBox}>
          <TextInput
            style={styles.logInText}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>

        <View style={styles.logInBox}>
          <TextInput
            style={styles.logInText}
            placeholder="Enter password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>

        <Button onPress={handleLogin} title="Log In" />
        <View style={{ height: 10 }} />
        <Button onPress={handleSignUp} title="Sign Up" />

        <GradientText>Hello there</GradientText>
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
    marginBottom: 10,
    width: "100%",
  },

  logInText: {
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  logInButton: {
    backgroundColor: '#ffffff',
    color: '#386FA4'
  }
});