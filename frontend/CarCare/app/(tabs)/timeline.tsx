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
            <Text style = {[globalStyles.grayP, {padding: 1, fontWeight: 500}]}>My 2017 Honda Civic</Text>
          </View>
          {/*Service containers*/}
          <View style = {globalStyles.horizontalContainer}>
              <View style = {styles.serviceContainer}>
                <View style = {styles.subContainer}>
                  <View style = {[globalStyles.horizontalContainer]}>
                    <Ionicons name ="water" size ={35} color = "#FF6565" style = {{paddingRight: 5}}/>
                    <View style = {globalStyles.verticalContainer}>
                      <GradientText style= {globalStyles.gradientH1}>Oil change</GradientText>
                      <Text style = {globalStyles.grayP2}>Due March 30, 2026</Text>
                    </View>
                  </View>
                <Ionicons name ="chevron-down" size ={30} color = "#386FA4"/>
              </View>
            </View>
          </View>
          <View style = {globalStyles.horizontalContainer}>
              <View style = {styles.serviceContainer}>
                <View style = {styles.subContainer}>
                  <View style = {[globalStyles.horizontalContainer]}>
                    <Ionicons name ="flash" size ={35} color = "#FFA865" style = {{paddingRight: 5}}/>
                    <View style = {globalStyles.verticalContainer}>
                      <GradientText style= {globalStyles.gradientH1}>Spark plug replacement</GradientText>
                      <Text style = {globalStyles.grayP2}>Due April 16, 2026</Text>
                    </View>
                  </View>
                <Ionicons name ="chevron-down" size ={30} color = "#386FA4"/>
              </View>
            </View>
          </View>
          <View style = {globalStyles.horizontalContainer}>
              <View style = {styles.serviceContainer}>
                <View style = {styles.subContainer}>
                  <View style = {[globalStyles.horizontalContainer]}>
                    <Ionicons name ="folder" size ={35} color = "#9DE38F" style = {{paddingRight: 5}}/>
                    <View style = {globalStyles.verticalContainer}>
                      <GradientText style= {globalStyles.gradientH1}>Yearly Emissions Inspection</GradientText>
                      <Text style = {globalStyles.grayP2}>Due April 29, 2027</Text>
                    </View>
                  </View>
                <Ionicons name ="chevron-down" size ={30} color = "#386FA4"/>
              </View>
            </View>
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

  subContainer: {
    width: 300,
    justifyContent: 'space-evenly', 
    flexDirection: 'row',
    alignItems: 'center',
    
  },

  scrollContentOverride: {
    paddingHorizontal: 0,
  },

  serviceContainer: {
    borderRadius: 24,
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '98%',
    height: 100,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
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
