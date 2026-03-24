import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = ({ color = '#8d8d8d', height = 1, margin = 15 }) => {
  return (
    <View
      style={[
        styles.lineStyle,
        {
          borderBottomColor: color,
          borderBottomWidth: height,
          marginVertical: margin,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  lineStyle: {
    width: '100%',
    padding: 10
  },
});

export default Divider;
