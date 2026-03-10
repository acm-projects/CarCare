import { Image } from 'expo-image';
import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function dashboard() {

  const router = useRouter();
  const { height } = useWindowDimensions();

  return (
    <LinearGradient
      colors={['#386FA4', '#84D2F6']}
      start={{ x: 1, y: 0.5 }}
      end={{ x: 0, y: 0.5 }}
      style={{ flex: 1 }}
    >
    <View style={globalStyles.container}>
      {}
        <View style={styles.topSection}>
          <View style = {[styles.whiteContainer, { height: .3 * height}]}>
            <View style = {styles.subContainer}>
              <GradientText style={globalStyles.gradientH2}>Settings</GradientText>
              <View style = {styles.settingsContainer}>
                <Ionicons name="person-outline" size={30} color='#8d8d8d' />
                <Text style = {globalStyles.grayP}>Profile</Text>
              </View>
              <View style = {styles.settingsContainer}>
                <Ionicons name="lock-closed-outline" size={30} color='#8d8d8d' />
                <Text style = {globalStyles.grayP}>Password</Text>
              </View>
              <View style = {styles.settingsContainer}>
                <Ionicons name="notifications-outline" size={30} color='#8d8d8d' />
                <Text style = {globalStyles.grayP}>Notifications</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({

  topSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',    
    width: 300,
    gap: 15,
    paddingLeft: 20,
  },

  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 15,
    paddingBottom: 60,
  },

  whiteContainer:{
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    height: 50,
    borderRadius: 50,
    padding: 35,
    width: 300,
    gap: 125,
    alignItems: 'center',
  },

});
