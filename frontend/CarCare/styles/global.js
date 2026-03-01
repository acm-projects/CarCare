import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export function GradientText({ children }) {
  return (
    <MaskedView
      style={{ alignSelf: 'flex-start' }}
      maskElement={
        <View>
          <Text style={globalStyles.gradientTitle}>
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
            globalStyles.gradientTitle,
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

    whiteTitle: {
        fontFamily: 'Onest',
        fontSize: 50,
        color: '#fff'
    },

    gradientTitle: {
        fontFamily: 'Onest',
        fontSize: 50,
    },
    
    gradientHeader: {
        fontFamily: 'Onest',
    },

});