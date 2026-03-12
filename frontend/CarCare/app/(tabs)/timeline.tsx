import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '@/styles/global';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Timeline() {

  const router = useRouter();
  const { height } = useWindowDimensions();

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, styles.scrollContentOverride]}
      showsVerticalScrollIndicator={false}
    >
    <View style={[globalStyles.container]}>
      <Text>Timeline</Text>
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


});
