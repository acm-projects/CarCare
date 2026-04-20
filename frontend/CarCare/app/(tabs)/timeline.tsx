import React, { useState, ComponentProps } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { globalStyles, GradientText } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";

type IoniconsGlyphs = ComponentProps<typeof Ionicons>["name"];

type Service = {
  id: number;
  title: string;
  due: string;
  icon: IoniconsGlyphs;
  iconColor: string;
  cost: string;
};

const INITIAL_SERVICES: Service[] = [

  // Cases

  {
    id: 1,
    title: "Oil change",
    due: "Due March 30, 2026",
    icon: "water",
    iconColor: "#FF6565",
    cost: "$45 – $85",
  },
  {
    id: 2,
    title: "Spark plug replacement",
    due: "Due April 16, 2026",
    icon: "flash",
    iconColor: "#FFA865",
    cost: "$100 – $200",
  },
  {
    id: 3,
    title: "Yearly Emissions Inspection",
    due: "Due April 29, 2027",
    icon: "folder",
    iconColor: "#9DE38F",
    cost: "$20 – $50",
  },
];

// Dropdown menu

function ServiceDropdown({ cost }: { cost: string }) {
  return (
    <View style={styles.dropdownBody}>
      <View style={styles.dropdownRow}>
        <Ionicons name="cash-outline" size={18} color="#5FA8D3" />
        <Text style={styles.dropdownLabel}>Estimated Cost</Text>
        <Text style={globalStyles.grayP2}>{cost}</Text>
      </View>
      <TouchableOpacity style={styles.diyButton} activeOpacity={0.8}>
        <Ionicons name="construct-outline" size={16} color="#386FA4" />
        <Text style={styles.diyButtonText}>View DIY Guide</Text>
      </TouchableOpacity>
    </View>
  );
}

function ServiceCard({
  service,
  onDelete,
}: {
  service: Service;
  onDelete?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.serviceContainer,
        expanded && styles.serviceContainerExpanded,
      ]}
    >
      {/* Main row */}
      <TouchableOpacity
        style={styles.subContainer}
        activeOpacity={0.85}
        onPress={() => setExpanded((prev) => !prev)}
      >
        <View style={styles.cardLeft}>
          <Ionicons
            name={service.icon}
            size={35}
            color={service.iconColor}
            style={{ paddingRight: 5 }}
          />
          <View style={globalStyles.verticalContainer}>
            <GradientText style={globalStyles.gradientH1}>
              {service.title}
            </GradientText>
            <Text style={globalStyles.grayP2}>{service.due}</Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#386FA4"
        />
      </TouchableOpacity>

      {/* Dropdown */}
      {expanded && <ServiceDropdown cost={service.cost} />}
    </View>
  );
}

// Icon options for the "Add Service" modal

const ICON_OPTIONS: { name: IoniconsGlyphs; color: string }[] = [
  { name: "water", color: "#FF6565" },
  { name: "flash", color: "#FFA865" },
  { name: "folder", color: "#9DE38F" },
  { name: "construct", color: "#84D2F6" },
  { name: "car-sport", color: "#B497E8" },
  { name: "thermometer", color: "#FF8FAB" },
  { name: "settings", color: "#64B6AC" },
  { name: "speedometer", color: "#F4A261" },
];

// Modal for adding a new service (DOENT ACTUALLY WORK)

function AddServiceModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (newService: Service) => void;
}) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [cost, setCost] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<{
    name: IoniconsGlyphs;
    color: string;
  }>(ICON_OPTIONS[3]);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(),
      title: title.trim(),
      due: due.trim() || "No due date set",
      icon: selectedIcon.name as IoniconsGlyphs,
      iconColor: selectedIcon.color,
      cost: cost.trim() || "N/A",
    });
    setTitle("");
    setDue("");
    setCost("");
    setSelectedIcon(ICON_OPTIONS[3]);
    onClose();
  };

  // Add new service pop up screen

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalSheet}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Add New Service</Text>

          <Text style={styles.modalLabel}>Service Name *</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Tire rotation"
            placeholderTextColor="#AFAFAF"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.modalLabel}>Due Date</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Due June 1, 2026"
            placeholderTextColor="#AFAFAF"
            value={due}
            onChangeText={setDue}
          />

          <Text style={styles.modalLabel}>Estimated Cost</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. $50 – $120"
            placeholderTextColor="#AFAFAF"
            value={cost}
            onChangeText={setCost}
          />

          <Text style={styles.modalLabel}>Icon</Text>
          <View style={styles.iconGrid}>
            {ICON_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.name}
                style={[
                  styles.iconOption,
                  selectedIcon.name === opt.name && {
                    borderColor: opt.color,
                    backgroundColor: opt.color + "22",
                  },
                ]}
                onPress={() => setSelectedIcon(opt)}
              >
                <Ionicons name={opt.name} size={24} color={opt.color} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addConfirmButton,
                !title.trim() && { opacity: 0.4 },
              ]}
              onPress={handleAdd}
              disabled={!title.trim()}
            >
              <Text style={styles.addConfirmButtonText}>Add Service</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function Timeline() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [modalVisible, setModalVisible] = useState(false);

  const handleScanPress = () => router.push("/myGarage");

  const handleAddService =
    (newService: Service) =>
    (newService: {
      id: number;
      title: string;
      due: string;
      icon: string;
      iconColor: string;
      cost: string;
    }) => {
      setServices((prev) => [
        ...prev,
        { ...newService, icon: newService.icon as IoniconsGlyphs },
      ]);
    };

  return (
    <View style={[styles.screen, styles.screenOverride]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          styles.scrollContentOverride,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[globalStyles.container]}>
          <GradientText style = {[globalStyles.gradientHeader, {paddingBottom: 25}]}>Service Timeline</GradientText>
          <View style={[globalStyles.horizontalContainer, { gap: 10 }]}>
            <Text
              style={[globalStyles.grayP, { padding: 1, fontWeight: "500" }]}
            >
              My 2017 Honda Civic
            </Text>
            <GradientText style={globalStyles.gradientP}>See all</GradientText>
          </View>

          {/* Service cards */}
          {services.map((service) => (
            <View key={service.id} style={globalStyles.horizontalContainer}>
              <ServiceCard service={service} />
            </View>
          ))}

          {/* Add New Service button */}
          <View style={[globalStyles.horizontalContainer, { marginTop: 6 }]}>
            <TouchableOpacity
              style={styles.addServiceButton}
              activeOpacity={0.85}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={22} color="#5FA8D3" />
              <Text style={styles.addServiceButtonText}>Add New Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add Service Modal */}
      <AddServiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddService}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  screenOverride: {
    paddingHorizontal: 10,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 120,
  },
  scrollContentOverride: {
    paddingHorizontal: 0,
  },

  // ── Service Card ──────────────────────────────────────
  serviceContainer: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    width: "98%",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    marginBottom: 2,
  },
  serviceContainerExpanded: {
    borderColor: "#84D2F6",
    borderWidth: 1,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  // ── Dropdown body ─────────────────────────────────────
  dropdownBody: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEF3F8",
    paddingTop: 12,
    gap: 10,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownLabel: {
    fontSize: 13,
    color: "#8D8D8D",
    flex: 1,
  },
  dropdownValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2E2E",
  },
  diyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#E8F4FC",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 2,
  },
  diyButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#386FA4",
  },

  // ── Add Service Button ────────────────────────────────
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

  // ── Top row ───────────────────────────────────────────
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  carSelectorGroup: {
    flex: 1,
    marginRight: 10,
  },
  carChipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  carChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    backgroundColor: "#FFFFFF",
  },
  carChipActive: {
    borderColor: "#84D2F6",
    backgroundColor: "#E8F6FF",
  },
  carChipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5FA8D3",
  },
  carChipSubtitle: {
    fontSize: 11,
    color: "#8D8D8D",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#84D2F6",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 6,
  },

  // ── Modal ─────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8D8D8D",
    marginBottom: 6,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: "#F5F8FB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#E4EEF5",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  iconOption: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E4EEF5",
    backgroundColor: "#F5F8FB",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#D6D6D6",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8D8D8D",
  },
  addConfirmButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#84D2F6",
    alignItems: "center",
  },
  addConfirmButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
