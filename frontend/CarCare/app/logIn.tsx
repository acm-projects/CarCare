import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, TextInput, Alert, Button, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useRouter } from 'expo-router';
import { globalStyles, GradientText } from '../styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export default function HomeScreen() {
  const { height } = useWindowDimensions();
  const router = useRouter();
  const navigate = () => {
    router.push("/vinEnter")
  };
  
  const handlePress = () => {
    Alert.alert('CarCare Log In', 'You have logged in successfully!');
  };

  return (
      <LinearGradient
    colors={['#386FA4', '#84D2F6']}
    start={{ x: 1, y: 0.5 }}
    end={{ x: 0, y: 0.5 }}
    style={{ flex: 1 }}
  >
    <View style={globalStyles.container}>
      <View style =  {{position: 'absolute', top: 0, alignItems: 'center'}}>
        <Image source = {require('../assets/images/carCareLogoWhite.png')}
              style={{width: 100, height: 100}}></Image>
        <Text style = {globalStyles.whiteTitle}>Welcome!</Text>
        <Text style = {globalStyles.whiteTitle}>Log in</Text>
      </View>
      <View style = {[styles.logInContainer, { height: .5 * height}]}>
        <GradientText style={{ fontSize: 25 }}>Email</GradientText>
        <TextInput
          style={styles.logInBox}
          placeholder="Enter email"
          placeholderTextColor={'#8d8d8d'}/>
        <GradientText style={{ fontSize: 25 }}>Password</GradientText>
        <TextInput
          style={styles.logInBox}
          placeholder="Enter password"
          placeholderTextColor={'#8d8d8d'}
          />
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#386FA4', '#84D2F6']} style={styles.linearGradient}>
            <Text style={globalStyles.whiteButtonText}>
              Log in
            </Text>
          </LinearGradient>
      </View>
    </View>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({
  
  logInContainer:{
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    height: 50,
    borderRadius: 50,
    width: 415,
    padding: 35,
    gap: 10,
    alignItems: 'center',

  },

  logInBox: {
    borderColor: 'transparent',
    borderWidth: 0.75,
    borderBottomColor: '#8d8d8d',
    width: 300,
    paddingBottom: 5
  },
  
  linearGradient: {
    flex: 1,
    width: 300,
    height:60,
    borderRadius: 50
  },

  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  
});
