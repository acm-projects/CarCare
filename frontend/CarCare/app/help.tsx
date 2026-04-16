import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { globalStyles, GradientText } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function help() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  return (
    <View style={[globalStyles.container]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          styles.scrollContentOverride,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/*Header and back button*/}

        <TouchableOpacity
          style={{ alignSelf: "flex-start", marginTop: 25, right: 10 }}
          onPress={() => {
            router.back();
          }}
        >
          <GradientText style={globalStyles.gradientBackButton}>
            {"< Back"}
          </GradientText>
        </TouchableOpacity>
        <View
          style={[styles.whiteContainer, { height: 0.5 * height, padding: 25, marginTop:25 }]}
        >
          <View style={[styles.subContainer]}>
            <GradientText
              style={[globalStyles.gradientH2, { paddingVertical: 15 }]}
            >
              Help
            </GradientText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 120,
  },

  scrollContentOverride: {
    paddingHorizontal: 10,
  },

  settingsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  emailBox: {
    borderColor: "transparent",
    borderWidth: 0.75,
    borderBottomColor: "#8d8d8d",
    width: 300,
    paddingBottom: 5,
  },

  subContainer: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "column",
    width: 350,
    gap: 15,
    paddingLeft: 20,
  },

  whiteContainer: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 35,
    width: 350,
    gap: 125,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
});
