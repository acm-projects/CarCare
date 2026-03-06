import { Image } from 'expo-image';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {

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
      <View style={globalStyles.container}>
          <Image source = {require('../../assets/images/carCareLogoWhite.png')}
            style={{width: 250, height: 250, top: 150, position: 'absolute'}}></Image>
            <Text style = {[globalStyles.whiteHeader, {top: 425, position: 'absolute'}]}>The brain behind your vehicle's health.</Text>
            <TouchableOpacity style={[globalStyles.whiteButton, {bottom: 50, position: 'absolute'}]} onPress={() => router.push('/logIn')}>
              <GradientText style={globalStyles.gradientButtonText}>Get Started</GradientText>
            </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

});
