import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
} from "react-native";
import { useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { globalStyles, GradientText } from "../styles/global";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { apiFetch } from "../api"; // from app/login.tsx or app/vinEnter.tsx

export default function vinEnter() {
  const { height } = useWindowDimensions();
  const router = useRouter();
  const [vin, setVin] = useState("");

  const handleVinSubmit = async () => {
    const cleanedVin = vin.trim().toUpperCase();

    if (!cleanedVin) {
      Alert.alert("Missing VIN", "Please enter a VIN number.");
      return;
    }

    if (cleanedVin.length !== 17) {
      Alert.alert("Invalid VIN", "VIN must be 17 characters.");
      return;
    }

    try {
      const savedCar = await apiFetch(`/api/cars/${cleanedVin}`, {
        method: "POST",
      });

      console.log("Saved car:", savedCar);
      Alert.alert("Car added");

      router.push({
        pathname: "../carNameEnter",
        params: { vin: cleanedVin },
      });
    } catch (err: any) {
      Alert.alert("error adding car", err?.message ?? "unkown");
    }
  };

  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      //Duration in ms
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <LinearGradient
      colors={["#3272ae", "#53c1f3"]}
      start={{ x: 1, y: 0.5 }}
      end={{ x: 0, y: 0.5 }}
      style={{ flex: 1 }}
    >
      <View style={globalStyles.container}>
        <TouchableOpacity
          style={{ alignSelf: "flex-start", bottom: 350, right: 10 }}
          onPress={() => {
            router.back();
          }}
        >
          <Text style={globalStyles.whiteH1}>{`< Back`}</Text>
        </TouchableOpacity>
        <View style={{ position: "absolute", top: 100, alignItems: "center" }}>
          <Text style={globalStyles.whiteTitle}>Create your car profile</Text>
        </View>
        <Animated.View
          style={{
            // Position the view at the bottom of its container
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            // Apply the animated translateY value
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={{ alignItems: "center", marginBottom: -125 }}>
            <Image
              source={require("../assets/images/CarCareLogoGearWhite.png")}
              style={{ width: 250, height: 250 }}
            />
          </View>
          <View
            style={[
              styles.logInContainer,
              { height: 0.55 * height, width: "100%" },
            ]}
          >
            <View style={styles.topSection}>
              <View style={styles.subContainer}>
                <GradientText style={globalStyles.gradientH2}>
                  VIN Number
                </GradientText>
                <TextInput
                  style={styles.logInBox}
                  placeholder="Enter VIN number"
                  placeholderTextColor={"#8d8d8d"}
                  value={vin}
                  onChangeText={setVin}
                />
                <Text style={globalStyles.grayP}>
                  CarCare needs your car’s VIN number to access accurate
                  technical specifications, maintenance records, and
                  manufacturing data.
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={globalStyles.whiteButton}
                onPress={handleVinSubmit}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#53c1f3", "#3272ae"]}
                  style={globalStyles.gradientButton}
                >
                  <Text style={globalStyles.whiteButtonText}>Next</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  subContainer: {
    width: 300,
    gap: 20,
  },

  logInContainer: {
    flex: 1,
    backgroundColor: "#fff",
    bottom: 0,
    height: 50,
    borderRadius: 50,
    width: 415,
    padding: 35,
    gap: 125,
    alignItems: "center",
  },

  logInBox: {
    borderColor: "transparent",
    borderWidth: 0.75,
    borderBottomColor: "#8d8d8d",
    width: 300,
    paddingBottom: 5,
  },
});
