import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '@/styles/global';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Settings() {

  const router = useRouter();
  const { height } = useWindowDimensions();

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, styles.scrollContentOverride]}
      showsVerticalScrollIndicator={false}
    >
    <View style={[globalStyles.container]}>
      {/*Settings container. Includes profile, password, and notificaiton settings*/}
        <View style={styles.topSection}>
          <GradientText style = {[globalStyles.gradientTitle, {paddingBottom: 25}]}>Settings</GradientText>
          <View style = {[styles.whiteContainer, { height: .3 * height}]}>
            <View style = {styles.subContainer}>
              <GradientText style={globalStyles.gradientH2}>Account</GradientText>
              <View style = {styles.settingsContainer}>
                <Ionicons name="person-outline" size={30} color='#8d8d8d' />
                <Text style = {globalStyles.grayP}>Profile</Text>
              </View>
              <View style = {styles.settingsContainer}>
                <Ionicons name="lock-closed-outline" size={30} color='#8d8d8d' />
                <Text style = {globalStyles.grayP}>Password</Text>
              </View>
              <View style = {styles.settingsContainer}>
                <Ionicons name="notifications-outline" size={30} color='#8d8d8d' />
                <Text style = {globalStyles.grayP}>Notifications</Text>
              </View>
            </View>
          </View>
        </View>
        {/*More container, includes "about" tab*/}
        <View style={styles.bottomSection}>
          <View style = {[styles.whiteContainer, { height: .17 * height}]}>
            <View style = {styles.subContainer}>
              <GradientText style={globalStyles.gradientH2}>More</GradientText>
              <View style = {styles.settingsContainer}>
                <Ionicons name="checkmark" size={30} color='#8d8d8d' />
                <Text style = {globalStyles.grayP}>About</Text>
              </View>
              <View style = {styles.settingsContainer}></View>
            </View>
        </View>
      </View>
    </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({

  scrollContent: {
    paddingTop: 60,
    paddingBottom: 120,
  },

  scrollContentOverride: {
    paddingHorizontal: 0,
  },

  topSection: {
    flex: 0.9,
    justifyContent: 'flex-end',
    alignItems: 'center',

  },

  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  subContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',    
    width: 350,
    gap: 15,
    paddingLeft: 20,
  },

  bottomSection: {
    flex: 0.75,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  whiteContainer:{
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 35,
    width: 350,
    gap: 125,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

});
