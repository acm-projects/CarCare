import { Image } from 'expo-image';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';

export default function index() {

  const router = useRouter();

  return (
    <View style = {globalStyles.container}>
        <Text style = {globalStyles.grayP}>My garage</Text>
    </View>
  );
}

const styles = StyleSheet.create({

});
