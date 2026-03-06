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
        colors={['#386FA4', '#84D2F6']}
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
    width: '100%',
  },

  gradientTitle: {
    fontFamily: 'Onest',
    fontSize: 50,
    width: '100%',
  },
    
  gradientHeader: {
    width: '100%',
    fontFamily: 'Onest',
  },

  whiteHeader:
  {
    fontFamily: 'Onest',
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    width: '100%'
  },
  
  whiteButtonText:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    width: '100%',
  },

  gradientButtonText:
  {
    fontFamily: 'Onest',
    fontSize: 25,
    textAlign: 'center',
    width: '100%',
  },

  // Button styles
  
  whiteButton:{
    justifyContent: 'center',
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:50,
    width: 300,
    height: 60,
    backgroundColor:'#fff'
  },

  gradientButton: {
    justifyContent: 'center',
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:50,
    width: 300,
    height: 60,
    backgroundColor:'transparent',
  },
  
});