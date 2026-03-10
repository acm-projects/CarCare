import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type Props = {
  style?: ViewStyle;
  timeSpeed?: number;
  color1?: string;
  color2?: string;
  color3?: string;
};

const AnimatedGradientBackground: React.FC<Props> = ({
  style,
  timeSpeed = 2.5,
  color1 = '#84D2F6',
  color2 = '#386FA4',
  color3 = '#264E6B',
}) => {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = 20000 / Math.max(timeSpeed, 0.05);
    Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, [t, timeSpeed]);

  const startX = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.0, 1.0, 0.0],
  });
  const startY = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.0, 0.3, 0.0],
  });
  const endX = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.0, 0.0, 1.0],
  });
  const endY = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.0, 0.7, 1.0],
  });

  const scale = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.05, 1.2, 1.05],
  });

  return (
    <AnimatedLinearGradient
      colors={[color3, color2, color1]}
      start={{ x: startX as any, y: startY as any }}
      end={{ x: endX as any, y: endY as any }}
      style={[
        StyleSheet.absoluteFill,
        style,
        {
          transform: [{ scale }],
        },
      ]}
    />
  );
};

export default AnimatedGradientBackground;