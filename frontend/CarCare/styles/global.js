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
        colors={['#84D2F6', '#386FA4']}
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
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    gap: 15,
  },

  containerWhite: {
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
    fontSize: 50,
    color: '#fff',
    fontWeight: 400,
    textAlign: 'center'
  },

  gradientTitle: {
    fontFamily: 'Onest',
    fontSize: 50,
    fontWeight: 400,
  },
    
  gradientHeader: {
    fontFamily: 'Onest',
    fontSize: 30,
    textAlign: 'center',
    padding: 10,
  },

  whiteHeader:
  {
    fontFamily: 'Onest',
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    padding: 10,
  },

  gradientH2: {
    fontFamily: 'Onest',
    fontSize: 25,
  },

  whiteH2:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    color: '#fff',
  },

  grayH2:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    color: '#8d8d8d',
  },
  
  whiteButtonText:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
  },

  gradientButtonText:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    textAlign: 'center',
  },

  grayP: {
    fontFamily: 'Onest',
    fontSize: 15,
    color: '#8d8d8d'
  },
  // Button styles
  
  whiteButton:{
    justifyContent: 'center',
    borderRadius:50,
    width: 300,
    height: 60,
    backgroundColor:'#fff'
  },

  gradientButton: {
    justifyContent: 'center',
    borderRadius:50,
    width: 300,
    height: 60,
    backgroundColor:'transparent',
  },
  
});