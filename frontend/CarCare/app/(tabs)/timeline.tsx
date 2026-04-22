import React, { useState, ComponentProps } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { globalStyles, GradientText } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;
const GRADIENT_BORDER: readonly [string, string, string] = ["#84D2F6", "#5FA8D3", "#386FA4"];
const GRADIENT_FRAME = 0;
const GRAY = "#8D8D8D";
const TIP_TITLE_BLUE = "#5FA8D3";

type IoniconsGlyphs = ComponentProps<typeof Ionicons>["name"];

type GarageCar = {
  id: string;
  title: string;
  subtitle: string;
};

const GARAGE_CARS: GarageCar[] = [
  { id: "civic", title: "My Rolla", subtitle: "2014 Toyota Corolla" },
  { id: "bibic", title: "My Bibic", subtitle: "2017 Honda Civic" },

];


type Service = {
  id: number;
  title: string;
  due: string;
  icon: IoniconsGlyphs;
  iconColor: string;
  cost: string;
  finished?: boolean;
};

const INITIAL_SERVICES: Service[] = [
  {
    id: 1,
    title: "Oil change",
    due: "Due May 5, 2026",
    icon: "water",
    iconColor: "#FF6565",
    cost: "$45 – $85",
    finished: false,
  },
  {
    id: 2,
    title: "Spark plug replacement",
    due: "Due May 30, 2026",
    icon: "flash",
    iconColor: "#FFA865",
    cost: "$100 – $200",
    finished: false,
  },
  {
    id: 3,
    title: "Yearly Emissions Inspection",
    due: "Due July 19, 2026",
    icon: "folder",
    iconColor: "#9DE38F",
    cost: "$20 – $50",
    finished: false,
  },
];

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

function ServiceCard({ service }: { service: Service }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.serviceContainer, expanded && styles.serviceContainerExpanded]}>
      <TouchableOpacity
        style={styles.subContainer}
        activeOpacity={0.85}
        onPress={() => setExpanded((prev) => !prev)}
      >
        <View style={styles.cardLeft}>
          <Ionicons name={service.icon} size={35} color={service.iconColor} style={{ paddingRight: 5 }} />
          <View style={globalStyles.verticalContainer}>
            <GradientText style={globalStyles.gradientH1}>{service.title}</GradientText>
            <Text style={globalStyles.grayP2}>{service.due}</Text>
          </View>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color="#386FA4" />
      </TouchableOpacity>
      {expanded && <ServiceDropdown cost={service.cost} />}
    </View>
  );
}

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
  const [selectedIcon, setSelectedIcon] = useState<{ name: IoniconsGlyphs; color: string }>(ICON_OPTIONS[3]);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(),
      title: title.trim(),
      due: due.trim() || "No due date set",
      icon: selectedIcon.name as IoniconsGlyphs,
      iconColor: selectedIcon.color,
      cost: cost.trim() || "N/A",
      finished: false,
    });
    setTitle("");
    setDue("");
    setCost("");
    setSelectedIcon(ICON_OPTIONS[3]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
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
              style={[styles.addConfirmButton, !title.trim() && { opacity: 0.4 }]}
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

type FilterType = "all" | "upcoming" | "finished";

const FILTER_PILLS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Finished", value: "finished" },
];

export default function Timeline() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedCarId, setSelectedCarId] = useState<string>(GARAGE_CARS[0].id);
  const [carMenuOpen, setCarMenuOpen] = useState(false);

  const selectedCar = GARAGE_CARS.find((c) => c.id === selectedCarId) ?? GARAGE_CARS[0];

  const filteredServices = services.filter((s) => {
    if (activeFilter === "upcoming") return !s.finished;
    if (activeFilter === "finished") return s.finished;
    return true;
  });

  const handleAddService = (newService: Service) => {
    setServices((prev) => [...prev, newService]);
  };

  return (
    <View style={[styles.screen, styles.screenOverride]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, styles.scrollContentOverride]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[globalStyles.container, {width: CONTENT_WIDTH, alignSelf: 'center'}]}>

          {/* Top row: car dropdown + scan button */}
          <View style={styles.topRow}>
            <View style={styles.carSelectorGroup}>
              <View style={styles.carDropdownAnchor}>
                <TouchableOpacity
                  style={styles.carDropdownHit}
                  activeOpacity={0.9}
                  onPress={() => setCarMenuOpen((o) => !o)}
                  accessibilityRole="button"
                  accessibilityLabel="Select vehicle"
                >
                  <View style={styles.carDropdownFrame}>
                    <View style={styles.carDropdownInner}>
                      <View style={styles.carDropdownTriggerRow}>
                        <View style={styles.carDropdownTriggerText}>
                          <Text style={styles.carDropdownTitle} numberOfLines={1}>
                            {selectedCar.title}
                          </Text>
                          <Text style={styles.carDropdownSubtitle} numberOfLines={1}>
                            {selectedCar.subtitle}
                          </Text>
                        </View>
                        <Ionicons
                          name={carMenuOpen ? "chevron-up" : "chevron-down"}
                          size={20}
                          color={TIP_TITLE_BLUE}
                        />
                      </View>
                    </View>
                    </View>
                </TouchableOpacity>

                {carMenuOpen && (
                  <View style={styles.carDropdownMenuOuter}>
                    <View style={styles.carDropdownMenuInner} accessibilityViewIsModal>
                      {GARAGE_CARS.map((car) => {
                        const isActive = car.id === selectedCarId;
                        return (
                          <TouchableOpacity
                            key={car.id}
                            style={[styles.carDropdownRow, isActive && styles.carDropdownRowActive]}
                            activeOpacity={0.85}
                            onPress={() => {
                              setSelectedCarId(car.id);
                              setCarMenuOpen(false);
                            }}
                          >
                            <View style={styles.carDropdownRowText}>
                              <Text style={styles.carDropdownRowTitle} numberOfLines={2}>
                                {car.title}
                              </Text>
                              <Text style={styles.carDropdownRowSubtitle} numberOfLines={2}>
                                {car.subtitle}
                              </Text>
                            </View>
                            {isActive ? (
                              <Ionicons name="checkmark-circle" size={22} color={TIP_TITLE_BLUE} />
                            ) : (
                              <View style={styles.carDropdownRowSpacer} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.scanButton}
              activeOpacity={0.85}
              onPress={() => router.push("/scanCamera")}
            >
              <Ionicons name="scan-outline" size={26} color="#FFFFFF" />
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          {/* Subtitle row */}
          <View style={[globalStyles.horizontalContainer, { gap: 10 }]}>
            <Text style={[globalStyles.grayP, { padding: 1, fontWeight: "500" }]}>
              {selectedCar.subtitle}
            </Text>
            <GradientText style={globalStyles.gradientP}>See all</GradientText>
          </View>

          {/* Filter Pills */}
          <View style={styles.pillRow}>
            {FILTER_PILLS.map((pill) => {
              const isActive = activeFilter === pill.value;
              return isActive ? (
                <View key={pill.value} style = {styles.shadowWrapper}>
                  <LinearGradient
                    colors={["#84D2F6", "#4bb0e4"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.pillGradient}
                  >
                    <TouchableOpacity onPress={() => setActiveFilter(pill.value)}>
                      <Text style={styles.pillTextActive}>{pill.label}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              ) : (
                <TouchableOpacity
                  key={pill.value}
                  style={styles.pillInactive}
                  onPress={() => setActiveFilter(pill.value)}
                >
                  <Text style={styles.pillTextInactive}>{pill.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Service cards */}
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <View key={service.id} style={globalStyles.horizontalContainer}>
                <ServiceCard service={service} />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={40} color="#B0CDE0" />
              <Text style={styles.emptyStateText}>No services here yet.</Text>
            </View>
          )}

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

      <AddServiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddService}
      />
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
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    width: "100%",
    zIndex: 30,
  },
  carSelectorGroup: {
    flex: 1,
    flexShrink: 0,
    minWidth: Math.round(CONTENT_WIDTH * 0.42),
    maxWidth: Math.round(CONTENT_WIDTH * 0.78),
    marginRight: 10,
    zIndex: 30,
  },
  carDropdownAnchor: {
    position: "relative",
    width: "100%",
    ...cardElevation,
  },
  carDropdownHit: {
    width: "100%",
  },
  carDropdownFrame: {
    padding: GRADIENT_FRAME,
    borderRadius: 999,
    overflow: "hidden",
    width: "100%",
  },
  carDropdownInner: {
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: "hidden",
  },
  carDropdownTriggerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  carDropdownTriggerText: {
    flex: 1,
    minWidth: 0,
  },
  carDropdownTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TIP_TITLE_BLUE,
  },
  carDropdownSubtitle: {
    fontSize: 11,
    color: GRAY,
    marginTop: 2,
  },
  carDropdownMenuOuter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    marginTop: 8,
    padding: GRADIENT_FRAME,
    zIndex: 40,
    ...cardElevation,
  },
  carDropdownMenuInner: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingVertical: 4,
    overflow: "hidden",
  },
  carDropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  carDropdownRowActive: {
    backgroundColor: "#F5FAFF",
  },
  carDropdownRowText: {
    flex: 1,
    minWidth: 0,
  },
  carDropdownRowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TIP_TITLE_BLUE,
  },
  carDropdownRowSubtitle: {
    fontSize: 11,
    color: GRAY,
    marginTop: 2,
  },
  carDropdownRowSpacer: {
    width: 22,
    height: 22,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#84D2F6",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...cardElevation,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 6,
  },

  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  pillGradient: {
    borderRadius: 999,
    paddingHorizontal: 18,
    overflow: 'hidden',
  },

  shadowWrapper: {
    borderRadius:999,
    ...cardElevation,
  },
  pillTextActive: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    paddingVertical:8,
  },
  pillInactive: {
    borderRadius: 999,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    paddingVertical:8,
    ...cardElevation,
  },
  pillTextInactive: {
    color: "#8D8D8D",
    fontSize: 14,
    fontWeight: "600",
  },

  // ── Empty state ───────────────────────────────────────
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyStateText: {
    color: "#B0CDE0",
    fontSize: 15,
    fontWeight: "500",
  },

  // ── Service Card ──────────────────────────────────────
  serviceContainer: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    width: "98%",
    ...cardElevation,
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