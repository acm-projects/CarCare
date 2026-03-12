declare module 'expo-blur' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  export interface BlurViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    style?: ViewStyle;
  }

  export class BlurView extends Component<BlurViewProps> {}
}
