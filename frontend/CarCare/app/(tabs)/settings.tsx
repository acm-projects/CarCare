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
    <View style={[globalStyles.container, ]}>
      {}
        <View style={styles.topSection}>
          <Text style = {[globalStyles.whiteTitle, {paddingBottom: 15}]}>Settings</Text>
          <View style = {[styles.whiteContainer, { height: .3 * height}]}>
            <View style = {styles.subContainer}>
              <GradientText style={globalStyles.gradientH2}>Account</GradientText>
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
        {}
        <View style={styles.bottomSection}>
          <View style = {[styles.whiteContainer, { height: .17 * height}]}>
            <View style = {styles.subContainer}>
              <GradientText style={globalStyles.gradientH2}>More</GradientText>
              <View style = {styles.settingsContainer}>
                <Ionicons name="checkmark" size={30} color='#8d8d8d' />
                <Text style = {globalStyles.grayP}>About</Text>
              </View>
              <View style = {styles.settingsContainer}></View>
            </View>
          </View>
        </View>
      </View>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({

  topSection: {
    flex: 0.9,
    justifyContent: 'flex-end',
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
    width: 350,
    gap: 15,
    paddingLeft: 20,
  },

  bottomSection: {
    flex: 0.75,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  whiteContainer:{
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 35,
    width: 350,
    gap: 125,
    alignItems: 'center',
  },

});
