import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '@/styles/global';

export default function Dashboard() {
  const router = useRouter();
  const [showAAAModal, setShowAAAModal] = useState(false);
  const [showMechanicModal, setShowMechanicModal] = useState(false);

  const handleScanPress = () => {
    router.push('/myGarage');
  };

  const handleServiceTimelinePress = () => {
    router.push('/myGarage');
  };

  return (
    <View style={[globalStyles.container, styles.screen]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
        <View style={styles.heroCard}>
          <View style={styles.heroImagePlaceholder}>
            <Text style={styles.heroPlaceholderText}>Your car snapshot</Text>
          </View>
        </View>

        {/* Upcoming services card */}
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

        {/* Need Help row with three actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Need Help</Text>
          <View style={styles.helpRow}>
            <TouchableOpacity
              style={styles.helpTile}
              activeOpacity={0.85}
              onPress={() => setShowAAAModal(true)}
            >
              <Ionicons name="call-outline" size={24} color="#5FA8D3" />
              <Text style={styles.helpTitle}>Call AAA{'\n'}Helpline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helpTile}
              activeOpacity={0.85}
              onPress={() => setShowMechanicModal(true)}
            >
              <Ionicons name="map-outline" size={24} color="#5FA8D3" />
              <Text style={styles.helpTitle}>Nearby{'\n'}Mechanics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helpTile}
              activeOpacity={0.85}
              onPress={handleScanPress}
            >
              <Ionicons name="scan-circle-outline" size={26} color="#5FA8D3" />
              <Text style={styles.helpTitle}>Scan{'\n'}Vehicle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* General Tips with icons and bullet lists */}
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
      </ScrollView>

      {/* AAA popup */}
      <Modal
        visible={showAAAModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAAAModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowAAAModal(false)}
        >
          <Pressable style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AAA Roadside Assistance</Text>
              <Pressable onPress={() => setShowAAAModal(false)}>
                <Ionicons name="close" size={22} color="#8D8D8D" />
              </Pressable>
            </View>
            <Text style={styles.modalBodyText}>
              24/7 emergency helpline:{'\n'}
              1-800-AAA-HELP{'\n'}
              (1-800-222-4357)
            </Text>
            <Text style={[styles.modalBodyText, { marginTop: 10 }]}>
              Before you call, have this ready:{'\n'}• AAA membership number{'\n'}•
              Vehicle make & model{'\n'}• Your location
            </Text>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Nearby mechanics popup */}
      <Modal
        visible={showMechanicModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowMechanicModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowMechanicModal(false)}
        >
          <Pressable style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nearby Mechanics</Text>
              <Pressable onPress={() => setShowMechanicModal(false)}>
                <Ionicons name="close" size={22} color="#8D8D8D" />
              </Pressable>
            </View>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.heroPlaceholderText}>Map preview</Text>
            </View>
            <View style={styles.mechanicList}>
              <Text style={styles.mechanicName}>Baker's Spring Valley Automotive</Text>
              <Text style={styles.mechanicMeta}>4.8 • 2.1 mi • Open until 7 PM</Text>
              <Text style={[styles.mechanicName, { marginTop: 12 }]}>
                Precision Auto Care
              </Text>
              <Text style={styles.mechanicMeta}>4.6 • 3.4 mi • Open until 6 PM</Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F3F3F3',
  },

  scrollContent: {
    paddingTop: 70,
    paddingHorizontal: 18,
    paddingBottom: 140,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
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
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
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
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5FA8D3',
    marginBottom: 10,
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

  helpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  helpTile: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#F6FBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  helpTitle: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    color: '#5FA8D3',
    fontWeight: '500',
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

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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