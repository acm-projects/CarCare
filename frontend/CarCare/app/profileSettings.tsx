import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '@/styles/global';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileSettings() {

  const router = useRouter();
  const { height } = useWindowDimensions();

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, styles.scrollContentOverride]}
      showsVerticalScrollIndicator={false}
    >
    <View style={[globalStyles.container]}>
      <Text>Hello</Text>
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
