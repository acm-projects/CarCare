import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '@/styles/global';
import Ionicons from '@expo/vector-icons/Ionicons';
import Divider from '@/styles/divider';

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

          {/*header*/}
          <GradientText style = {[globalStyles.gradientHeader, {paddingBottom: 25}]}>Settings</GradientText>
          <View style = {[styles.whiteContainer, { height: .5 * height, padding:25}]}>
            <View style = {[styles.subContainer]}>
              <GradientText style={globalStyles.gradientH2}>Account</GradientText>

              {/* Nav to the profile settings */}
              <TouchableOpacity onPress={ () => router.push('/profileSettings')}>
                  <View style = {styles.settingsContainer}>
                    <Ionicons name="person-outline" size={30} color='#8d8d8d' />
                    <Text style = {globalStyles.grayP}>Profile</Text>
                  </View>
              </TouchableOpacity>

              {/* Nav to the password settings */}
              <TouchableOpacity onPress={ () => router.push('/profileSettings')}>
                  <View style = {styles.settingsContainer}>
                    <Ionicons name="lock-closed-outline" size={30} color='#8d8d8d' />
                    <Text style = {globalStyles.grayP}>Password</Text>
                  </View>
              </TouchableOpacity>

              {/* Nav to the notification settings */}
              <TouchableOpacity onPress={ () => router.push('/profileSettings')}>
                  <View style = {styles.settingsContainer}>
                  <Ionicons name="notifications-outline" size={30} color='#8d8d8d' />
                  <Text style = {globalStyles.grayP}>Notifications</Text>
                </View>
              </TouchableOpacity>

            </View>

            <Divider/>

            <View style = {[styles.subContainer]}>

              <GradientText style={globalStyles.gradientH2}>More</GradientText>

              {/*Nav to help page */}
              <TouchableOpacity onPress={ () => router.push('/profileSettings')}>
                  <View style = {styles.settingsContainer}>
                  <Ionicons name="help-circle-outline" size={30} color='#8d8d8d' />
                  <Text style = {globalStyles.grayP}>Help</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* Button to log out */}
              <TouchableOpacity onPress={ () => router.push('/profileSettings')}>
                  <View style = {styles.settingsContainer}>
                  <Ionicons name="log-out" size={30} color='#8d8d8d' />
                  <Text style = {globalStyles.grayP}>Log Out</Text>
                </View>
              </TouchableOpacity>
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

  divider:
  {
    alignItems: 'center',
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
    gap: 10
  },

  subContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',    
    width: 350,
    gap: 20,
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
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

});
