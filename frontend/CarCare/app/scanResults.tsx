import { Image } from 'expo-image';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles, GradientText } from '../styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import Divider from '@/styles/divider';
//import AnimatedGradientBackground from '../components/animatedBackground';

export default function ScanResults() {

  const router = useRouter();

  return (
    <ScrollView
        contentContainerStyle={[styles.scrollContent, styles.scrollContentOverride]}
        showsVerticalScrollIndicator={false}>
        <View style={globalStyles.container}>
            <View style = {[globalStyles.horizontalContainer]}>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <GradientText style = {[globalStyles.whiteBackButton, {paddingLeft: 15, paddingHorizontal:0 }]}>{`< Back`}</GradientText>
                </TouchableOpacity>
            </View>
            <View style = {[globalStyles.horizontalContainer, {}]}>
                <GradientText style = {[globalStyles.gradientHeader, {paddingHorizontal: 15, padding: 0}]}>Scan Results</GradientText>
            </View>
            <Image source = {require('../assets/images/checkEngine.jpg')}
                style={{width: '95%', height: 200, borderRadius: 25}}>
            </Image>
            <View style = {[globalStyles.horizontalContainer, {paddingHorizontal: 15}]}>
                <GradientText style = {globalStyles.gradientH2}>Check Engine Light</GradientText>
            </View>
            <View style = {[globalStyles.horizontalContainer, {paddingHorizontal: 15}]}>
                <Text style = {globalStyles.grayP}>
                    On a 2017 Honda Civic Type R, the check engine light usually falls into a few common categories: {"\n"}
                    Most Common Causes{"\n"}
                    {"\u25E6 "}
                    Loose or failing gas cap – Very common and easy fix.
                    {"\n"} {"\u25E6 "}
                    O2 (oxygen) sensor failure – Affects fuel mixture and emissions.
                    {"\n"} {"\u25E6 "}
                    MAF sensor issue – Especially if you have an aftermarket intake.
                    {"\n"} {"\u25E6 "}
                    Spark plug or ignition coil misfire – May cause rough idle or hesitation.
                    {"\n"} {"\u25E6 "}
                    EVAP system leak – Often triggers a small-leak code.
                    {"\n"} {"\u25E6 "}
                    Catalytic converter efficiency code (P0420) – Less common but possible.
                </Text>
            </View>
            <View style = {{width: '90%'}}>
                <Divider/>
            </View>
            <View style = {[globalStyles.horizontalContainer, {paddingHorizontal: 15}]}>
                <GradientText style = {globalStyles.gradientH2}>DIY Suggestions</GradientText>
            </View>
            <View style = {[globalStyles.horizontalContainer, {paddingHorizontal: 15}]}>
                <Text style = {globalStyles.grayP}>
                    Video
                </Text>
            </View>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

    scrollContent: {
        paddingTop: 60,
        paddingBottom: 120,
    },

  scrollContentOverride: {
        paddingHorizontal: 0,
  },
});
