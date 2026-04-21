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
    <View style = {globalStyles.container}>
    <ScrollView
      contentContainerStyle={[styles.scrollContent, styles.scrollContentOverride]}
      showsVerticalScrollIndicator={false}>
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
                  <View style = {[styles.settingsContainer, {alignContent: 'space-evenly'}]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons name="person-outline" size={30} color="#8d8d8d" />
                      <Text style={globalStyles.grayP}>Profile</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={25} color='#8d8d8d' />
                  </View>
              </TouchableOpacity>

              {/* Nav to the password settings */}
              <TouchableOpacity onPress={ () => router.push('/privacy')}>
                  <View style = {[styles.settingsContainer, {alignContent: 'space-evenly'}]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons name="lock-closed-outline" size={30} color="#8d8d8d" />
                      <Text style={globalStyles.grayP}>Privacy</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={25} color='#8d8d8d' />
                  </View>
              </TouchableOpacity>

              {/* Nav to the notification settings */}
              <TouchableOpacity onPress={ () => router.push('/garageManagement')}>
                <View style = {[styles.settingsContainer, {alignContent: 'space-evenly'}]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="car-outline" size={30} color="#8d8d8d" />
                    <Text style={globalStyles.grayP}>Garage Management</Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={25} color='#8d8d8d' />
                </View>
              </TouchableOpacity>

            </View>
            <View style = {[styles.subContainer, {paddingTop: 25}]}>

              <GradientText style={[globalStyles.gradientH2, {paddingTop: 15}]}>More</GradientText>

              {/*Nav to help page */}
              <TouchableOpacity onPress={ () => router.push('/help')}>
                <View style = {[styles.settingsContainer, {alignContent: 'space-evenly'}]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="help-circle-outline" size={30} color="#8d8d8d" />
                    <Text style={globalStyles.grayP}>Help</Text>
                  </View>
                <Ionicons name="chevron-forward-outline" size={25} color='#8d8d8d' />
                </View>
              </TouchableOpacity>
            </View>
          {/* Button to log out */}
          <TouchableOpacity onPress={ () => router.push('/')}>
            <View style={[styles.settingsContainer, {justifyContent: 'center', width: 'auto', alignSelf: 'center' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="log-out" size={30} color="#8d8d8d" />
                <Text style={globalStyles.grayP}>Log Out</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({

  scrollContent: {
    paddingTop: 60,
    paddingBottom: 120,
  },

  scrollContentOverride: {
    paddingHorizontal: 10,
  },

  topSection: {
    flex: 0.9,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  settingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
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
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },

});
