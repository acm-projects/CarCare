import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { globalStyles, GradientText } from "@/styles/global";
import { useGarage } from "@/context/GarageContext";
import { resolveVehicleImageSource } from "@/lib/garage/resolveVehicleImage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

export default function GarageManagement() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { vehicles, loading, error } = useGarage();

  return (
    <View style={{ flex: 1, width: "100%", paddingHorizontal: 20 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          style={{ alignSelf: "flex-start", marginTop: 25, right: 10 }}
          onPress={() => router.back()}
        >
          <GradientText style={globalStyles.gradientBackButton}>
            {"< Back"}
          </GradientText>
        </TouchableOpacity>

        {/* Title */}
        <GradientText
          style={[globalStyles.gradientH2, { paddingVertical: 18 }]}
        >
          Garage Management
        </GradientText>

        {/* Vehicle cards */}
        {!loading &&
          vehicles.map((car) => <ManageCarCard key={car.id} car={car} />)}
        {/* Add New Service button */}
        <View style={[globalStyles.horizontalContainer, { marginTop: 6 }]}>
          <TouchableOpacity
            onPress={() => router.push('/vinEnter')}
            style={styles.addServiceButton}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle-outline" size={22} color="#5FA8D3" />
            <Text style={styles.addServiceButtonText}>Add New Vehicle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// =============================================================================
// Condensed car card with Delete + Edit actions
// =============================================================================

function ManageCarCard({ car }: { car: any }) {
  const imageSource = resolveVehicleImageSource(car);

  const handleDelete = () => {
    // Delete car logic
  };

  const handleEdit = () => {
    //Edit car logic
  };

  return (
    <View style={styles.cardShadow}>
      <View style={styles.card}>
        {/* Left: name, subtitle, actions */}
        <View style={styles.cardLeft}>
          <GradientText style={globalStyles.gradientH2}>
            {car.displayName}
          </GradientText>
          <Text style={globalStyles.grayP2}>{car.subtitle}</Text>

          <View style={styles.actionsRow}>
            {/* Delete */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Ionicons name="alert-circle" color="#FF6565" size={18} />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>

            {/* Edit */}
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <LinearGradient
                colors={["#84D2F6", "#3272ae"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.editGradient}
              >
                <Ionicons name="pencil" color="#FFFFFF" size={14} />
                <Text style={styles.editText}>Edit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right: car image */}
        <Image
          source={imageSource}
          style={styles.carImage}
          contentFit="contain"
        />
      </View>
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
    paddingHorizontal: 2,
    paddingBottom: 120,
  },

  cardShadow: {
    width: "100%",
    ...cardElevation,
    marginBottom: 18,
  },

  card: {
    width: "100%",
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  cardLeft: {
    flex: 1,
    justifyContent: "flex-start",
    paddingRight: 8,
    gap: 6,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "#FF6565",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  deleteText: {
    color: "#FF6565",
    fontWeight: "500",
    fontSize: 14,
  },

  editButton: {
    borderRadius: 999,
    overflow: "hidden",
  },

  editGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },

  editText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },

  carImage: {
    width: 180,
    height: 180,
    position: "absolute",
    right: -30,
  },
    addServiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#84D2F6",
    backgroundColor: "#F0F9FF",
    width: "98%",
    paddingVertical: 16,
  },
  addServiceButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5FA8D3",
  },

});
