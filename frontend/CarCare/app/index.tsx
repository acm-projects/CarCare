import { Image } from 'expo-image';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '../styles/global';
import { LinearGradient } from 'expo-linear-gradient';
//import AnimatedGradientBackground from '../components/animatedBackground';

export default function Index() {

  const router = useRouter();
  const handlePress = () => {
    router.push("/logIn")
  };

  return (
    <LinearGradient
      colors={['#386FA4', '#84D2F6']}
      start={{ x: 1, y: 0.5 }}
      end={{ x: 0, y: 0.5 }}
      style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Image
            source={require('../assets/images/carCareLogoWhite.png')}
            style={styles.logo}/>
          <Text style={globalStyles.whiteHeader}>
            The brain behind your vehicle's health.
          </Text>
        </View>
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={globalStyles.whiteButton}
            onPress={() => router.push('/createAccount')}>
            <GradientText style={globalStyles.gradientButtonText}>
              Get Started
            </GradientText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/logIn')}>
            <Text style={globalStyles.whiteH2}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  alignItems: 'center',
  width: '100%',
},

topSection: {
  flex:3,
  justifyContent: 'center',
  alignItems: 'center',
},

bottomSection: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 15,
  paddingBottom: 60,
},

logo: {
  width: 250,
  height: 250,
  marginBottom: 10
},
});
