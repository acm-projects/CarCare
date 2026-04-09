import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, TextInput, Alert, Button, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { globalStyles, GradientText } from '../styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { apiFetch } from '../api';


export default function CarNameEnter() {
  
  const { height } = useWindowDimensions();
  const router = useRouter();
  const { vin } = useLocalSearchParams<{ vin: string }>();
  const [carName, setCarName] = useState("");
  
  const handleDone = async () => {
    const cleanedName = carName.trim();

    if (!vin) {
      Alert.alert("Missing VIN", "No saved car was found for naming.");
      return;
    }

    if (!cleanedName) {
      Alert.alert("Missing car name", "Please enter a name for your car.");
      return;
    }

    try {
      await apiFetch(`/api/cars/${vin}/name`, {
        method: "PATCH",
        body: JSON.stringify({
          displayName: cleanedName,
        }),
      });

      Alert.alert("Success", "Car name saved.");
      router.push("../myGarage");
    } catch (err: any) {
      Alert.alert("Error saving car name", err?.message ?? "Unknown error");
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
        <Text style = {globalStyles.whiteTitle}>Create your car profile</Text>
        <Image source = {require('../assets/images/CarCareLogoGearWhite.png')}
          style={{width: 250, height:250, top: 150, position: 'absolute'}}></Image>
      </View>
      <View style = {[styles.logInContainer, { height: .55 * height}]}>
        <View style = {styles.topSection}>
          <View style = {styles.subContainer}>
            <GradientText style={globalStyles.gradientH2}>Car Name</GradientText>
            <TextInput
              style={styles.logInBox}
              placeholder="Enter car's name"
              placeholderTextColor={'#8d8d8d'}
              value={carName}
              onChangeText={setCarName}
              />
            <Text style = {globalStyles.grayP}>Create a unique name for your car to easily keep track of your car.</Text>
          </View>
        </View>
        <View>
            <TouchableOpacity style={globalStyles.whiteButton} onPress={handleDone}>
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#84D2F6', '#386FA4']} style={globalStyles.gradientButton}>
                    <Text style={globalStyles.whiteButtonText}>
                    Done
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.whiteButton} onPress={() => router.push('../vinEnter')}>
                <Text style = {[globalStyles.grayH2, {textAlign: 'center'}]}>Back</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({
  
topSection: {
  flex:3,
  justifyContent: 'center',
  alignItems: 'center',
},

bottomSection: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 15,
  paddingBottom: 60,
},

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
