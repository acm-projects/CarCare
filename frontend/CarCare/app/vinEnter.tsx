import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { globalStyles, GradientText } from '../styles/global';
import { LinearGradient } from 'expo-linear-gradient';

export default function vinEnter(){

    const router = useRouter();
    const handlePress = () => {
        router.push("/logIn")
    };


    return (
        <View style = {globalStyles.containerWhite}>
            <GradientText>Vin Enter</GradientText>
        </View>
    )
}