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

  horizontalContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    paddingHorizontal: 30,
  },

  whiteHeader:
  {
    fontFamily: 'Onest',
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    width: 400,
    paddingHorizontal: 30,
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
    color: '#8d8d8d',
  },


  // Button styles
  
  whiteButton:{
    justifyContent: 'center',
    borderRadius:50,
    width: 300,
    height: 60,
    backgroundColor:'#fff',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },

  gradientButton: {
    justifyContent: 'center',
    borderRadius:50,
    width: 300,
    height: 60,
    backgroundColor:'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    
  },
  
});