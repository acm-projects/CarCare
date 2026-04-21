import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export function GradientText({ children, style }) {
  return (
    <MaskedView
      maskElement={
        <View>
          <Text style={[globalStyles.gradientTitle, style]}>
            {children}
          </Text>
        </View>
      }
    >
      <LinearGradient
        colors={['#53c1f3', '#3272ae']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text
          style={[
            globalStyles.gradientTitle, style,
            { opacity: 0 }
          ]}
        >
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

export const globalStyles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    gap: 15,
  },

  container2: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    gap: 15,
  },

  horizontalContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  verticalContainer: {
    flexDirection: 'column',
  },

  containerWhite: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    gap: 15,
  },

  containerGradient: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    gap: 15,
  },

  // Text styles

  whiteTitle: {
    fontFamily: 'Onest',
    fontSize: 40,
    color: '#fff',
    fontWeight: 500,
    textAlign: 'center'
  },

  gradientTitle: {
    fontFamily: 'Onest',
    fontSize: 40,
    fontWeight: 400,
  },
    
  gradientHeader: {
    fontFamily: 'Onest',
    fontSize: 30,
    textAlign: 'center',
    padding: 10,
    fontWeight: 500,
    paddingHorizontal: 30,
  },

  whiteHeader:
  {
    fontFamily: 'Onest',
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    width: 400,
    fontWeight: 500,
    paddingHorizontal: 30,
  },

  gradientH2: {
    fontFamily: 'Onest',
    fontSize: 25,
    fontWeight: 500,
  },
  gradientH1: {
    fontFamily: 'Onest',
    fontWeight: 500,
    fontSize: 19,
  },

  gradientH3: {
    fontFamily: 'Onest',
    fontSize: 20,
    fontWeight: 500,
  },
  whiteH2:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    color: '#fff',
    paddingHorizontal: 30,
  },

  whiteH1:
  {
    fontFamily: 'Onest',
    fontSize: 19,
    color: '#fff',
    paddingHorizontal: 30,
  },

  whiteBackButton:
  {
    fontFamily: 'Onest',
    fontSize: 21,
    color: '#fff',
    paddingHorizontal: 30,
  },
  gradientBackButton:
  {
    fontFamily: 'Onest',
    fontSize: 21,
    paddingHorizontal: 30,
  },

  grayH2:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    color: '#8d8d8d',
    paddingHorizontal: 30,

  },
  
  whiteButtonText:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    color: '#fff',
    fontWeight: 500,
    textAlign: 'center',
  },

  gradientButtonText:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    fontWeight: 500,
    textAlign: 'center',
  },

  grayP: {
    fontFamily: 'Onest',
    fontSize: 17,
    color: '#8d8d8d',
  },

  grayP2: {
    fontFamily: 'Onest',
    fontSize: 15,
    fontWeight: 500,
    color: '#8d8d8d',
  },

  redP: {
    fontFamily: 'Onest',
    fontSize: 15,
    fontWeight: 500,
    color: '#FF6565',
  },

  gradientP: {
    fontFamily: 'Onest',
    fontSize: 17,
  },

  gradientP2: {
    fontFamily: 'Onest',
    fontSize: 15,
    fontWeight: 500,
  },


  // Button styles
  
  whiteButton:{
    justifyContent: 'center',
    borderRadius:50,
    width: 300,
    height: 60,
    backgroundColor:'#fff',
    shadowColor: 'gray',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },

  gradientButton: {
    justifyContent: 'center',
    borderRadius:50,
    width: 300,
    height: 60,
    backgroundColor:'transparent',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    
  },
  
  gradientViewButton: {
    justifyContent: 'center',
    borderRadius:50,
    width: 85,
    height: 35,
    backgroundColor:'transparent',
  },
});