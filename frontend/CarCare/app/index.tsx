import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, TextInput, Alert, Button, View, type TextStyle } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {

  const router = useRouter();
  const handlePress = () => {
    router.push("/logIn")
  };

  return (
    <View style={styles.container}>
        <Button onPress={() => router.push('/logIn')} title = "Navigate"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#386FA4',
  },
});
