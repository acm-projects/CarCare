/**
 * My Garage — lists vehicles from `useGarage()`.
 */

import { Image } from 'expo-image';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedGradientBackground from '@/components/animatedBackground';
import { GradientText } from '@/styles/global';
import { useGarage } from '@/context/GarageContext';
import { selectGarageTags } from '@/lib/garage/selectGarageTags';
import { resolveVehicleImageSource } from '@/lib/garage/resolveVehicleImage';
import type { GarageVehicle, ServiceSeverity, VehicleServiceItem } from '@/types/garage';

// =============================================================================
// Constants & small helpers — tag colors/icons and gradient for “+” icon
// =============================================================================

const CAR_NAME_GRADIENT: readonly [string, string] = ['#53c1f3', '#3272ae'];

// Severity → badge color mapping for service tags on car cards
const SEVERITY_BADGE: Record<ServiceSeverity, string> = {
  red: '#FF6565',
  orange: '#FFA865',
  green: '#9DE38F',
};

// Icons for each case of severity (using Ionicons names)
function iconForSeverity(severity: ServiceSeverity): React.ComponentProps<typeof Ionicons>['name'] {
  switch (severity) {
    case 'red':
      return 'water';
    case 'orange':
      return 'flash';
    case 'green':
      return 'folder';
  }
}

//displays shortLabels/tiles for car services from the timeline page. If a shortLabel exists, it will be used; otherwise, the title will be shown.
function pillLabel(item: VehicleServiceItem): string {
  return item.shortLabel ?? item.title;
}

// =============================================================================
// Screen — scrollable list, loading/error, fixed log out
// =============================================================================

export default function MyGarageScreen() {
  const router = useRouter();
  const { vehicles, loading, error } = useGarage();

  const handleViewCar = () => {
    router.push('/dashboard');
  };

  const handleCreateNew = () => {
    router.push('/vinEnter');
  };

  const handleLogout = () => {
    router.replace('/logIn');
  };

  return (
    <View style={styles.root}>
      {/* Subtle animated gradient behind content */}
      <View style={styles.bgWrap} pointerEvents="none">
        <AnimatedGradientBackground timeSpeed={2.5} />
      </View>

      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <GradientText style={styles.titleGradient}>My Garage</GradientText>

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#5FA8D3" />
            </View>
          )}

          {error != null && <Text style={styles.errorText}>{error.message}</Text>}

          {!loading &&
            vehicles.map((car) => (
              <CarCard key={car.id} car={car} onPressView={handleViewCar} />
            ))}

          <NewCarCard onPress={handleCreateNew} />
        </ScrollView>

        <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#8D8D8D" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// =============================================================================
// Car card — name, subtitle, service pills, image, View CTA
// =============================================================================

type CarCardProps = {
  car: GarageVehicle;
  onPressView: () => void;
};

function CarCard({ car, onPressView }: CarCardProps) {
  const tags = selectGarageTags(car.services, 2);
  const imageSource = resolveVehicleImageSource(car);

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <GradientText style={styles.carNameGradient}>{car.displayName}</GradientText>
        <Text style={styles.carSubtitle}>{car.subtitle}</Text>

        {tags.length > 0 && (
          <View style={styles.statusRow}>
            {tags.map((item) => (
              <StatusPill key={item.id} item={item} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.viewButton} onPress={onPressView}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>

      <Image source={imageSource} style={styles.carImage} contentFit="contain" />
    </View>
  );
}

// =============================================================================
// Status pill — one timeline service as a compact tag (severity → color/icon)
// =============================================================================

type StatusPillProps = {
  item: VehicleServiceItem;
};

function StatusPill({ item }: StatusPillProps) {
  const badgeColor = SEVERITY_BADGE[item.severity];
  const iconName = iconForSeverity(item.severity);

  return (
    <View style={styles.statusPill}>
      <View style={[styles.statusIconBadge, { backgroundColor: badgeColor }]}>
        <Ionicons name={iconName} size={14} color="#FFFFFF" />
      </View>
      <Text style={styles.statusText}>{pillLabel(item)}</Text>
    </View>
  );
}

// =============================================================================
// “Create new car profile” row — gradient title + masked gradient plus
// =============================================================================

type NewCarCardProps = {
  onPress: () => void;
};

function NewCarGradientPlus({ size }: { size: number }) {
  return (
    <MaskedView style={{ width: size, height: size }} maskElement={<PlusMask size={size} />}>
      <LinearGradient
        colors={CAR_NAME_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: size, height: size }}
      >
        <View style={{ width: size, height: size, opacity: 0 }} />
      </LinearGradient>
    </MaskedView>
  );
}

function PlusMask({ size }: { size: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Ionicons name="add" size={size} color="#000000" />
    </View>
  );
}

function NewCarCard({ onPress }: NewCarCardProps) {
  return (
    <TouchableOpacity style={styles.newCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.newCardTextWrap}>
        <GradientText style={styles.newCardText}>
          Create new{'\n'}car profile
        </GradientText>
      </View>
      <NewCarGradientPlus size={44} />
    </TouchableOpacity>
  );
}

// =============================================================================
// Styles
// =============================================================================

const cardElevation = {
  shadowColor: '#000' as const,
  shadowOpacity: 0.12,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 5,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  bgWrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },

  screen: {
    flex: 1,
    backgroundColor: 'rgba(243, 243, 243, 0.94)',
    zIndex: 1,
  },

  scrollContent: {
    paddingTop: 12,
    paddingHorizontal: 22,
    paddingBottom: 120,
  },

  titleGradient: {
    fontSize: 38,
    fontWeight: '400',
    marginBottom: 14,
    marginLeft: 6,
    marginTop: 0,
    alignSelf: 'flex-start',
  },

  loadingRow: {
    paddingVertical: 12,
    alignItems: 'center',
  },

  errorText: {
    color: '#E53935',
    fontSize: 14,
    marginBottom: 12,
  },

  card: {
    width: '100%',
    minHeight: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginBottom: 18,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    ...cardElevation,
  },

  cardLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: 8,
  },

  carNameGradient: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },

  carSubtitle: {
    fontSize: 14,
    color: '#8D8D8D',
    marginTop: 4,
    marginBottom: 8,
  },

  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 999,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },

  statusIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusText: {
    fontSize: 12,
    color: '#8D8D8D',
    fontWeight: '500',
    lineHeight: 14,
  },

  viewButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#84D2F6',
    borderRadius: 999,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 6,
  },

  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 18,
  },

  carImage: {
    width: 220,
    height: 150,
    marginLeft: -10,
  },

  newCard: {
    width: '100%',
    minHeight: 175,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...cardElevation,
  },

  newCardTextWrap: {
    flex: 1,
    paddingRight: 8,
  },

  newCardText: {
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 38,
  },

  logoutContainer: {
    position: 'absolute',
    bottom: 34,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  logoutText: {
    color: '#8D8D8D',
    fontSize: 18,
    fontWeight: '400',
  },
});
