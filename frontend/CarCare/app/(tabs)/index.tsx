import { Image } from 'expo-image';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { globalStyles, GradientText } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

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
            style={{width: 250, height: 250}}></Image>
            <Text style = {globalStyles.whiteHeader}>The brain behind your vehicle's health.</Text>
            <TouchableOpacity style={[globalStyles.whiteButton, {alignItems: 'center'}]} onPress={() => router.push('/logIn')}>
              <GradientText style={{ fontSize: 25 }}>Get Started</GradientText>
            </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

});
