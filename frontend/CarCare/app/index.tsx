import { useRouter } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

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
