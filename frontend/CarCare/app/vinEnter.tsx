import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';
import { globalStyles, GradientText } from '../styles/global';

export default function VinEnter(){

    const router = useRouter();
    const handlePress = () => {
        router.push("/myGarage");
    };

    return (
        <View style = {globalStyles.containerWhite}>
            <GradientText>Vin Enter</GradientText>
            <Button title="Enter" onPress={handlePress} />
        </View>
    )
}