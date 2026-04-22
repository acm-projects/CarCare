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

export default function ProfileSettings() {
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
          style={[
            styles.whiteContainer,
            { height: 0.55 * height, padding: 25, marginTop: 25 },
          ]}
        >
          <View style={[styles.subContainer]}>
            <GradientText
              style={[globalStyles.gradientH2, { paddingVertical: 15 }]}
            >
              My Profile
            </GradientText>

            {/*Change user email*/}

            <GradientText style={globalStyles.gradientH3}>Email</GradientText>
            <TextInput
              style={styles.emailBox}
              placeholder="CarCareEmail123@gmail.com"
              placeholderTextColor={"#8d8d8d"}
            />
            <TouchableOpacity>
              <Text style={[globalStyles.grayP2, { paddingBottom: 15 }]}>
                Change Email
              </Text>
            </TouchableOpacity>

            {/*Change user password*/}

            <GradientText style={globalStyles.gradientH3}>
              Password
            </GradientText>
            <TextInput
              style={styles.emailBox}
              placeholder="MyPassword1234567"
              placeholderTextColor={"#8d8d8d"}
            />
            <TouchableOpacity>
              <Text style={globalStyles.grayP2}>Change Password</Text>
            </TouchableOpacity>
            <View
              style={{
                alignSelf: "center",
                alignItems: "center",
                alignContent: "center",
                flexDirection: "row",
                gap: 10,
                paddingTop: 40,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                  alignSelf: "center",
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={30}
                  color="#FF6565"
                />
                <Text style={globalStyles.redP}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const cardElevation = {
    shadowColor: '#363535',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
    elevation: 5,
};

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
    ...cardElevation,
  },
});
