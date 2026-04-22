import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import * as Location from "expo-location";
import { fetchMapBundle, type MapMechanic } from "@/lib/mapApi";
import { MechanicMapPreview } from "@/components/MechanicMapPreview.native";
import { GradientText } from "@/styles/global";
// import MechanicMapPreview from './MechanicMapPreview';
import { globalStyles } from "@/styles/global";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
/** Scroll area width (screen has `paddingHorizontal: 20`) — required so top-row flex + absolute menu get real widths */
const CONTENT_WIDTH = SCREEN_WIDTH - 40;
const MODAL_MAP_WIDTH = Math.min(SCREEN_WIDTH - 24, 360 - 24);
const GRADIENT_BORDER: readonly [string, string, string] = [
  "#84D2F6",
  "#5FA8D3",
  "#386FA4",
];
/** Gradient “border” thickness — shared by car dropdown, help tiles, general tips */
const GRADIENT_FRAME = 0;
const MODAL_MAP_HEIGHT = 220;

/** Modal backdrop: lower = softer blur (was 80). Overlay stacks on top of BlurView. */
const MODAL_BLUR_INTENSITY = 10;
const MODAL_DIM_OVERLAY = "rgba(0,0,0,0.1)";

/** Single gray for dashboard labels, icons, and secondary text */
const GRAY = "#8D8D8D";
const TIP_TITLE_BLUE = "#5FA8D3";
/** Upcoming service pill — red border / pale fill (Figma) */
const SERVICE_ALERT_RED = "#E53935";
const SERVICE_ALERT_BG = "#FFF5F5";
/** Spark plug icon — same as timeline.tsx (Service Timeline → Spark plug replacement) */
const SPARK_PLUG_ICON_COLOR = "#FF6565";
type Mechanic = MapMechanic;

/** Fallback when map API is offline — same data as `backend/map-api/server.mjs` */
const DEFAULT_MECHANICS: Mechanic[] = [
  {
    id: "1",
    name: "Baker's Spring Valley Automotive",
    address: "7821 Spring Valley Rd, Dallas, TX 75254",
    distance: "3.4 mi",
    rating: 4.9,
    reviewCount: 579,
    hours: "Open • Closes 6 PM",
    services: ["Oil Change", "Brakes", "Diagnostics"],
    review:
      "They are always kind and honest and get the job done well! I won't go anywhere else for my cars. - Haley Thomas",
    phone: "tel:+12145551234",
    lat: 32.9196,
    lng: -96.858,
  },
  {
    id: "2",
    name: "Precision Auto Care",
    address: "591 W Campbell Rd, Richardson, TX 75080",
    distance: "1.7 mi",
    rating: 4.7,
    reviewCount: 42,
    hours: "Open • Closes 6 PM",
    services: ["Oil Change", "Brakes", "Diagnostics"],
    review:
      "I had the best experience with Jim! Had an easy fix on my brake right sensor and he ordered the part that day.",
    phone: "tel:+12145555678",
    lat: 32.9806,
    lng: -96.7502,
  },
  {
    id: "3",
    name: "Tidwell Auto Service",
    address: "3283 Independence Pkwy, Plano, TX 75075",
    distance: "4.1 mi",
    rating: 4.6,
    reviewCount: 128,
    hours: "Open • Closes 7 PM",
    services: ["Oil Change", "Brakes", "Diagnostics"],
    review:
      "Fast and professional. Will definitely come back for my next service.",
    phone: "tel:+12145559999",
    lat: 33.045,
    lng: -96.698,
  },
];

const MAP_REGION = {
  latitude: 32.93,
  longitude: -96.8,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

type GarageCar = {
  id: string;
  title: string;
  subtitle: string;
};

/** Garage vehicles — switch selection here; all routes stay on this dashboard for now */
const GARAGE_CARS: GarageCar[] = [
  { id: "civic", title: "My Rolla", subtitle: "2014 Toyota Corolla" },
  { id: "bibic", title: "My Bibic", subtitle: "2017 Honda Civic" },

];

export default function Dashboard() {
  const router = useRouter();
  const [showAAAModal, setShowAAAModal] = useState(false);
  const [showMechanicModal, setShowMechanicModal] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string>(GARAGE_CARS[0].id);
  const [carMenuOpen, setCarMenuOpen] = useState(false);
  const [mapRegion, setMapRegion] = useState(MAP_REGION);
  const [mechanics, setMechanics] = useState<Mechanic[]>(DEFAULT_MECHANICS);
  const [mechanicsLoading, setMechanicsLoading] = useState(false);

  useEffect(() => {
    if (!showMechanicModal) return;
    let cancelled = false;
    (async () => {
      setMechanicsLoading(true);
      try {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (perm.status === "granted") {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (cancelled) return;
          const bundle = await fetchMapBundle({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          if (cancelled) return;
          setMapRegion(bundle.region);
          setMechanics(bundle.mechanics);
        } else {
          const bundle = await fetchMapBundle();
          if (cancelled) return;
          setMapRegion(bundle.region);
          setMechanics(bundle.mechanics);
        }
      } catch {
        if (!cancelled) {
          setMechanics(DEFAULT_MECHANICS);
          setMapRegion(MAP_REGION);
        }
      } finally {
        if (!cancelled) setMechanicsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showMechanicModal]);

  const selectedCar =
    GARAGE_CARS.find((c) => c.id === selectedCarId) ?? GARAGE_CARS[0];
  /** Strip leading model year from subtitle, e.g. "2017 Honda Civic" → "Honda Civic" */
  const tipsVehicleLabel = selectedCar.subtitle.replace(/^\d{4}\s+/, "");

  const openLargerMap = () => {
    const url =
      Platform.OS === "ios"
        ? `https://maps.apple.com/?q=${mapRegion.latitude},${mapRegion.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${mapRegion.latitude},${mapRegion.longitude}`;
    Linking.openURL(url);
  };

  const openDirections = (m: Mechanic) => {
    const url =
      Platform.OS === "ios"
        ? `https://maps.apple.com/?daddr=${m.lat},${m.lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;
    Linking.openURL(url);
  };

  const openGooglePlaceListing = (m: Mechanic) => {
    if (!m.placeId) return;
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(m.placeId)}`,
    );
  };

  const handleScanPress = () => {
    router.push("/scanCamera");
  };

  const handleServiceTimelinePress = () => {
    router.push("/myGarage");
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top: single car dropdown (garage) + scan */}
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
                <LinearGradient
                  colors={GRADIENT_BORDER}
                  style={styles.carDropdownFrame}
                >
                  <View style={styles.carDropdownInner}>
                    <View style={styles.carDropdownTriggerRow}>
                      <View style={styles.carDropdownTriggerText}>
                        <Text style={styles.carDropdownTitle} numberOfLines={1}>
                          {selectedCar.title}
                        </Text>
                        <Text
                          style={styles.carDropdownSubtitle}
                          numberOfLines={1}
                        >
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
                </LinearGradient>
              </TouchableOpacity>

              {carMenuOpen && (
                <LinearGradient
                  colors={GRADIENT_BORDER}
                  style={styles.carDropdownMenuOuter}
                >
                  <View
                    style={styles.carDropdownMenuInner}
                    accessibilityViewIsModal
                  >
                    {GARAGE_CARS.map((car) => {
                      const isActive = car.id === selectedCarId;
                      return (
                        <TouchableOpacity
                          key={car.id}
                          style={[
                            styles.carDropdownRow,
                            isActive && styles.carDropdownRowActive,
                          ]}
                          activeOpacity={0.85}
                          onPress={() => {
                            setSelectedCarId(car.id);
                            setCarMenuOpen(false);
                          }}
                        >
                          <View style={styles.carDropdownRowText}>
                            <Text
                              style={styles.carDropdownRowTitle}
                              numberOfLines={2}
                            >
                              {car.title}
                            </Text>
                            <Text
                              style={styles.carDropdownRowSubtitle}
                              numberOfLines={2}
                            >
                              {car.subtitle}
                            </Text>
                          </View>
                          {isActive ? (
                            <Ionicons
                              name="checkmark-circle"
                              size={22}
                              color={TIP_TITLE_BLUE}
                            />
                          ) : (
                            <View style={styles.carDropdownRowSpacer} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </LinearGradient>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.scanButton}
            activeOpacity={0.85}
            onPress={handleScanPress}
          >
            <Ionicons name="scan-outline" size={26} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>

        {/* WIP!!!! 
        Car snapshot — grey block only on screen bg (no white wrapper) */}
        {/* <View style={styles.heroOuter}>
          <View style={styles.heroImagePlaceholder}>
            <Text style={styles.heroPlaceholderText}>
              {selectedCar.title} — snapshot
            </Text>
          </View>
        </View> */}

        <Image source ={require("../../assets/images/toyotaCorolla.webp")} style = {{width: 300, height:200, alignSelf:'center'}}/>

        <View style={styles.dashSection}>
          <View style={styles.dashSectionHeader}>
            <View style={styles.dashSectionTitleRow}>
              <Text style={styles.dashSectionTitle}>Upcoming Services</Text>
              <Ionicons
                name="notifications-outline"
                size={18}
                color={GRAY}
                style={styles.dashSectionTitleIcon}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.servicePill}
            activeOpacity={0.85}
            onPress={handleServiceTimelinePress}
          >
            <Ionicons
              name="water"
              size={35}
              color={SPARK_PLUG_ICON_COLOR}
              style={styles.serviceSparkIcon}
            />
            <View style={styles.serviceTextBlock}>
              <Text style={styles.serviceTitle}>Oil Change</Text>
              <Text style={styles.serviceSubtitle}>Due in 13 days</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={GRAY} />
          </TouchableOpacity>
        </View>

        <View style={styles.dashSection}>
          <View style={styles.dashSectionHeader}>
            <View style={styles.dashSectionTitleRow}>
              <Text style={styles.dashSectionTitle}>Help</Text>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color={GRAY}
                style={styles.dashSectionTitleIcon}
              />
            </View>
          </View>
          <View style={styles.helpRow}>
            <View style={styles.helpTileGradientWrap}>
              <View style={styles.helpTileGradientInner}>
                <TouchableOpacity
                  style={styles.helpTile}
                  activeOpacity={0.85}
                  onPress={() => setShowAAAModal(true)}
                >
                  <View style={styles.helpTileTopRow}>
                    <Text style={styles.helpCardTitle} numberOfLines={2}>
                      Call AAA Helpline
                    </Text>
                    <Ionicons name="call-outline" size={22} color={GRAY} />
                  </View>
                  <Text style={styles.helpCardSubtitle}>
                    Connect to roadside assistance
                  </Text>
                  <View style={styles.helpTileCornerArrow}>
                    <Ionicons
                      name="chevron-forward-circle-outline"
                      size={22}
                      color={GRAY}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <LinearGradient
              colors={GRADIENT_BORDER}
              style={styles.helpTileGradientWrap}
            >
              <View style={styles.helpTileGradientInner}>
                <TouchableOpacity
                  style={styles.helpTile}
                  activeOpacity={0.85}
                  onPress={() => setShowMechanicModal(true)}
                >
                  <View style={styles.helpTileTopRow}>
                    <Text style={styles.helpCardTitle} numberOfLines={2}>
                      Nearest Mechanic
                    </Text>
                    <Ionicons name="map-outline" size={22} color={GRAY} />
                  </View>
                  <Text style={styles.helpCardSubtitle}>
                    Find trusted mechanics near you
                  </Text>
                  <View style={styles.helpTileCornerArrow}>
                    <Ionicons
                      name="chevron-forward-circle-outline"
                      size={22}
                      color={GRAY}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={GRADIENT_BORDER}
              style={styles.helpTileGradientWrap}
            >
              <View style={styles.helpTileGradientInner}>
                <TouchableOpacity
                  style={styles.helpTile}
                  activeOpacity={0.85}
                  onPress={() => router.push("../scanCamera")}
                >
                  <View style={styles.helpTileTopRow}>
                    <Text style={styles.helpCardTitle} numberOfLines={2}>
                      Scan or Add Issue
                    </Text>
                    <Ionicons name="camera-outline" size={22} color={GRAY} />
                  </View>
                  <Text style={styles.helpCardSubtitle}>
                    Get smart suggestions for any car issue
                  </Text>
                  <View style={styles.helpTileCornerArrow}>
                    <Ionicons
                      name="chevron-forward-circle-outline"
                      size={22}
                      color={GRAY}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.dashSection}>
          <View style={styles.dashSectionHeader}>
            <View style={styles.dashSectionTitleRow}>
              <Text style={styles.dashSectionTitle}>
                General Tips for Your {tipsVehicleLabel}
              </Text>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={GRAY}
                style={styles.dashSectionTitleIcon}
              />
            </View>
          </View>
          <LinearGradient
            colors={GRADIENT_BORDER}
            style={styles.tipsGradientWrap}
          >
            <View style={styles.tipsGradientInner}>
              <View style={styles.tipCategoryRow}>
                <Ionicons
                  name="warning-outline"
                  size={18}
                  color={GRAY}
                  style={styles.tipCategoryIcon}
                />
                <Text style={styles.tipCategoryTitle}>Known Common Issues</Text>
              </View>
              <View style={styles.tipBulletRow}>
                <View style={styles.tipBulletDot} />
                <Text style={styles.tipBulletText}>
                  Transmission synchro wear / gear grind reported in some
                  models.
                </Text>
              </View>
              <View style={styles.tipBulletRow}>
                <View style={styles.tipBulletDot} />
                <Text style={styles.tipBulletText}>
                  AC condenser failure is a known issue (often
                  warranty-covered).
                </Text>
              </View>
              <View style={styles.tipBulletRow}>
                <View style={styles.tipBulletDot} />
                <Text style={styles.tipBulletText}>
                  Fuel pump recall in some 2017–2020 Hondas may affect
                  performance.
                </Text>
              </View>
              <View style={styles.tipBulletRow}>
                <View style={styles.tipBulletDot} />
                <Text style={styles.tipBulletText}>
                  Turbo cooling components should be monitored for overheating
                  stress.
                </Text>
              </View>

              {/* General Care Tips */}
              <View
                style={[styles.tipCategoryRow, styles.tipCategoryRowAfterBlock]}
              >
                <Ionicons
                  name="car-outline"
                  size={18}
                  color={GRAY}
                  style={styles.tipCategoryIcon}
                />
                <Text style={styles.tipCategoryTitle}>General Care Tips</Text>
              </View>
              <View style={styles.tipBulletRow}>
                <View style={styles.tipBulletDot} />
                <Text style={styles.tipBulletText}>
                  Follow regular oil changes & inspections.
                </Text>
              </View>
              <View style={styles.tipBulletRow}>
                <View style={styles.tipBulletDot} />
                <Text style={styles.tipBulletText}>
                  Check brake pads often; high-performance driving wears them
                  faster.
                </Text>
              </View>
              <View style={styles.tipBulletRow}>
                <View style={styles.tipBulletDot} />
                <Text style={styles.tipBulletText}>
                  Rotate tires regularly; stock summer tires wear quickly.
                </Text>
              </View>
              <View style={styles.tipBulletRow}>
                <View style={styles.tipBulletDot} />
                <Text style={styles.tipBulletText}>
                  Let engine warm up before aggressive driving to protect turbo.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* AAA popup - bg blur + gradient card + icons & text */}
      <Modal
        visible={showAAAModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAAAModal(false)}
      >
        <View style={styles.modalBackdropWrap}>
          <BlurView
            intensity={MODAL_BLUR_INTENSITY}
            style={styles.blurFill}
            tint="default"
          />
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowAAAModal(false)}
          >
            <Pressable onPress={() => {}}>
              <LinearGradient
                colors={GRADIENT_BORDER}
                style={styles.modalGradientWrap}
              >
                <View style={styles.modalCard}>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalTitleRow}>
                      <GradientText style={styles.modalTitle}>
                        AAA Roadside Assistance
                      </GradientText>
                    </View>
                    <Pressable
                      onPress={() => setShowAAAModal(false)}
                      hitSlop={12}
                    >
                      <Ionicons name="close" size={22} color="#3272ae" />
                    </Pressable>
                  </View>
                  <View style={styles.aaaSection}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color="#53c1f3"
                      style={styles.aaaIcon}
                    />
                    <View>
                      <GradientText style={styles.aaaLabel}>
                        24/7 Emergency Helpline
                      </GradientText>
                      <Text style={styles.modalBodyText}>
                        Call: 1-800-AAA-HELP (1-800-222-4357)
                      </Text>
                    </View>
                  </View>
                  <View style={styles.aaaSection}>
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#53c1f3"
                      style={styles.aaaIcon}
                    />
                    <View>
                      <GradientText style={styles.aaaLabel}>
                        Before You Call
                      </GradientText>
                      <Text style={styles.modalBodyText}>Have this ready:</Text>
                      <Text style={styles.modalBodyText}>
                        • Your AAA Membership Number
                      </Text>
                      <Text style={styles.modalBodyText}>• Your Location</Text>
                      <Text style={styles.modalBodyText}>
                        • Vehicle Make & Model
                      </Text>
                      <Text style={styles.modalBodyText}>
                        • Brief description of the issue
                      </Text>
                    </View>
                  </View>
                  <View style={styles.aaaSection}>
                    <Ionicons
                      name="warning-outline"
                      size={20}
                      color="#53c1f3"
                      style={styles.aaaIcon}
                    />
                    <View>
                      <GradientText style={styles.aaaLabel}>
                        Not a Member?
                      </GradientText>
                      <Text style={styles.modalBodyText}>
                        AAA may offer pay-per-service roadside help depending on
                        availability.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.aaaServicesRow}>
                    <GradientText style={styles.aaaServicesText}>
                      Towing • Battery • Flat Tire • Fuel • Lockout
                    </GradientText>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </Pressable>
        </View>
      </Modal>

      {/* Nearby mechanics popup – blur bg like AAA + embedded map + gradient card */}
      <Modal
        visible={showMechanicModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowMechanicModal(false)}
      >
        <View style={styles.modalBackdropWrap}>
          <BlurView
            intensity={MODAL_BLUR_INTENSITY}
            style={styles.blurFill}
            tint="default"
          />
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowMechanicModal(false)}
          >
            <Pressable
              style={styles.mechanicModalCard}
              onPress={(e) => e.stopPropagation()}
            >
              <LinearGradient
                colors={GRADIENT_BORDER}
                style={styles.mechanicModalGradientWrap}
              >
                <View style={styles.mechanicModalInner}>
                  <View style={styles.modalHeader}>
                    <GradientText style={styles.modalTitle}>
                      Nearby Mechanics
                    </GradientText>
                    <Pressable
                      onPress={() => setShowMechanicModal(false)}
                      hitSlop={12}
                    >
                      <Ionicons name="close" size={22} color="#5FA8D3" />
                    </Pressable>
                  </View>

                  {mechanicsLoading && (
                    <View style={styles.mechanicsLoadingRow}>
                      <ActivityIndicator color="#5FA8D3" />
                      <Text style={styles.mechanicsLoadingText}>
                        Finding shops near you…
                      </Text>
                    </View>
                  )}

                  <GradientText style={styles.listCardLabel}>
                    Shops
                  </GradientText>
                  <ScrollView
                    style={styles.mechanicListScroll}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                  >
                    {mechanics.map((m) => (
                      <View key={m.id} style={styles.mechanicCard}>
                        <View style={styles.mechanicCardHeader}>
                          <Text style={styles.mechanicName} numberOfLines={2}>
                            {m.name}
                          </Text>
                          <View style={styles.distancePill}>
                            <Text style={styles.distancePillText}>
                              {m.distance}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.mechanicAddressRow}>
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color="#8D8D8D"
                          />
                          <Text style={styles.mechanicAddress}>
                            {m.address}
                          </Text>
                        </View>
                        <View style={styles.mechanicRatingRow}>
                          <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map((i) => {
                              const full = i <= Math.floor(m.rating);
                              const half =
                                !full &&
                                i === Math.floor(m.rating) + 1 &&
                                m.rating % 1 >= 0.5;
                              return (
                                <Ionicons
                                  key={i}
                                  name={
                                    full
                                      ? "star"
                                      : half
                                        ? "star-half"
                                        : "star-outline"
                                  }
                                  size={14}
                                  color="#FFB800"
                                />
                              );
                            })}
                          </View>
                          <Text style={styles.mechanicRatingText}>
                            {m.rating > 0
                              ? `${m.rating} (${m.reviewCount} reviews)`
                              : "No Google rating yet"}
                          </Text>
                        </View>
                        <View style={styles.mechanicHoursRow}>
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color="#4CAF50"
                          />
                          <Text style={styles.mechanicHours}>{m.hours}</Text>
                        </View>
                        <View style={styles.servicePillsRow}>
                          {m.services.map((s) => (
                            <View key={s} style={styles.servicePillSmall}>
                              <Text style={styles.servicePillSmallText}>
                                {s}
                              </Text>
                            </View>
                          ))}
                        </View>
                        {m.review.trim().length > 0 && (
                          <View style={styles.reviewBox}>
                            <Text
                              style={styles.reviewBoxText}
                              numberOfLines={3}
                            >
                              {m.review}
                            </Text>
                          </View>
                        )}
                        <View style={styles.mechanicActions}>
                          <TouchableOpacity
                            style={styles.directionsBtn}
                            onPress={() => openDirections(m)}
                          >
                            <LinearGradient
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              colors={["#53c1f3", "#3272ae"]}
                              style={styles.scanButton}
                            >
                              <Ionicons
                                name="navigate-outline"
                                size={18}
                                color="#FFF"
                              />
                              <Text style={styles.directionsBtnText}>
                                Directions
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.directionsBtn}
                            onPress={() => openDirections(m)}
                          >
                            <LinearGradient
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              colors={["#53c1f3", "#3272ae"]}
                              style={styles.scanButton}
                            >
                               <Ionicons
                              name={m.phone ? "call-outline" : "logo-google"}
                              size={18}
                              color="#FFF"
                            />
                            <Text style={styles.callBtnText}>
                              {m.phone ? "Call" : "Google"}
                            </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                  <GradientText
                    style={[styles.mapCardLabel, styles.mapCardLabelAfterList]}
                  >
                    Map
                  </GradientText>
                  <LinearGradient
                    colors={GRADIENT_BORDER}
                    style={styles.mapGradientWrap}
                  >
                    <View style={styles.mapWrap} collapsable={false}>
                      <MechanicMapPreview
                        style={styles.map}
                        region={mapRegion}
                        mechanics={mechanics}
                      />
                      <TouchableOpacity
                        style={styles.viewLargerMapBtn}
                        onPress={openLargerMap}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.viewLargerMapText}>
                          View larger map
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color="#5FA8D3"
                        />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </View>
              </LinearGradient>
            </Pressable>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },

  scrollContent: {
    paddingTop: 60,
    /** Tight bottom inset so scroll stops near the General Tips card + tab bar */
    paddingBottom: 72,
    /** Without this, rows inside ScrollView can shrink-wrap and the car menu collapses to ~0 width */
    width: CONTENT_WIDTH,
    alignSelf: "center",
  },

  heroOuter: {
    marginBottom: 0,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    width: "100%",
  },

  /**
   * Fills space left of Scan. Min/max use CONTENT_WIDTH so the trigger + absolute menu stay readable.
   */
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
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 40,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
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

  /** Same as timeline.tsx — blue pill, white scan icon + label */
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#84D2F6",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  nearbyMechButton: {
    flexDirection: "row",
    alignItems: "center",
        backgroundColor: '#ffff',
    justifyContent: "center",
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 6,
  },

  heroImagePlaceholder: {
    width: "100%",
    height: 170,
    borderRadius: 18,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },

  heroPlaceholderText: {
    color: GRAY,
    fontSize: 14,
  },

  /** Upcoming / Need Help / General Tips — equal vertical rhythm */
  dashSection: {
    marginVertical: 20,
  },

  dashSectionHeader: {
    marginBottom: 15,
  },

  dashSectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    maxWidth: "100%",
  },

  dashSectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: GRAY,
    flexShrink: 1,
  },

  dashSectionTitleIcon: {
    marginLeft: 6,
  },

  servicePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SERVICE_ALERT_BG,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: SERVICE_ALERT_RED,
  },

  serviceSparkIcon: {
    paddingRight: 5,
    marginRight: 5,
  },

  serviceTextBlock: {
    flex: 1,
  },

  serviceTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: GRAY,
    marginLeft: 1,
  },

  serviceSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: GRAY,
    marginTop: 2,
    marginLeft: 1,
  },

  /* Help section row with 3 tiles */

  helpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,

  },

  helpTileGradientWrap: {
    flex: 1,
    padding: GRADIENT_FRAME,
    borderRadius: 17,
    overflow: "hidden",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2.5,
    elevation: 4,
  },

  helpTileGradientInner: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  helpTile: {
    position: "relative",
    flex: 1,
    minHeight: 118,
    paddingVertical: 12,
    paddingHorizontal: 8,
    paddingBottom: 28,
    backgroundColor: "transparent",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },

  helpTileTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 6,
  },

  helpCardTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: GRAY,
    lineHeight: 16,
  },

  helpCardSubtitle: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 14,
    color: GRAY,
    paddingRight: 4,
  },

  helpTileCornerArrow: {
    position: "absolute",
    right: 6,
    bottom: 6,
  },

  tipsGradientWrap: {
    padding: GRADIENT_FRAME,
    borderRadius: 24,
    overflow: "hidden",
  },

  tipsGradientInner: {
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    padding: 12,
    overflow: "hidden",
  },

  tipCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tipCategoryRowAfterBlock: {
    marginTop: 16,
  },

  tipCategoryIcon: {
    marginRight: 4,
  },

  tipCategoryTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: TIP_TITLE_BLUE,
  },

  tipBulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },

  tipBulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: GRAY,
    marginTop: 7,
    marginRight: 6,
  },

  tipBulletText: {
    flex: 1,
    fontSize: 13,
    color: GRAY,
    lineHeight: 18,
  },

  blurFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  modalBackdropWrap: {
    flex: 1,
    overflow: "hidden",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: MODAL_DIM_OVERLAY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  modalGradientWrap: {
    padding: GRADIENT_FRAME,
    borderRadius: 24,
    overflow: "hidden",
    width: "100%",
    maxWidth: 360,
  },

  modalCard: {
    margin: GRADIENT_FRAME,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
  },

  aaaSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
  },

  aaaIcon: {
    marginRight: 10,
    marginTop: 2,
  },

  aaaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5FA8D3",
    marginBottom: 4,
  },

  aaaServicesRow: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E8F6FF",
  },

  aaaServicesText: {
    fontSize: 13,
    color: "#5FA8D3",
    fontWeight: "500",
  },

  mechanicModalCard: {
    width: "100%",
    maxWidth: 360,
    maxHeight: "88%",
    overflow: "hidden",
  },

  mechanicModalGradientWrap: {
    padding: GRADIENT_FRAME,
    borderRadius: 24,
    overflow: "hidden",
    width: "100%",
  },

  mechanicModalInner: {
    margin: GRADIENT_FRAME,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 12,
    overflow: "hidden",
  },

  mechanicsLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 4,
  },

  mechanicsLoadingText: {
    fontSize: 13,
    color: GRAY,
  },

  listCardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5FA8D3",
    marginTop: 4,
    marginBottom: 4,
  },

  mapCardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5FA8D3",
    marginTop: 8,
    marginBottom: 4,
  },

  mapCardLabelAfterList: {
    marginTop: 14,
  },

  mapGradientWrap: {
    padding: GRADIENT_FRAME,
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },

  mapWrap: {
    width: "100%",
    minHeight: MODAL_MAP_HEIGHT - 4,
    height: MODAL_MAP_HEIGHT - 4,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#D0E8F4",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  viewLargerMapBtn: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#84D2F6",
    gap: 4,
  },

  viewLargerMapText: {
    fontSize: 13,
    color: "#5FA8D3",
    fontWeight: "500",
  },

  mapZoomControls: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },

  mapZoomBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  mechanicListScroll: {
    maxHeight: 300,
    marginTop: 0,
  },

  mechanicCard: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingVertical: 4,
  },

  mechanicCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },

  distancePill: {
    backgroundColor: "#E8F6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  distancePillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5FA8D3",
  },

  mechanicAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },

  mechanicAddress: {
    fontSize: 12,
    color: "#8D8D8D",
    flex: 1,
  },

  mechanicRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },

  starRow: {
    flexDirection: "row",
  },

  mechanicRatingText: {
    fontSize: 12,
    color: "#8D8D8D",
  },

  mechanicHoursRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },

  mechanicHours: {
    fontSize: 12,
    color: "#8D8D8D",
  },

  servicePillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },

  servicePillSmall: {
    backgroundColor: "#E8F6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  servicePillSmallText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#5FA8D3",
  },

  reviewBox: {
    backgroundColor: "#E8F6FF",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#5FA8D3",
  },

  reviewBoxText: {
    fontSize: 12,
    color: "#5A5A5A",
    lineHeight: 18,
    fontStyle: "italic",
  },

  mechanicActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  directionsBtn: {
    justifyContent: "center",
    borderRadius: 50,
    width: 300,
    height: 60,
    backgroundColor: "transparent",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    flex: 1,
  },

  directionsBtnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },

  callBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5FA8D3",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },

  callBtnDisabled: {
    opacity: 0.45,
  },

  callBtnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5FA8D3",
  },

  modalTitleMask: {
    color: "#000",
  },

  modalTitleGradientPlaceholder: {
    opacity: 0,
  },

  modalBodyText: {
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 20,
  },

  mapPlaceholder: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  mapPlaceholderInner: {
    flex: 1,
    width: "100%",
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    gap: 8,
    paddingVertical: 16,
  },

  mapPlaceholderTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5FA8D3",
  },

  mapPlaceholderSubtext: {
    fontSize: 13,
    color: "#8D8D8D",
  },

  mapPlaceholderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#84D2F6",
    gap: 6,
    marginTop: 4,
  },

  mechanicList: {
    marginTop: 14,
  },

  mechanicName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
  },

  mechanicMeta: {
    fontSize: 13,
    color: "#8D8D8D",
  },
});
