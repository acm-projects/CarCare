import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MODAL_MAP_WIDTH = Math.min(SCREEN_WIDTH - 24, 360 - 24);
const GRADIENT_BORDER: readonly [string, string, string] = ['#84D2F6', '#5FA8D3', '#386FA4'];
const MODAL_MAP_HEIGHT = 220;

type Mechanic = {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  hours: string;
  services: string[];
  review: string;
  phone: string;
  lat: number;
  lng: number;
};

const MECHANICS: Mechanic[] = [
  {
    id: '1',
    name: "Baker's Spring Valley Automotive",
    address: '7821 Spring Valley Rd, Dallas, TX 75254',
    distance: '3.4 mi',
    rating: 4.9,
    reviewCount: 579,
    hours: 'Open • Closes 6 PM',
    services: ['Oil Change', 'Brakes', 'Diagnostics'],
    review: 'They are always kind and honest and get the job done well! I won\'t go anywhere else for my cars. - Haley Thomas',
    phone: 'tel:+12145551234',
    lat: 32.9196,
    lng: -96.858,
  },
  {
    id: '2',
    name: 'Precision Auto Care',
    address: '591 W Campbell Rd, Richardson, TX 75080',
    distance: '1.7 mi',
    rating: 4.7,
    reviewCount: 42,
    hours: 'Open • Closes 6 PM',
    services: ['Oil Change', 'Brakes', 'Diagnostics'],
    review: 'I had the best experience with Jim! Had an easy fix on my brake right sensor and he ordered the part that day.',
    phone: 'tel:+12145555678',
    lat: 32.9806,
    lng: -96.7502,
  },
  {
    id: '3',
    name: 'Tidwell Auto Service',
    address: '3283 Independence Pkwy, Plano, TX 75075',
    distance: '4.1 mi',
    rating: 4.6,
    reviewCount: 128,
    hours: 'Open • Closes 7 PM',
    services: ['Oil Change', 'Brakes', 'Diagnostics'],
    review: 'Fast and professional. Will definitely come back for my next service.',
    phone: 'tel:+12145559999',
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

export default function Dashboard() {
  const router = useRouter();
  const [showAAAModal, setShowAAAModal] = useState(false);
  const [showMechanicModal, setShowMechanicModal] = useState(false);

  const openLargerMap = () => {
    const url =
      Platform.OS === 'ios'
        ? `https://maps.apple.com/?q=${MAP_REGION.latitude},${MAP_REGION.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${MAP_REGION.latitude},${MAP_REGION.longitude}`;
    Linking.openURL(url);
  };

  const openDirections = (m: Mechanic) => {
    const url =
      Platform.OS === 'ios'
        ? `https://maps.apple.com/?daddr=${m.lat},${m.lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;
    Linking.openURL(url);
  };

  const handleScanPress = () => {
    router.push('/myGarage');
  };

  const handleServiceTimelinePress = () => {
    router.push('/myGarage');
  };

  return (
    <View style={[styles.screen, styles.screenOverride]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, styles.scrollContentOverride]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top car selector + scan */}
        <View style={styles.topRow}>
          <View style={styles.carSelectorGroup}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carChipsRow}
            >
              <View style={[styles.carChip, styles.carChipActive]}>
                <Text style={styles.carChipTitle}>My Civic Type R</Text>
                <Text style={styles.carChipSubtitle}>2017 Honda Civic</Text>
              </View>
              <View style={styles.carChip}>
                <Text style={styles.carChipTitle}>My BMW 335i</Text>
                <Text style={styles.carChipSubtitle}>2013 BMW 335i</Text>
              </View>
            </ScrollView>
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

        {/* Placeholder for car card image / dashboard graphic */}
        <LinearGradient colors={GRADIENT_BORDER} style={styles.gradientCardWrap}>
          <View style={styles.gradientCardInner}>
            <View style={styles.heroCard}>
              <View style={styles.heroImagePlaceholder}>
                <Text style={styles.heroPlaceholderText}>Your car snapshot</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Upcoming services card */}
        <LinearGradient colors={GRADIENT_BORDER} style={styles.gradientCardWrap}>
          <View style={styles.gradientCardInner}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Upcoming Services</Text>
              <TouchableOpacity
                style={styles.servicePill}
                activeOpacity={0.85}
                onPress={handleServiceTimelinePress}
              >
                <View style={styles.serviceIconCircle}>
                  <Ionicons name="flash-outline" size={20} color="#F16063" />
                </View>
                <View style={styles.serviceTextBlock}>
                  <Text style={styles.serviceTitle}>Spark plug replacement</Text>
                  <Text style={styles.serviceSubtitle}>Due in 2 days</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#8D8D8D" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Need Help – title only, gradient box around each option */}
        <Text style={[styles.sectionTitle, styles.needHelpTitle]}>Need Help</Text>
        <View style={styles.helpRow}>
          <LinearGradient colors={GRADIENT_BORDER} style={styles.helpTileGradientWrap}>
            <View style={styles.helpTileGradientInner}>
              <TouchableOpacity
                style={styles.helpTile}
                activeOpacity={0.85}
                onPress={() => setShowAAAModal(true)}
              >
                <Ionicons name="call-outline" size={24} color="#5FA8D3" />
                <Text style={styles.helpTitle}>Call AAA{'\n'}Helpline</Text>
                <Text style={styles.helpSubtitle}>Connect to roadside assistance fast!</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <LinearGradient colors={GRADIENT_BORDER} style={styles.helpTileGradientWrap}>
            <View style={styles.helpTileGradientInner}>
              <TouchableOpacity
                style={styles.helpTile}
                activeOpacity={0.85}
                onPress={() => setShowMechanicModal(true)}
              >
                <Ionicons name="map-outline" size={24} color="#5FA8D3" />
                <Text style={styles.helpTitle}>Nearby{'\n'}Mechanics</Text>
                <Text style={styles.helpSubtitle}>Find trusted mechanics near you!</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <LinearGradient colors={GRADIENT_BORDER} style={styles.helpTileGradientWrap}>
            <View style={styles.helpTileGradientInner}>
              <TouchableOpacity
                style={styles.helpTile}
                activeOpacity={0.85}
                onPress={handleScanPress}
              >
                <Ionicons name="scan-circle-outline" size={26} color="#5FA8D3" />
                <Text style={styles.helpTitle}>Scan{'\n'}Vehicle</Text>
                <Text style={styles.helpSubtitle}>Get smart suggestions for any car issue!</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* General Tips with icons and bullet lists */}
        <LinearGradient colors={GRADIENT_BORDER} style={styles.gradientCardWrap}>
          <View style={styles.gradientCardInner}>
            <View style={styles.sectionCard}>
              <View style={styles.tipsHeaderRow}>
                <Text style={styles.sectionTitle}>General Tips for Your Honda Civic</Text>
                <Ionicons name="chevron-forward" size={18} color="#5FA8D3" />
              </View>

              <View style={styles.tipsBlock}>
                {/* Known Common Issues */}
                <View style={styles.tipCategoryRow}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#5FA8D3"
                    style={styles.tipCategoryIcon}
                  />
                  <Text style={styles.tipCategoryTitle}>Known Common Issues</Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    Transmission synchro wear / gear grind reported in some models.
                  </Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    AC condenser failure is a known issue (often warranty-covered).
                  </Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    Fuel pump recall in some 2017–2020 Hondas may affect performance.
                  </Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    Turbo cooling components should be monitored for overheating stress.
                  </Text>
                </View>

                {/* Wear & Performance Notes */}
                <View style={[styles.tipCategoryRow, { marginTop: 16 }]}>
                  <Ionicons
                    name="build-outline"
                    size={18}
                    color="#5FA8D3"
                    style={styles.tipCategoryIcon}
                  />
                  <Text style={styles.tipCategoryTitle}>Wear & Performance Notes</Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    Rear brake pads may wear faster due to torque-vectoring system.
                  </Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    High-performance use can increase overall wear & tear.
                  </Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    ABS warning lights may indicate sensor or brake fluid issues.
                  </Text>
                </View>

                {/* Recommended Checks */}
                <View style={[styles.tipCategoryRow, { marginTop: 16 }]}>
                  <Ionicons
                    name="clipboard-outline"
                    size={18}
                    color="#5FA8D3"
                    style={styles.tipCategoryIcon}
                  />
                  <Text style={styles.tipCategoryTitle}>Recommended Checks</Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    Inspect turbo pipes & cooling system periodically.
                  </Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    Ensure recall fixes (fuel pump, steering, etc.) are completed.
                  </Text>
                </View>
                <View style={styles.tipBulletRow}>
                  <View style={styles.tipBulletDot} />
                  <Text style={styles.tipBulletText}>
                    Watch for excessive heat if doing track-style driving.
                  </Text>
                </View>

                {/* General Care Tips */}
                <View style={[styles.tipCategoryRow, { marginTop: 16 }]}>
                  <Ionicons
                    name="car-sport-outline"
                    size={18}
                    color="#5FA8D3"
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
                    Check brake pads often; high-performance driving wears them faster.
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
            </View>
          </View>
        </LinearGradient>
      </ScrollView>

      {/* AAA popup - bg blur + gradient card + icons & text */}
      <Modal
        visible={showAAAModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAAAModal(false)}
      >
        <View style={styles.modalBackdropWrap}>
          <BlurView intensity={80} style={styles.blurFill} tint="dark" />
          <Pressable style={styles.modalBackdrop} onPress={() => setShowAAAModal(false)}>
            <Pressable onPress={() => {}}>
              <LinearGradient colors={GRADIENT_BORDER} style={styles.modalGradientWrap}>
                <View style={styles.modalCard}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>AAA Roadside Assistance</Text>
                    <Pressable onPress={() => setShowAAAModal(false)} hitSlop={12}>
                      <Ionicons name="close" size={22} color="#5FA8D3" />
                    </Pressable>
                  </View>
                  <View style={styles.aaaSection}>
                    <Ionicons name="call-outline" size={20} color="#5FA8D3" style={styles.aaaIcon} />
                    <View>
                      <Text style={styles.aaaLabel}>24/7 Emergency Helpline</Text>
                      <Text style={styles.modalBodyText}>Call: 1-800-AAA-HELP (1-800-222-4357)</Text>
                    </View>
                  </View>
                  <View style={styles.aaaSection}>
                    <Ionicons name="document-text-outline" size={20} color="#5FA8D3" style={styles.aaaIcon} />
                    <View>
                      <Text style={styles.aaaLabel}>Before You Call</Text>
                      <Text style={styles.modalBodyText}>Have this ready:</Text>
                      <Text style={styles.modalBodyText}>• Your AAA Membership Number</Text>
                      <Text style={styles.modalBodyText}>• Your Location</Text>
                      <Text style={styles.modalBodyText}>• Vehicle Make & Model</Text>
                      <Text style={styles.modalBodyText}>• Brief description of the issue</Text>
                    </View>
                  </View>
                  <View style={styles.aaaSection}>
                    <Ionicons name="warning-outline" size={20} color="#F16063" style={styles.aaaIcon} />
                    <Text style={styles.modalBodyText}>
                      Not a Member? AAA may offer pay-per-service roadside help depending on availability.
                    </Text>
                  </View>
                  <View style={styles.aaaServicesRow}>
                    <Text style={styles.aaaServicesText}>Towing • Battery • Flat Tire • Fuel • Lockout</Text>
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
          <BlurView intensity={80} style={styles.blurFill} tint="dark" />
          <Pressable style={styles.modalBackdrop} onPress={() => setShowMechanicModal(false)}>
            <Pressable style={styles.mechanicModalCard} onPress={(e) => e.stopPropagation()}>
              <LinearGradient colors={GRADIENT_BORDER} style={styles.mechanicModalGradientWrap}>
                <View style={styles.mechanicModalInner}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Nearby Mechanics</Text>
                    <Pressable onPress={() => setShowMechanicModal(false)} hitSlop={12}>
                      <Ionicons name="close" size={22} color="#5FA8D3" />
                    </Pressable>
                  </View>

                  {/* Embedded map with markers + View larger map button */}
                  <Text style={styles.mapCardLabel}>Map</Text>
                  <LinearGradient colors={GRADIENT_BORDER} style={styles.mapGradientWrap}>
                    <View style={styles.mapWrap} collapsable={false}>
                      <MapView
                        style={styles.map}
                        region={MAP_REGION}
                        mapType="standard"
                        scrollEnabled
                        zoomEnabled
                        pitchEnabled={false}
                      >
                        {MECHANICS.map((m) => (
                          <Marker key={m.id} coordinate={{ latitude: m.lat, longitude: m.lng }} title={m.name} />
                        ))}
                      </MapView>
                      <TouchableOpacity
                        style={styles.viewLargerMapBtn}
                        onPress={openLargerMap}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.viewLargerMapText}>View larger map</Text>
                        <Ionicons name="chevron-forward" size={16} color="#5FA8D3" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  {/* Scrollable mechanic list */}
                  <ScrollView
                    style={styles.mechanicListScroll}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                  >
                    {MECHANICS.map((m) => (
                      <View key={m.id} style={styles.mechanicCard}>
                        <View style={styles.mechanicCardHeader}>
                          <Text style={styles.mechanicName} numberOfLines={2}>{m.name}</Text>
                          <View style={styles.distancePill}>
                            <Text style={styles.distancePillText}>{m.distance}</Text>
                          </View>
                        </View>
                        <View style={styles.mechanicAddressRow}>
                          <Ionicons name="location-outline" size={14} color="#8D8D8D" />
                          <Text style={styles.mechanicAddress}>{m.address}</Text>
                        </View>
                        <View style={styles.mechanicRatingRow}>
                          <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map((i) => {
                              const full = i <= Math.floor(m.rating);
                              const half = !full && i === Math.floor(m.rating) + 1 && m.rating % 1 >= 0.5;
                              return (
                                <Ionicons
                                  key={i}
                                  name={full ? 'star' : half ? 'star-half' : 'star-outline'}
                                  size={14}
                                  color="#FFB800"
                                />
                              );
                            })}
                          </View>
                          <Text style={styles.mechanicRatingText}>
                            {m.rating} ({m.reviewCount} reviews)
                          </Text>
                        </View>
                        <View style={styles.mechanicHoursRow}>
                          <Ionicons name="time-outline" size={14} color="#4CAF50" />
                          <Text style={styles.mechanicHours}>{m.hours}</Text>
                        </View>
                        <View style={styles.servicePillsRow}>
                          {m.services.map((s) => (
                            <View key={s} style={styles.servicePillSmall}>
                              <Text style={styles.servicePillSmallText}>{s}</Text>
                            </View>
                          ))}
                        </View>
                        <View style={styles.reviewBox}>
                          <Text style={styles.reviewBoxText} numberOfLines={3}>{m.review}</Text>
                        </View>
                        <View style={styles.mechanicActions}>
                          <TouchableOpacity
                            style={styles.directionsBtn}
                            onPress={() => openDirections(m)}
                          >
                            <Ionicons name="navigate-outline" size={18} color="#FFF" />
                            <Text style={styles.directionsBtnText}>Directions</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.callBtn}
                            onPress={() => Linking.openURL(m.phone)}
                          >
                            <Ionicons name="call-outline" size={18} color="#FFF" />
                            <Text style={styles.callBtnText}>Call</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
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
    backgroundColor: '#F3F3F3',
  },

  screenOverride: {
    paddingHorizontal: 0,
  },

  scrollContent: {
    paddingTop: 60,
    paddingBottom: 120,
  },

  scrollContentOverride: {
    paddingHorizontal: 0,
  },

  gradientCardWrap: {
    padding: 2,
    borderRadius: 26,
    marginBottom: 14,
    overflow: 'hidden',
  },

  gradientCardInner: {
    margin: 2,
    borderRadius: 22,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  carSelectorGroup: {
    flex: 1,
    marginRight: 10,
  },

  carChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  carChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    backgroundColor: '#FFFFFF',
  },

  carChipActive: {
    borderColor: '#84D2F6',
    backgroundColor: '#E8F6FF',
  },

  carChipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5FA8D3',
  },

  carChipSubtitle: {
    fontSize: 11,
    color: '#8D8D8D',
  },

  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#84D2F6',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },

  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
  },

  heroImagePlaceholder: {
    height: 170,
    borderRadius: 18,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroPlaceholderText: {
    color: '#8D8D8D',
    fontSize: 14,
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#5FA8D3',
    marginBottom: 8,
  },

  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F8',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F7C5C5',
  },

  serviceIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  serviceTextBlock: {
    flex: 1,
  },

  serviceTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#F16063',
  },

  serviceSubtitle: {
    fontSize: 13,
    color: '#8D8D8D',
  },

  needHelpTitle: {
    marginBottom: 8,
  },

  helpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 14,
  },

  helpTileGradientWrap: {
    flex: 1,
    padding: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },

  helpTileGradientInner: {
    flex: 1,
    margin: 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  helpTile: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  helpTitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#5FA8D3',
    fontWeight: '600',
  },

  helpSubtitle: {
    marginTop: 2,
    fontSize: 10,
    textAlign: 'center',
    color: '#8D8D8D',
    paddingHorizontal: 2,
  },

  /* General Tips */
  tipsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  tipsBlock: {
    marginTop: 4,
  },

  tipCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tipCategoryIcon: {
    marginRight: 6,
  },

  tipCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5FA8D3',
  },

  tipBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },

  tipBulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8D8D8D',
    marginTop: 7,
    marginRight: 6,
  },

  tipBulletText: {
    flex: 1,
    fontSize: 13,
    color: '#8D8D8D',
    lineHeight: 18,
  },

  blurFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  modalBackdropWrap: {
    flex: 1,
    overflow: 'hidden',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  modalGradientWrap: {
    padding: 2,
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 360,
  },

  modalCard: {
    margin: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
  },

  aaaSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },

  aaaIcon: {
    marginRight: 10,
    marginTop: 2,
  },

  aaaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5FA8D3',
    marginBottom: 4,
  },

  aaaServicesRow: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8F6FF',
  },

  aaaServicesText: {
    fontSize: 13,
    color: '#5FA8D3',
    fontWeight: '500',
  },

  mechanicModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  mechanicModalCard: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '88%',
    overflow: 'hidden',
  },

  mechanicModalGradientWrap: {
    padding: 2,
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
  },

  mechanicModalInner: {
    margin: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
    overflow: 'hidden',
  },

  mapCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5FA8D3',
    marginTop: 8,
    marginBottom: 4,
  },

  mapGradientWrap: {
    padding: 2,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },

  mapWrap: {
    width: '100%',
    minHeight: MODAL_MAP_HEIGHT - 4,
    height: MODAL_MAP_HEIGHT - 4,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#D0E8F4',
  },

  map: {
    width: '100%',
    height: '100%',
  },

  viewLargerMapBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#84D2F6',
    gap: 4,
  },

  viewLargerMapText: {
    fontSize: 13,
    color: '#5FA8D3',
    fontWeight: '500',
  },

  mapZoomControls: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },

  mapZoomBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mechanicListScroll: {
    maxHeight: 320,
    marginTop: 10,
  },

  mechanicCard: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 4,
  },

  mechanicCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },

  distancePill: {
    backgroundColor: '#E8F6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  distancePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5FA8D3',
  },

  mechanicAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },

  mechanicAddress: {
    fontSize: 12,
    color: '#8D8D8D',
    flex: 1,
  },

  mechanicRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },

  starRow: {
    flexDirection: 'row',
  },

  mechanicRatingText: {
    fontSize: 12,
    color: '#8D8D8D',
  },

  mechanicHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },

  mechanicHours: {
    fontSize: 12,
    color: '#8D8D8D',
  },

  servicePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },

  servicePillSmall: {
    backgroundColor: '#E8F6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  servicePillSmallText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5FA8D3',
  },

  reviewBox: {
    backgroundColor: '#E8F6FF',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#5FA8D3',
  },

  reviewBoxText: {
    fontSize: 12,
    color: '#5A5A5A',
    lineHeight: 18,
    fontStyle: 'italic',
  },

  mechanicActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  directionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5FA8D3',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },

  directionsBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },

  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5FA8D3',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },

  callBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5FA8D3',
  },

  modalBodyText: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20,
  },

  mapPlaceholder: {
    height: 160,
    borderRadius: 16,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  mapPlaceholderInner: {
    flex: 1,
    width: '100%',
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    gap: 8,
    paddingVertical: 16,
  },

  mapPlaceholderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5FA8D3',
  },

  mapPlaceholderSubtext: {
    fontSize: 13,
    color: '#8D8D8D',
  },

  mapPlaceholderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#84D2F6',
    gap: 6,
    marginTop: 4,
  },

  mechanicList: {
    marginTop: 14,
  },

  mechanicName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },

  mechanicMeta: {
    fontSize: 13,
    color: '#8D8D8D',
  },
});
