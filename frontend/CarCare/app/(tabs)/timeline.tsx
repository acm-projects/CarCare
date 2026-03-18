import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '@/styles/global';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Timeline() {

  // FUnctions
  const router = useRouter();
  const { height } = useWindowDimensions();
  const GRADIENT_BORDER: readonly [string, string, string] = ['#84D2F6', '#5FA8D3', '#386FA4'];

  const handleScanPress = () => {
    router.push('/myGarage');
  };

  return (
    <View style={[styles.screen, styles.screenOverride]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, styles.scrollContentOverride]}
        showsVerticalScrollIndicator={false}>
        {/* Top car selector + scan, horizontal scroll*/}
        <View style={styles.topRow}>
          <View style={styles.carSelectorGroup}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carChipsRow}>
            <View style={[styles.carChip, styles.carChipActive]}>
              <Text style={styles.carChipTitle}>My Civic Type R</Text>
              <Text style={styles.carChipSubtitle}>2017 Honda Civic</Text>
            </View>
            <View style={styles.carChip}>
              <Text style={styles.carChipTitle}>My BMW 335i</Text>
              <Text style={styles.carChipSubtitle}>2013 BMW 335i</Text>
            </View>
          </ScrollView>
          </View>
          <TouchableOpacity
              style={styles.scanButton}
              activeOpacity={0.85}
              onPress={handleScanPress}>
            <Ionicons name="scan-outline" size={26} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
        {/*Header*/}
        <View style = {[globalStyles.container]}>
          <View style = {globalStyles.horizontalContainer}>
            <GradientText style = {[globalStyles.gradientHeader, {paddingHorizontal: 0, padding: 5}]}>Service Timeline</GradientText>
          </View>
          <View style = {globalStyles.horizontalContainer}>
            <Text style = {[globalStyles.grayP, {padding: 1}]}>My 2017 Honda Civic</Text>
          </View>
          {/*Service containers*/}
          <View style = {globalStyles.horizontalContainer}>
            <Ionicons name ="water" size ={40} color = "#FF6565"/>
            <LinearGradient colors={GRADIENT_BORDER} style={styles.gradientCardWrap}>
              <View style = {styles.subContainer}>
                <GradientText style= {globalStyles.gradientH1}>Oil change</GradientText>
                <Text style = {globalStyles.grayP2}>Due March 30, 2026</Text>
              </View>
            </LinearGradient>
          </View>
          <View style = {globalStyles.horizontalContainer}>
            <Ionicons name ="flash" size ={40} color = "#FFA865"/>
            <LinearGradient colors={GRADIENT_BORDER} style={styles.gradientCardWrap}>
              <View style = {styles.subContainer}>
                <GradientText style= {globalStyles.gradientH1}>Spark plug replacement</GradientText>
                <Text style = {globalStyles.grayP2}>Due April 16, 2026</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
    </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },

  screenOverride: {
    paddingHorizontal: 10,
  },

  scrollContent: {
    paddingTop: 60,
    paddingBottom: 120,
  },

  scrollContentOverride: {
    paddingHorizontal: 0,
  },

  gradientCardWrap: {
    padding: 2,
    borderRadius: 25,
    marginBottom: 14,
    overflow: 'hidden',
  },

  subContainer: {
    borderRadius: 24,
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    width: 325,
    height: 100,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  carSelectorGroup: {
    flex: 1,
    marginRight: 10,
  },

  carChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  carChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    backgroundColor: '#FFFFFF',
  },

  carChipActive: {
    borderColor: '#84D2F6',
    backgroundColor: '#E8F6FF',
  },

  carChipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5FA8D3',
  },

  carChipSubtitle: {
    fontSize: 11,
    color: '#8D8D8D',
  },

  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#84D2F6',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },

});
